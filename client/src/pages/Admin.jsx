import { useState, useEffect, useCallback } from 'react';
import { useNavigate }  from 'react-router-dom';
import { getOrders, updateStatus, getDailySummary, getMonthlySummary, getAdminProducts, updateProduct, createOrder, deleteOrder, updateOrder } from '../services/api.js';
import { supabase } from '../services/supabase.js';
import StatusBadge, { STATUS_CONFIG } from '../components/StatusBadge.jsx';

const STATUS_LIST = ['pendiente', 'preparando', 'en_camino', 'entregado', 'cancelado'];

const STATUS_TAB = [
  { value: '',           label: 'Todos',      dot: 'bg-gray-400' },
  { value: 'pendiente',  label: 'Pendientes', dot: 'bg-amber-400' },
  { value: 'preparando', label: 'Preparando', dot: 'bg-blue-400' },
  { value: 'en_camino',  label: 'En camino',  dot: 'bg-orange-400' },
  { value: 'entregado',  label: 'Entregados', dot: 'bg-green-400' },
  { value: 'cancelado',  label: 'Cancelados', dot: 'bg-gray-300' },
];

const CARD_BORDER = {
  pendiente:  'border-l-amber-400',
  preparando: 'border-l-blue-400',
  en_camino:  'border-l-orange-400',
  entregado:  'border-l-green-400',
  cancelado:  'border-l-gray-300',
};

export default function Admin() {
  const navigate   = useNavigate();
  const adminUser  = JSON.parse(localStorage.getItem('admin_user') || '{}');

  const [activeTab,   setActiveTab]   = useState('pedidos');
  const [products,    setProducts]    = useState([]);
  const [prodLoading, setProdLoading] = useState(false);
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filters,  setFilters]  = useState({ status: '', date: todayISO() });
  const [page,     setPage]     = useState(1);
  const [total,    setTotal]    = useState(0);
  const [selected,     setSelected]     = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const LIMIT = 20;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT };
      if (filters.status) params.status = filters.status;
      if (filters.date)   params.date   = filters.date;
      const oRes = await getOrders(params);
      setOrders(oRes.data.orders);
      setTotal(oRes.data.total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate('/admin/login');
    });
  }, [navigate]);

  const loadProducts = useCallback(async () => {
    setProdLoading(true);
    try {
      const res = await getAdminProducts();
      setProducts(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setProdLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'productos') loadProducts();
  }, [activeTab, loadProducts]);

  const handleProductField = async (id, field, value) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
    try {
      await updateProduct(id, { [field]: value });
    } catch {
      alert('Error al guardar el cambio.');
      loadProducts();
    }
  };

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    const id = setInterval(load, 30_000);
    return () => clearInterval(id);
  }, [load]);

  const handleDelete = async (orderId) => {
    if (!window.confirm('¿Eliminar este pedido? Esta acción no se puede deshacer.')) return;
    try {
      await deleteOrder(orderId);
      setOrders(prev => prev.filter(o => o.id !== orderId));
      setSelected(null);
      load();
    } catch {
      alert('Error al eliminar el pedido.');
    }
  };

  const handleEdit = async (orderId, orderData) => {
    try {
      await updateOrder(orderId, orderData);
      setEditingOrder(null);
      setSelected(null);
      load();
    } catch {
      alert('Error al guardar los cambios.');
    }
  };

  const handleStatus = async (orderId, status) => {
    try {
      await updateStatus(orderId, status);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      if (selected?.id === orderId) setSelected(prev => ({ ...prev, status }));
      load();
    } catch {
      alert('Error al actualizar el estado.');
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ── Header ── */}
      <header className="bg-brand-900 px-3 sm:px-8 h-14 flex items-center gap-2">
        {/* Logo */}
        <img src="/fotos/logo.jpeg" alt="logo"
          className="w-8 h-8 rounded-full object-cover ring-2 ring-gold-400/40 shrink-0"
          onError={e => { e.target.style.display = 'none'; }} />

        {/* Nav tabs — centrado, scrollable en móvil */}
        <nav className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {[
            { id: 'pedidos',   label: 'Pedidos' },
            { id: 'resumen',   label: 'Resumen' },
            { id: 'productos', label: 'Productos' },
            { id: 'nuevo',     label: '+ Pedido' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all
                ${activeTab === tab.id
                  ? 'bg-gold-400 text-brand-900 shadow-sm'
                  : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Acciones */}
        <div className="flex items-center gap-1 shrink-0">
          <button onClick={load}
            className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            title="Actualizar">
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
          </button>
          <button onClick={logout}
            className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            title="Cerrar sesión">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
          </button>
        </div>
      </header>

      {/* ── Hero ── */}
      <div className="bg-brand-900 px-4 sm:px-8 pt-5 pb-6">
        <p className="text-gold-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Panel de Control</p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
          {activeTab === 'pedidos' ? 'Gestión de Pedidos' : activeTab === 'resumen' ? 'Resumen del Día' : activeTab === 'productos' ? 'Catálogo de Productos' : 'Nuevo Pedido Manual'}
        </h1>
        <p className="text-white/50 text-sm mt-1">{formatDateLong()}</p>
      </div>

      {/* ── Main ── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-5 space-y-4">

        {/* ── Vista: Resumen ── */}
        {activeTab === 'resumen' && <ResumenTab setActiveTab={setActiveTab} />}

        {/* ── Vista: Pedidos ── */}
        {activeTab === 'pedidos' && <>

        {/* Filtros */}
        <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Filtrar por estado</p>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
            {STATUS_TAB.map(tab => (
              <button key={tab.value}
                onClick={() => { setFilters(f => ({ ...f, status: tab.value })); setPage(1); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all
                  ${filters.status === tab.value
                    ? 'bg-brand-900 text-gold-400 shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${tab.dot}`} />
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 pt-1 border-t border-gray-50">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider shrink-0">Fecha</label>
            <input type="date" value={filters.date}
              onChange={e => { setFilters(f => ({ ...f, date: e.target.value })); setPage(1); }}
              className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-brand-400" />
            <button onClick={() => { setFilters({ status: '', date: todayISO() }); setPage(1); }}
              className="text-xs text-gray-400 hover:text-brand-700 font-semibold transition-colors">
              Hoy
            </button>
          </div>
        </div>

        {/* Lista */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-gray-900 text-base">Pedidos recientes</h2>
              {total > 0 && (
                <span className="bg-brand-900 text-gold-400 text-xs font-bold px-2 py-0.5 rounded-full">
                  {total}
                </span>
              )}
            </div>
            {loading && (
              <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            )}
          </div>

          {orders.length === 0 && !loading ? (
            <div className="bg-white rounded-2xl shadow-sm text-center py-16 text-gray-400">
              <span className="text-5xl">📋</span>
              <p className="mt-3 font-semibold text-gray-500">No hay pedidos con estos filtros</p>
              <p className="text-sm mt-1">Intenta cambiar la fecha o el estado</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onStatusChange={s => handleStatus(order.id, s)}
                  onDetail={() => setSelected(order)}
                />
              ))}
            </div>
          )}

          {total > LIMIT && (
            <div className="mt-5 flex items-center justify-between text-sm">
              <span className="text-gray-400 text-xs">
                {Math.min((page - 1) * LIMIT + 1, total)}–{Math.min(page * LIMIT, total)} de {total} pedidos
              </span>
              <div className="flex gap-2">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-xl disabled:opacity-40
                             hover:bg-gray-50 font-semibold text-sm transition-colors">
                  ← Anterior
                </button>
                <button disabled={page * LIMIT >= total} onClick={() => setPage(p => p + 1)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-xl disabled:opacity-40
                             hover:bg-gray-50 font-semibold text-sm transition-colors">
                  Siguiente →
                </button>
              </div>
            </div>
          )}
        </div>
        </>}

        {/* ── Vista: Nuevo Pedido Manual ── */}
        {activeTab === 'nuevo' && (
          <ManualOrderForm
            onCreated={() => { load(); setActiveTab('pedidos'); }}
          />
        )}

        {/* ── Vista: Productos ── */}
        {activeTab === 'productos' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Activa/desactiva disponibilidad y edita precios en tiempo real.</p>
              <button onClick={loadProducts}
                className="flex items-center gap-1.5 text-xs font-semibold text-gray-500
                           hover:text-brand-700 transition-colors">
                <svg className={`w-3.5 h-3.5 ${prodLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                Actualizar
              </button>
            </div>

            {prodLoading && products.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm text-center py-16 text-gray-400">
                <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm font-medium">Cargando productos...</p>
              </div>
            ) : (
              <ProductTable
                products={products}
                onToggle={(id, val) => handleProductField(id, 'available', val)}
                onPriceChange={(id, val) => handleProductField(id, 'price', val)}
                onStockChange={(id, val) => handleProductField(id, 'stock', val)}
              />
            )}
          </div>
        )}

      </main>

      {selected && (
        <OrderDetailModal
          order={selected}
          onClose={() => setSelected(null)}
          onStatusChange={s => handleStatus(selected.id, s)}
          onDelete={() => handleDelete(selected.id)}
          onEdit={() => {
            setEditingOrder(selected);
            setSelected(null);
            if (products.length === 0) loadProducts();
          }}
        />
      )}

      {editingOrder && (
        <EditOrderModal
          order={editingOrder}
          allProducts={products}
          onClose={() => setEditingOrder(null)}
          onSave={data => handleEdit(editingOrder.id, data)}
        />
      )}
    </div>
  );
}

// ── KPI Card ─────────────────────────────────────────────────────────────────

const ACCENT = {
  gray:   { bg: 'bg-white',      border: 'border-gray-100',   icon: 'text-gray-400',   val: 'text-gray-900',  label: 'text-gray-400' },
  amber:  { bg: 'bg-white',      border: 'border-amber-100',  icon: 'text-amber-500',  val: 'text-amber-700', label: 'text-amber-400' },
  blue:   { bg: 'bg-white',      border: 'border-blue-100',   icon: 'text-blue-500',   val: 'text-blue-700',  label: 'text-blue-400' },
  orange: { bg: 'bg-white',      border: 'border-orange-100', icon: 'text-orange-500', val: 'text-orange-700',label: 'text-orange-400' },
  green:  { bg: 'bg-white',      border: 'border-green-100',  icon: 'text-green-500',  val: 'text-green-700', label: 'text-green-400' },
  gold:   { bg: 'bg-brand-900',  border: 'border-brand-800',  icon: 'text-gold-400',   val: 'text-gold-400',  label: 'text-gold-400/70' },
};

function KpiCard({ icon, label, value, accent = 'gray' }) {
  const c = ACCENT[accent];
  return (
    <div className={`${c.bg} border ${c.border} rounded-2xl shadow-sm px-4 py-3.5 flex flex-col gap-1.5`}>
      <span className={`text-lg ${c.icon}`}>{icon}</span>
      <span className={`text-2xl font-extrabold leading-none ${c.val}`}>{value}</span>
      <span className={`text-[11px] font-semibold leading-tight ${c.label}`}>{label}</span>
    </div>
  );
}

// ── Order Card ────────────────────────────────────────────────────────────────

function OrderCard({ order, onStatusChange, onDetail }) {
  const border = CARD_BORDER[order.status] || 'border-l-gray-200';
  return (
    <div className={`bg-white rounded-2xl shadow-sm border-l-4 ${border} overflow-hidden`}>
      <div className="flex items-center justify-between px-4 pt-3 pb-2.5 border-b border-gray-50">
        <div className="flex items-center gap-2.5">
          <span className="font-mono font-bold text-brand-700 text-sm tracking-tight">{order.order_number}</span>
          <StatusBadge status={order.status} />
        </div>
        <span className="text-xs text-gray-400 font-medium">{formatTime(order.created_at)}</span>
      </div>

      <div className="px-4 py-3 grid sm:grid-cols-2 gap-3">
        <div>
          <p className="font-bold text-gray-900 text-sm">{order.customer_name}</p>
          <p className="text-xs text-gray-400 mt-0.5">{order.customer_phone}</p>
          {order.customer_address && (
            <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[220px]">{order.customer_address}</p>
          )}
        </div>
        <div className="flex flex-col items-start sm:items-end gap-1">
          <span className="text-xl font-extrabold text-gray-900">
            ${parseFloat(order.total).toFixed(2)}
          </span>
          <span className="text-xs text-gray-400">
            {order.payment_method === 'efectivo' ? '💵 Efectivo' : '💳 Tarjeta'}
          </span>
          {order.items?.length > 0 && (
            <p className="text-xs text-gray-400 text-right leading-relaxed">
              {order.items.slice(0, 2).map(i => `${i.quantity}× ${i.product_name}`).join(' · ')}
              {order.items.length > 2 && ` +${order.items.length - 2} más`}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 px-4 pb-3 flex-wrap border-t border-gray-50 pt-2.5">
        <select value={order.status} onChange={e => onStatusChange(e.target.value)}
          className="text-xs border border-gray-200 rounded-xl px-3 py-2 bg-white font-semibold
                     focus:outline-none focus:ring-2 focus:ring-brand-400 text-gray-700 cursor-pointer">
          {STATUS_LIST.map(s => (
            <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
          ))}
        </select>
        <button onClick={onDetail}
          className="flex items-center gap-1.5 text-xs font-semibold border border-gray-200
                     px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors text-gray-600">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
          </svg>
          Ver detalle
        </button>
        <a href={buildNotifyLink(order)} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-semibold bg-[#25D366] hover:bg-[#20b858]
                     text-white px-3 py-2 rounded-xl transition-colors">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          WhatsApp
        </a>
      </div>
    </div>
  );
}

// ── Order Detail Modal ────────────────────────────────────────────────────────

function OrderDetailModal({ order, onClose, onStatusChange, onDelete, onEdit }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-5 pt-5 pb-3 border-b border-gray-100 z-10">
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4 sm:hidden" />
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-extrabold text-gray-900 text-base">{order.order_number}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{new Date(order.created_at).toLocaleString('es-MX')}</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={order.status} />
              <button onClick={onClose}
                className="p-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 space-y-5">
          <section>
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Cliente</h4>
            <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
              <InfoRow icon="👤" value={order.customer_name} bold />
              <InfoRow icon="📱" value={order.customer_phone} />
              <InfoRow icon="📍" value={order.customer_address} />
              {order.customer_references && <InfoRow icon="🏠" value={order.customer_references} />}
              <InfoRow icon={order.payment_method === 'efectivo' ? '💵' : '💳'}
                value={order.payment_method === 'efectivo' ? 'Pago en efectivo' : 'Tarjeta / Transferencia'} />
            </div>
          </section>

          <section>
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Productos</h4>
            <div className="bg-gray-50 rounded-2xl overflow-hidden">
              {(order.items || []).map((item, i) => (
                <div key={i}
                  className="flex justify-between items-center px-4 py-2.5 text-sm border-b border-gray-100 last:border-0">
                  <span className="text-gray-700">
                    <span className="font-bold text-gray-900">{item.quantity}×</span> {item.product_name}
                  </span>
                  <span className="font-semibold text-gray-900">${parseFloat(item.item_total).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between px-4 py-3 font-extrabold text-base border-t-2 border-gray-200 bg-white">
                <span>Total</span>
                <span className="text-brand-700">${parseFloat(order.total).toFixed(2)}</span>
              </div>
            </div>
          </section>

          {order.notes && (
            <div className="flex gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 text-sm">
              <span>📝</span>
              <span className="text-amber-800">{order.notes}</span>
            </div>
          )}

          <section>
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Cambiar estado</h4>
            <div className="grid grid-cols-2 gap-2">
              {STATUS_LIST.map(s => (
                <button key={s} onClick={() => onStatusChange(s)}
                  className={`py-3 rounded-2xl text-sm font-bold transition-all
                    ${order.status === s
                      ? 'bg-brand-900 text-gold-400 shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {STATUS_CONFIG[s].label}
                </button>
              ))}
            </div>
          </section>

          {/* Editar / Eliminar */}
          <div className="grid grid-cols-2 gap-2">
            <button onClick={onEdit}
              className="flex items-center justify-center gap-2 py-3 rounded-2xl
                         bg-blue-50 border border-blue-200 text-blue-700 font-bold text-sm hover:bg-blue-100 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
              Editar pedido
            </button>
            <button onClick={onDelete}
              className="flex items-center justify-center gap-2 py-3 rounded-2xl
                         bg-red-50 border border-red-200 text-red-600 font-bold text-sm hover:bg-red-100 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
              Eliminar pedido
            </button>
          </div>

          {/* Ticket buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => printTicket(order)}
              className="flex items-center justify-center gap-2 py-3 rounded-2xl
                         border-2 border-brand-900 text-brand-900 font-bold text-sm hover:bg-brand-50 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              </svg>
              Descargar ticket
            </button>
            <a href={buildTicketWhatsApp(order)} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 rounded-2xl
                         bg-[#25D366] hover:bg-[#20b858] text-white font-bold text-sm transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Enviar ticket
            </a>
          </div>

          <a href={buildNotifyLink(order)} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20b858]
                       text-white font-bold py-4 rounded-2xl transition-colors shadow-sm">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Avisar al cliente — ¡Pedido listo!
          </a>
          <p className="text-center text-xs text-gray-400 -mt-3 pb-1">
            Abre WhatsApp con mensaje pre-escrito para {order.customer_name}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Daily Prices ─────────────────────────────────────────────────────────────

function DailyPrices() {
  const [items,   setItems]   = useState([]);
  const [editing, setEditing] = useState(null);
  const [tempVal, setTempVal] = useState('');
  const [saved,   setSaved]   = useState(null);

  useEffect(() => {
    supabase
      .from('products')
      .select('id, name, price, unit')
      .in('category_id', [1, 2])
      .order('category_id').order('sort_order')
      .then(({ data }) => { if (data) setItems(data); });
  }, []);

  const startEdit = (item) => {
    setEditing(item.id);
    setTempVal(String(item.price ?? ''));
  };

  const commit = async (item) => {
    const val = parseFloat(tempVal);
    if (!isNaN(val) && val >= 0) {
      await updateProduct(item.id, { price: val });
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, price: val } : i));
      setSaved(item.id);
      setTimeout(() => setSaved(null), 2000);
    }
    setEditing(null);
  };

  if (items.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="px-4 py-3 bg-brand-900 flex items-center justify-between">
        <span className="font-bold text-white text-sm">🐔 Precios del día — por kg</span>
        <span className="text-gold-400/60 text-xs">Toca el precio para editar</span>
      </div>
      <div className="grid grid-cols-3 divide-x divide-gray-100">
        {items.map(item => (
          <div key={item.id} className="flex flex-col items-center justify-center py-5 px-2 gap-1.5">
            <p className="text-xs font-bold text-gray-500 text-center leading-tight">{item.name}</p>
            {editing === item.id ? (
              <div className="flex items-center gap-0.5">
                <span className="text-gray-400 text-sm font-bold">$</span>
                <input
                  type="number" min="0" step="1" value={tempVal}
                  onChange={e => setTempVal(e.target.value)}
                  onBlur={() => commit(item)}
                  onKeyDown={e => { if (e.key === 'Enter') commit(item); if (e.key === 'Escape') setEditing(null); }}
                  className="w-16 text-center border-b-2 border-brand-500 text-xl font-extrabold
                             focus:outline-none bg-transparent"
                  autoFocus />
              </div>
            ) : (
              <button onClick={() => startEdit(item)}
                className="flex flex-col items-center group">
                <span className={`text-2xl font-extrabold transition-colors
                  ${saved === item.id ? 'text-green-500' : 'text-brand-700 group-hover:text-brand-500'}`}>
                  ${parseFloat(item.price || 0).toFixed(0)}
                </span>
                <span className="text-[10px] text-gray-400 font-medium mt-0.5">
                  {saved === item.id ? '✓ Guardado' : 'por kg · editar'}
                </span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── SVG Charts ───────────────────────────────────────────────────────────────

function PieChart({ slices }) {
  const total = slices.reduce((s, d) => s + d.value, 0);
  if (total === 0) return (
    <div className="flex items-center justify-center h-28 text-gray-300 text-xs">Sin datos</div>
  );

  function pt(cx, cy, r, deg) {
    const rad = ((deg - 90) * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  }

  const cx = 60, cy = 60, R = 52, ri = 30;
  let angle = 0;

  return (
    <svg viewBox="0 0 120 120" className="w-28 h-28">
      {slices.filter(s => s.value > 0).map((s, i) => {
        const start = angle;
        const sweep = (s.value / total) * 360;
        angle += sweep;
        const end = angle;
        const [x1, y1] = pt(cx, cy, R, start);
        const [x2, y2] = pt(cx, cy, R, end);
        const [ix1, iy1] = pt(cx, cy, ri, start);
        const [ix2, iy2] = pt(cx, cy, ri, end);
        const large = sweep > 180 ? 1 : 0;
        const d = `M ${ix1} ${iy1} L ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${ri} ${ri} 0 ${large} 0 ${ix1} ${iy1} Z`;
        return <path key={i} d={d} fill={s.color} stroke="white" strokeWidth="1.5" />;
      })}
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="15" fontWeight="800" fill="#111">{total}</text>
      <text x={cx} y={cy + 11} textAnchor="middle" fontSize="7.5" fill="#999">pedidos</text>
    </svg>
  );
}

function BarChart({ data }) {
  const max = Math.max(...data.map(d => d.revenue), 1);
  const H = 64, bW = 8, gap = 3, W = data.length * (bW + gap);
  return (
    <div className="overflow-x-auto pb-1">
      <svg viewBox={`0 0 ${W} ${H + 18}`} style={{ minWidth: W + 'px', height: 90 }}>
        {data.map((d, i) => {
          const h = Math.max(2, (d.revenue / max) * H);
          const x = i * (bW + gap);
          return (
            <g key={i}>
              <rect x={x} y={H - h} width={bW} height={h}
                fill={h > 4 ? '#eab308' : '#e5e7eb'} rx="2" />
              {(d.day === 1 || d.day % 5 === 0) && (
                <text x={x + bW / 2} y={H + 13} textAnchor="middle"
                  fontSize="7" fill="#9ca3af">{d.day}</text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Resumen Tab ───────────────────────────────────────────────────────────────

function ResumenTab({ setActiveTab }) {
  const [mode,  setMode]  = useState('day');
  const [selDate,  setSelDate]  = useState(todayISO());
  const [selMonth, setSelMonth] = useState(todayISO().slice(0, 7));
  const [data,  setData]  = useState(null);
  const [busy,  setBusy]  = useState(false);

  useEffect(() => {
    let cancelled = false;
    setBusy(true);
    const fetch = async () => {
      try {
        let res;
        if (mode === 'day') {
          res = await getDailySummary(selDate);
        } else {
          const [y, m] = selMonth.split('-').map(Number);
          res = await getMonthlySummary(y, m);
        }
        if (!cancelled) setData(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setBusy(false);
      }
    };
    fetch();
    return () => { cancelled = true; };
  }, [mode, selDate, selMonth]);

  const STATUS_SLICES = data ? [
    { label: 'Pendientes', value: data.pending,    color: '#fbbf24' },
    { label: 'Preparando', value: data.preparing,  color: '#60a5fa' },
    { label: 'En camino',  value: data.on_the_way, color: '#fb923c' },
    { label: 'Entregados', value: data.delivered,  color: '#4ade80' },
    { label: 'Cancelados', value: data.cancelled,  color: '#d1d5db' },
  ] : [];

  const modeLabel = mode === 'day' ? 'del día' : 'del mes';

  return (
    <div className="space-y-4">
      <DailyPrices />

      {/* Filtros de periodo */}
      <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
        <div className="flex gap-2">
          {[{ id: 'day', label: 'Por día' }, { id: 'month', label: 'Por mes' }].map(m => (
            <button key={m.id} onClick={() => setMode(m.id)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all
                ${mode === m.id ? 'bg-brand-900 text-gold-400' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {m.label}
            </button>
          ))}
        </div>
        {mode === 'day' ? (
          <input type="date" value={selDate}
            onChange={e => setSelDate(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
        ) : (
          <input type="month" value={selMonth}
            onChange={e => setSelMonth(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400" />
        )}
      </div>

      {busy && (
        <div className="bg-white rounded-2xl shadow-sm text-center py-12 text-gray-400">
          <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-medium">Cargando...</p>
        </div>
      )}

      {!busy && data && (<>
        {/* KPI ingresos */}
        <div className="bg-brand-900 rounded-2xl shadow-sm p-6">
          <p className="text-gold-400/70 text-xs font-bold uppercase tracking-wider mb-1">
            Ingresos {modeLabel}
          </p>
          <p className="text-4xl font-extrabold text-gold-400">
            ${parseFloat(data.total_revenue || 0).toFixed(2)}
          </p>
          <p className="text-white/40 text-sm mt-1">{data.total_orders} pedidos en total</p>
        </div>

        {/* Gráfica de barras (solo en mes) */}
        {mode === 'month' && data.daily && (
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">
              Ingresos por día (mes)
            </p>
            <BarChart data={data.daily} />
            <p className="text-[10px] text-gray-300 text-right mt-1">día del mes →</p>
          </div>
        )}

        {/* Status: pastel + lista */}
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">
            Estado de pedidos
          </p>
          <div className="flex items-center gap-6">
            <PieChart slices={STATUS_SLICES} />
            <div className="flex-1 space-y-2.5">
              {STATUS_SLICES.map(row => (
                <div key={row.label} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: row.color }} />
                    <span className="text-gray-600 font-medium">{row.label}</span>
                  </div>
                  <span className="font-extrabold text-gray-900">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button onClick={() => setActiveTab('pedidos')}
          className="w-full bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between
                     hover:bg-gray-50 transition-colors group">
          <span className="font-bold text-gray-700">Ver lista de pedidos</span>
          <span className="text-brand-700 group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </>)}
    </div>
  );
}

// ── Edit Order Modal ──────────────────────────────────────────────────────────

function EditOrderModal({ order, allProducts, onClose, onSave }) {
  const [customer, setCustomer] = useState({
    name:  order.customer_name  || '',
    phone: order.customer_phone || '',
  });
  const [payment,    setPayment]    = useState(order.payment_method || 'efectivo');
  const [notes,      setNotes]      = useState(order.notes || '');
  const [cart,       setCart]       = useState(
    (order.items || []).map(i => ({
      id:    i.product_id,
      name:  i.product_name,
      price: parseFloat(i.unit_price),
      qty:   i.quantity,
    }))
  );
  const [search,     setSearch]     = useState('');
  const [saving,     setSaving]     = useState(false);

  const available = (allProducts.length > 0 ? allProducts : []).filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (p) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id);
      if (ex) return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: p.id, name: p.name, price: parseFloat(p.price || 0), qty: 1 }];
    });
  };

  const setQty = (id, qty) => {
    if (qty < 1) setCart(prev => prev.filter(i => i.id !== id));
    else setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  };

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const save = async () => {
    if (!customer.name.trim() || !customer.phone.trim() || cart.length === 0) {
      alert('Completa nombre, teléfono y al menos un producto.');
      return;
    }
    setSaving(true);
    await onSave({
      customer_name:  customer.name,
      customer_phone: customer.phone,
      payment_method: payment,
      notes,
      items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.qty })),
    });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white px-5 pt-5 pb-3 border-b border-gray-100 z-10">
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4 sm:hidden" />
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-gray-900">Editar — {order.order_number}</h3>
            <button onClick={onClose} className="p-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors">
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Cliente */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cliente</h4>
            {[
              { key: 'name',  label: 'Nombre',   placeholder: 'Nombre completo' },
              { key: 'phone', label: 'Teléfono', placeholder: '10 dígitos' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-semibold text-gray-400 mb-1">{f.label}</label>
                <input type="text" value={customer[f.key]} placeholder={f.placeholder}
                  onChange={e => setCustomer(c => ({ ...c, [f.key]: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm
                             focus:outline-none focus:ring-2 focus:ring-brand-400" />
              </div>
            ))}
          </div>

          {/* Productos */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Productos</h4>
            <input type="text" placeholder="Buscar producto…" value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-brand-400" />
            <div className="max-h-36 overflow-y-auto border border-gray-100 rounded-xl divide-y divide-gray-50">
              {available.map(p => (
                <div key={p.id} className="flex items-center justify-between px-3 py-2 hover:bg-gray-50">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{p.name}</p>
                    <p className="text-xs text-gray-400">${parseFloat(p.price || 0).toFixed(0)}</p>
                  </div>
                  <button onClick={() => addToCart(p)}
                    className="w-7 h-7 rounded-full bg-brand-900 text-white font-bold text-lg
                               flex items-center justify-center hover:bg-brand-700 transition-colors">+</button>
                </div>
              ))}
              {available.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-4">Sin resultados</p>
              )}
            </div>

            {/* Carrito */}
            {cart.length > 0 && (
              <div className="border border-gray-100 rounded-xl divide-y divide-gray-50 mt-1">
                {cart.map(i => (
                  <div key={i.id ?? i.name} className="flex items-center gap-2 px-3 py-2">
                    <span className="flex-1 text-sm font-semibold text-gray-900 truncate">{i.name}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button onClick={() => setQty(i.id ?? i.name, i.qty - 1)}
                        className="w-6 h-6 rounded-full border border-gray-200 text-gray-600 font-bold flex items-center justify-center hover:bg-gray-100">−</button>
                      <span className="w-5 text-center font-bold text-sm">{i.qty}</span>
                      <button onClick={() => setQty(i.id ?? i.name, i.qty + 1)}
                        className="w-6 h-6 rounded-full border border-gray-200 text-gray-600 font-bold flex items-center justify-center hover:bg-gray-100">+</button>
                    </div>
                    <span className="text-sm font-bold text-gray-900 w-14 text-right shrink-0">
                      ${(i.price * i.qty).toFixed(0)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between px-3 py-2.5 font-extrabold text-sm bg-gray-50">
                  <span>Total</span>
                  <span className="text-brand-700">${subtotal.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Pago */}
          <div>
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Pago</h4>
            <div className="flex gap-2">
              {[['efectivo','💵 Efectivo'],['tarjeta','💳 Tarjeta']].map(([v, l]) => (
                <button key={v} onClick={() => setPayment(v)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all
                    ${payment === v ? 'bg-brand-900 text-gold-400' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Notas */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Notas</label>
            <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none
                         focus:outline-none focus:ring-2 focus:ring-brand-400" />
          </div>

          <button onClick={save} disabled={saving}
            className="w-full py-4 bg-brand-900 hover:bg-brand-800 text-gold-400 font-extrabold
                       rounded-2xl text-base transition-colors disabled:opacity-60">
            {saving ? 'Guardando…' : `Guardar cambios · $${subtotal.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Manual Order Form ─────────────────────────────────────────────────────────

function ManualOrderForm({ onCreated }) {
  const [customer,    setCustomer]    = useState({ name: '', phone: '', address: '', references: '' });
  const [payment,     setPayment]     = useState('efectivo');
  const [notes,       setNotes]       = useState('');
  const [cart,        setCart]        = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [search,      setSearch]      = useState('');
  const [submitting,  setSubmitting]  = useState(false);
  const [success,     setSuccess]     = useState(null);

  useEffect(() => {
    getAdminProducts().then(r => setAllProducts(r.data.filter(p => p.available)));
  }, []);

  const addToCart = (p) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id);
      if (ex) return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: p.id, name: p.name, price: parseFloat(p.price || 0), qty: 1 }];
    });
  };

  const setQty = (id, qty) => {
    if (qty < 1) setCart(prev => prev.filter(i => i.id !== id));
    else setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  };

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const filtered = allProducts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const reset = () => {
    setCustomer({ name: '', phone: '', address: '', references: '' });
    setPayment('efectivo');
    setNotes('');
    setCart([]);
    setSearch('');
    setSuccess(null);
  };

  const submit = async () => {
    if (!customer.name.trim() || !customer.phone.trim() || cart.length === 0) {
      alert('Completa nombre, teléfono y agrega al menos un producto.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await createOrder({
        customer_name:       customer.name,
        customer_phone:      customer.phone,
        customer_address:    customer.address,
        customer_references: customer.references,
        payment_method:      payment,
        notes,
        items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.qty })),
      });
      setSuccess(res.data);
    } catch {
      alert('Error al crear el pedido.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-sm p-6 text-center space-y-3">
        <div className="text-5xl">✅</div>
        <h3 className="font-extrabold text-gray-900 text-xl">¡Pedido creado!</h3>
        <p className="font-mono font-bold text-brand-700 text-lg">{success.order.order_number}</p>
        <p className="text-gray-500 text-sm">Total: <strong>${subtotal.toFixed(2)}</strong></p>
        <a href={success.whatsapp_link} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20b858]
                     text-white font-bold py-3 rounded-2xl transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          Enviar resumen por WhatsApp
        </a>
        <div className="flex gap-2 pt-1">
          <button onClick={reset}
            className="flex-1 py-2.5 rounded-2xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50">
            Nuevo pedido
          </button>
          <button onClick={onCreated}
            className="flex-1 py-2.5 rounded-2xl bg-brand-900 text-gold-400 text-sm font-bold hover:bg-brand-800">
            Ver pedidos
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">

      {/* Datos del cliente */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-4 py-2.5 bg-brand-900">
          <span className="font-bold text-white text-sm">👤 Datos del cliente</span>
        </div>
        <div className="p-4 grid sm:grid-cols-2 gap-3">
          {[
            { key: 'name',  label: 'Nombre *',   placeholder: 'Nombre completo' },
            { key: 'phone', label: 'Teléfono *', placeholder: '10 dígitos' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-bold text-gray-400 mb-1">{f.label}</label>
              <input
                type="text" placeholder={f.placeholder} value={customer[f.key]}
                onChange={e => setCustomer(c => ({ ...c, [f.key]: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm
                           focus:outline-none focus:ring-2 focus:ring-brand-400" />
            </div>
          ))}
        </div>
      </div>

      {/* Selección de productos */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-4 py-2.5 bg-brand-900">
          <span className="font-bold text-white text-sm">🛒 Productos</span>
        </div>
        <div className="p-4 space-y-3">
          <input
            type="text" placeholder="Buscar producto…" value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-brand-400" />
          <div className="max-h-52 overflow-y-auto divide-y divide-gray-50 border border-gray-100 rounded-xl">
            {filtered.length === 0 && (
              <p className="text-center text-gray-400 text-sm py-6">Sin resultados</p>
            )}
            {filtered.map(p => (
              <div key={p.id} className="flex items-center justify-between px-3 py-2.5 hover:bg-gray-50">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{p.name}</p>
                  <p className="text-xs text-gray-400">${parseFloat(p.price || 0).toFixed(0)}{p.unit ? ` · ${p.unit}` : ''}</p>
                </div>
                <button onClick={() => addToCart(p)}
                  className="w-7 h-7 rounded-full bg-brand-900 text-white font-bold text-lg
                             flex items-center justify-center hover:bg-brand-700 transition-colors shrink-0">
                  +
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Carrito */}
      {cart.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-2.5 bg-brand-900 flex items-center justify-between">
            <span className="font-bold text-white text-sm">📋 Resumen del pedido</span>
            <span className="text-gold-400 text-xs font-bold">{cart.length} producto{cart.length > 1 ? 's' : ''}</span>
          </div>
          <div className="divide-y divide-gray-50">
            {cart.map(i => (
              <div key={i.id} className="flex items-center gap-3 px-4 py-2.5">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{i.name}</p>
                  <p className="text-xs text-gray-400">${i.price.toFixed(0)} c/u</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => setQty(i.id, i.qty - 1)}
                    className="w-7 h-7 rounded-full border border-gray-200 text-gray-600 font-bold text-base
                               flex items-center justify-center hover:bg-gray-100">−</button>
                  <span className="w-6 text-center font-bold text-sm">{i.qty}</span>
                  <button onClick={() => setQty(i.id, i.qty + 1)}
                    className="w-7 h-7 rounded-full border border-gray-200 text-gray-600 font-bold text-base
                               flex items-center justify-center hover:bg-gray-100">+</button>
                </div>
                <span className="text-sm font-extrabold text-gray-900 w-16 text-right shrink-0">
                  ${(i.price * i.qty).toFixed(0)}
                </span>
              </div>
            ))}
            <div className="flex justify-between px-4 py-3 font-extrabold text-base bg-gray-50">
              <span>Total</span>
              <span className="text-brand-700">${subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Pago y notas */}
      <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-2">Método de pago</label>
          <div className="flex gap-2">
            {[['efectivo','💵 Efectivo'],['tarjeta','💳 Tarjeta']].map(([v, l]) => (
              <button key={v} onClick={() => setPayment(v)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all
                  ${payment === v ? 'bg-brand-900 text-gold-400' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {l}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-1">Notas (opcional)</label>
          <textarea rows={2} placeholder="Indicaciones especiales…" value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none
                       focus:outline-none focus:ring-2 focus:ring-brand-400" />
        </div>
      </div>

      {/* Botón crear */}
      <button onClick={submit} disabled={submitting}
        className="w-full py-4 bg-brand-900 hover:bg-brand-800 text-gold-400 font-extrabold
                   rounded-2xl text-base transition-colors disabled:opacity-60 shadow-sm">
        {submitting ? 'Creando pedido…' : `Crear pedido · $${subtotal.toFixed(2)}`}
      </button>
    </div>
  );
}

// ── Product Table ─────────────────────────────────────────────────────────────

function Toggle({ on, onChange }) {
  return (
    <button
      onClick={() => onChange(!on)}
      style={{
        position: 'relative', flexShrink: 0,
        width: 44, height: 24, borderRadius: 999,
        backgroundColor: on ? '#22c55e' : '#d1d5db',
        border: 'none', cursor: 'pointer',
        transition: 'background-color .2s',
      }}>
      <span style={{
        position: 'absolute', top: 2,
        left: on ? 22 : 2, width: 20, height: 20,
        borderRadius: 999, backgroundColor: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,.25)',
        transition: 'left .2s', display: 'block',
      }} />
    </button>
  );
}

function ProductTable({ products, onToggle, onPriceChange, onStockChange }) {
  const [subtab,    setSubtab]    = useState('precios');
  const [editing,   setEditing]   = useState(null);
  const [tempVal,   setTempVal]   = useState('');

  const byCat = products.reduce((acc, p) => {
    const key = p.category_name || 'Sin categoría';
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});

  const startEdit = (id, current) => { setEditing(id); setTempVal(String(current ?? '')); };

  const commitEdit = (p) => {
    const val = parseFloat(tempVal);
    if (!isNaN(val) && val >= 0) {
      subtab === 'precios' ? onPriceChange(p.id, val) : onStockChange(p.id, Math.round(val));
    }
    setEditing(null);
  };

  const isPrice = subtab === 'precios';

  return (
    <div className="space-y-4">
      {/* Sub-tabs */}
      <div className="flex gap-2 bg-white rounded-2xl shadow-sm p-1.5">
        {[
          { id: 'precios',    label: '💲 Precios' },
          { id: 'cantidades', label: '📦 Cantidades' },
        ].map(t => (
          <button key={t.id} onClick={() => { setSubtab(t.id); setEditing(null); }}
            className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all
              ${subtab === t.id
                ? 'bg-brand-900 text-gold-400 shadow-sm'
                : 'text-gray-500 hover:bg-gray-100'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {subtab === 'cantidades' && (
        <p className="text-xs text-gray-400 text-center -mt-2">
          Indica cuántas piezas/kg tienes disponibles hoy. Pon <strong>0</strong> para desactivar.
        </p>
      )}

      {Object.entries(byCat).map(([cat, items]) => (
        <div key={cat} className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-2.5 bg-brand-900 flex items-center gap-2">
            <span className="font-bold text-white text-sm">{cat}</span>
            <span className="text-gold-400/60 text-xs">{items.length} productos</span>
          </div>
          <div className="divide-y divide-gray-50">
            {items.map(p => (
              <div key={p.id}
                className={`flex items-center gap-3 px-4 py-3 transition-colors
                  ${!p.available ? 'opacity-50' : ''}`}>

                {/* Toggle */}
                <Toggle on={!!p.available} onChange={val => onToggle(p.id, val)} />

                {/* Nombre */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{p.name}</p>
                  {p.unit && <p className="text-xs text-gray-400">{p.unit}</p>}
                </div>

                {/* Campo editable: precio o cantidad */}
                <div className="shrink-0">
                  {editing === p.id ? (
                    <div className="flex items-center gap-1">
                      {isPrice && <span className="text-gray-400 text-sm">$</span>}
                      <input
                        type="number" min="0" step={isPrice ? '1' : '1'}
                        value={tempVal}
                        onChange={e => setTempVal(e.target.value)}
                        onBlur={() => commitEdit(p)}
                        onKeyDown={e => { if (e.key === 'Enter') commitEdit(p); if (e.key === 'Escape') setEditing(null); }}
                        className="w-20 border border-brand-400 rounded-xl px-2 py-1 text-sm font-bold
                                   focus:outline-none focus:ring-2 focus:ring-brand-400 text-right"
                        autoFocus />
                    </div>
                  ) : (
                    <button
                      onClick={() => startEdit(p.id, isPrice ? p.price : (p.stock ?? ''))}
                      className="flex items-center gap-1 group px-2 py-1 rounded-xl hover:bg-gray-100 transition-colors">
                      <span className="font-bold text-gray-900 text-sm">
                        {isPrice
                          ? `$${parseFloat(p.price || 0).toFixed(0)}`
                          : (p.stock != null ? `${p.stock} pz` : '— pz')}
                      </span>
                      <svg className="w-3 h-3 text-gray-300 group-hover:text-brand-500 transition-colors"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function InfoRow({ icon, value, bold }) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <span className="shrink-0">{icon}</span>
      <span className={bold ? 'font-bold text-gray-900' : 'text-gray-700'}>{value}</span>
    </div>
  );
}

function printTicket(order) {
  const items = order.items || [];
  const date  = new Date(order.created_at).toLocaleDateString('es-MX');
  const pago  = order.payment_method === 'efectivo' ? 'Efectivo' : 'Tarjeta / Transferencia';
  const rows  = items.map(i => `
    <tr>
      <td style="padding:8px 6px;border-bottom:1px solid #f0f0f0">${i.product_name}</td>
      <td style="padding:8px 6px;border-bottom:1px solid #f0f0f0;text-align:center">${i.quantity}</td>
      <td style="padding:8px 6px;border-bottom:1px solid #f0f0f0;text-align:right">$${parseFloat(i.unit_price).toFixed(2)}</td>
      <td style="padding:8px 6px;border-bottom:1px solid #f0f0f0;text-align:right;font-weight:700">$${parseFloat(i.item_total).toFixed(2)}</td>
    </tr>`).join('');

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
  <title>Ticket ${order.order_number}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:Arial,sans-serif;font-size:13px;color:#111;padding:36px;max-width:620px;margin:0 auto}
    .brand{font-size:24px;font-weight:900;color:#7c1d0f;letter-spacing:-0.5px}
    .sub{color:#666;font-size:12px;margin-top:3px}
    hr{border:none;border-top:1px solid #ddd;margin:18px 0}
    h2{font-size:17px;font-weight:800;color:#7c1d0f;margin-bottom:14px}
    .meta{display:grid;grid-template-columns:1fr 1fr;gap:4px 20px;margin-bottom:4px}
    .meta p{font-size:12.5px;color:#333}
    .meta strong{color:#111}
    table{width:100%;border-collapse:collapse;margin-top:6px}
    th{text-align:left;font-size:11px;text-transform:uppercase;color:#888;
       border-bottom:2px solid #ddd;padding:6px 6px 8px}
    .total{font-size:20px;font-weight:900;color:#7c1d0f;text-align:right;margin-top:14px}
    .footer{margin-top:28px;color:#aaa;font-size:11.5px;text-align:center}
    @media print{body{padding:16px}}
  </style></head><body>
  <div class="brand">🐔 El Pollito Gus</div>
  <div class="sub">Pollo Fresco y Confiable</div>
  <hr>
  <h2>Ticket de venta</h2>
  <div class="meta">
    <p><strong>Folio:</strong> ${order.order_number}</p>
    <p><strong>Fecha:</strong> ${date}</p>
    <p><strong>Cliente:</strong> ${order.customer_name}</p>
    <p><strong>Teléfono:</strong> ${order.customer_phone}</p>
    <p><strong>Pago:</strong> ${pago}</p>
    <p><strong>Estado:</strong> ${STATUS_CONFIG[order.status]?.label || order.status}</p>
  </div>
  <table>
    <thead><tr>
      <th>Producto</th>
      <th style="text-align:center">Cant.</th>
      <th style="text-align:right">Precio</th>
      <th style="text-align:right">Subtotal</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <hr>
  <div class="total">Total: $${parseFloat(order.total).toFixed(2)}</div>
  <div class="footer">Gracias por tu compra en El Pollito Gus 🐔</div>
  <script>window.onload=()=>{window.print()}</script>
  </body></html>`;

  const w = window.open('', '_blank', 'width=700,height=900');
  w.document.write(html);
  w.document.close();
}

function buildTicketWhatsApp(order) {
  const digits = order.customer_phone.replace(/\D/g, '');
  const phone  = digits.length === 10 ? `52${digits}` : digits;
  const date   = new Date(order.created_at).toLocaleDateString('es-MX');
  const lines  = (order.items || [])
    .map(i => `  • ${i.quantity}x ${i.product_name}  $${parseFloat(i.item_total).toFixed(2)}`)
    .join('\n');
  const pago   = order.payment_method === 'efectivo' ? '💵 Efectivo' : '💳 Tarjeta';
  const msg =
    `🐔 *El Pollito Gus*\n_Pollo Fresco y Confiable_\n\n` +
    `📋 *TICKET DE VENTA*\n` +
    `*Folio:* ${order.order_number}\n` +
    `*Fecha:* ${date}\n` +
    `*Cliente:* ${order.customer_name}\n\n` +
    `🛒 *PRODUCTOS:*\n${lines}\n\n` +
    `━━━━━━━━━━━━━━━\n` +
    `💵 *TOTAL: $${parseFloat(order.total).toFixed(2)}*\n` +
    `Pago: ${pago}\n` +
    `━━━━━━━━━━━━━━━\n\n` +
    `¡Gracias por tu compra! 😊`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}

function buildNotifyLink(order) {
  const digits = order.customer_phone.replace(/\D/g, '');
  const phone  = digits.length === 10 ? `52${digits}` : digits;
  const msg =
    `🐔 *Hola ${order.customer_name}!*\n\n` +
    `Tu pedido *${order.order_number}* ya está listo ✅\n\n` +
    `🛒 *Tu pedido:*\n` +
    (order.items || []).map(i => `  • ${i.quantity}x ${i.product_name}`).join('\n') +
    `\n\n💵 *Total: $${parseFloat(order.total).toFixed(2)}*\n\n¡Te esperamos en El Pollito Gus! 😊`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

function formatTime(iso) {
  return new Date(iso).toLocaleString('es-MX', {
    day: '2-digit', month: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
}

function formatDateLong() {
  return new Date().toLocaleDateString('es-MX', {
    weekday: 'long', day: 'numeric', month: 'long',
  });
}
