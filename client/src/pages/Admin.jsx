import { useState, useEffect, useCallback } from 'react';
import { useNavigate }  from 'react-router-dom';
import { getOrders, updateStatus, getDailySummary, getAdminProducts, updateProduct } from '../services/api.js';
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
  const [summary,  setSummary]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [filters,  setFilters]  = useState({ status: '', date: todayISO() });
  const [page,     setPage]     = useState(1);
  const [total,    setTotal]    = useState(0);
  const [selected, setSelected] = useState(null);
  const LIMIT = 20;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: LIMIT };
      if (filters.status) params.status = filters.status;
      if (filters.date)   params.date   = filters.date;
      const [oRes, sRes] = await Promise.all([
        getOrders(params),
        getDailySummary(filters.date || undefined),
      ]);
      setOrders(oRes.data.orders);
      setTotal(oRes.data.total);
      setSummary(sRes.data);
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
      <header className="bg-brand-900 px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <img src="/fotos/logo.jpeg" alt="logo"
            className="w-9 h-9 rounded-full object-cover ring-2 ring-gold-400/40"
            onError={e => { e.target.style.display = 'none'; }} />
          <span className="font-extrabold text-white text-base tracking-tight hidden sm:inline">El Pollito Gus</span>
        </div>

        {/* Nav tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {[
            { id: 'pedidos',   label: 'Pedidos' },
            { id: 'resumen',   label: 'Resumen' },
            { id: 'productos', label: 'Productos' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all
                ${activeTab === tab.id
                  ? 'bg-gold-400 text-brand-900 shadow-sm'
                  : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Acciones */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden md:inline text-gold-400/70 text-xs font-semibold">
            {adminUser.full_name || 'Administrador'}
          </span>
          <button onClick={load}
            className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            title="Actualizar">
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
          </button>
          <button onClick={logout}
            className="flex items-center gap-1.5 border border-white/20 hover:border-white/40 hover:bg-white/10
                       text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <span className="hidden sm:inline">Cerrar sesión</span>
          </button>
        </div>
      </header>

      {/* ── Hero ── */}
      <div className="bg-brand-900 px-4 sm:px-8 pt-6 pb-16">
        <p className="text-gold-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">Panel de Control</p>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
          {activeTab === 'pedidos' ? 'Gestión de Pedidos' : activeTab === 'resumen' ? 'Resumen del Día' : 'Catálogo de Productos'}
        </h1>
        <p className="text-white/50 text-sm mt-1">{formatDateLong()} · Actualización automática cada 30 s</p>
      </div>

      {/* ── KPI Cards (overlap hero) ── */}
      <div className="-mt-10 px-4 sm:px-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <KpiCard icon="📋" label="Pedidos hoy"  value={summary?.total_orders  ?? '—'} accent="gray" />
          <KpiCard icon="⏳" label="Pendientes"   value={summary?.pending        ?? '—'} accent="amber" />
          <KpiCard icon="👨‍🍳" label="Preparando" value={summary?.preparing      ?? '—'} accent="blue" />
          <KpiCard icon="🛵" label="En camino"   value={summary?.on_the_way     ?? '—'} accent="orange" />
          <KpiCard icon="✅" label="Entregados"  value={summary?.delivered       ?? '—'} accent="green" />
          <KpiCard icon="💰" label="Ingresos del día"
            value={summary ? `$${parseFloat(summary.total_revenue || 0).toFixed(0)}` : '—'}
            accent="gold" />
        </div>
      </div>

      {/* ── Main ── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-6 space-y-4">

        {/* ── Vista: Resumen ── */}
        {activeTab === 'resumen' && summary && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Ingresos */}
              <div className="bg-brand-900 rounded-2xl shadow-sm p-6">
                <p className="text-gold-400/70 text-xs font-bold uppercase tracking-wider mb-1">Ingresos del día</p>
                <p className="text-4xl font-extrabold text-gold-400">
                  ${parseFloat(summary.total_revenue || 0).toFixed(2)}
                </p>
                <p className="text-white/40 text-sm mt-1">{summary.total_orders} pedidos en total</p>
              </div>
              {/* Entregas */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">Estado de pedidos</p>
                <div className="space-y-2.5">
                  {[
                    { label: 'Pendientes',  value: summary.pending,    color: 'bg-amber-400' },
                    { label: 'Preparando',  value: summary.preparing,  color: 'bg-blue-400' },
                    { label: 'En camino',   value: summary.on_the_way, color: 'bg-orange-400' },
                    { label: 'Entregados',  value: summary.delivered,  color: 'bg-green-400' },
                    { label: 'Cancelados',  value: summary.cancelled,  color: 'bg-gray-300' },
                  ].map(row => (
                    <div key={row.label} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${row.color}`} />
                        <span className="text-gray-600 font-medium">{row.label}</span>
                      </div>
                      <span className="font-extrabold text-gray-900">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Acceso rápido a pedidos */}
            <button onClick={() => setActiveTab('pedidos')}
              className="w-full bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between
                         hover:bg-gray-50 transition-colors group">
              <span className="font-bold text-gray-700">Ver lista de pedidos</span>
              <span className="text-brand-700 group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
        )}
        {activeTab === 'resumen' && !summary && (
          <div className="bg-white rounded-2xl shadow-sm text-center py-16 text-gray-400">
            <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-medium">Cargando resumen...</p>
          </div>
        )}

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

function OrderDetailModal({ order, onClose, onStatusChange }) {
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

// ── Product Table ─────────────────────────────────────────────────────────────

function ProductTable({ products, onToggle, onPriceChange }) {
  const [editing, setEditing] = useState(null);
  const [tempPrice, setTempPrice] = useState('');

  // Agrupar por categoría
  const byCat = products.reduce((acc, p) => {
    const key = p.category_name || 'Sin categoría';
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});

  const startEdit = (p) => {
    setEditing(p.id);
    setTempPrice(String(p.price));
  };

  const commitEdit = (p) => {
    const val = parseFloat(tempPrice);
    if (!isNaN(val) && val >= 0) onPriceChange(p.id, val);
    setEditing(null);
  };

  return (
    <div className="space-y-4">
      {Object.entries(byCat).map(([cat, items]) => (
        <div key={cat} className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-brand-900 flex items-center gap-2">
            <span className="font-bold text-white text-sm">{cat}</span>
            <span className="text-gold-400/60 text-xs">{items.length} productos</span>
          </div>
          <div className="divide-y divide-gray-50">
            {items.map(p => (
              <div key={p.id}
                className={`flex items-center gap-3 px-4 py-3 transition-colors
                  ${!p.available ? 'bg-gray-50 opacity-60' : ''}`}>
                {/* Toggle disponibilidad */}
                <button
                  onClick={() => onToggle(p.id, !p.available)}
                  className={`relative w-10 h-5.5 shrink-0 rounded-full transition-colors duration-200
                    ${p.available ? 'bg-green-500' : 'bg-gray-300'}`}
                  style={{ minWidth: '2.5rem', height: '1.375rem' }}
                  title={p.available ? 'Disponible — clic para desactivar' : 'No disponible — clic para activar'}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200
                    ${p.available ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>

                {/* Nombre */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{p.name}</p>
                  {p.unit && <p className="text-xs text-gray-400">{p.unit}</p>}
                </div>

                {/* Precio editable */}
                <div className="shrink-0">
                  {editing === p.id ? (
                    <div className="flex items-center gap-1">
                      <span className="text-gray-400 text-sm">$</span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={tempPrice}
                        onChange={e => setTempPrice(e.target.value)}
                        onBlur={() => commitEdit(p)}
                        onKeyDown={e => { if (e.key === 'Enter') commitEdit(p); if (e.key === 'Escape') setEditing(null); }}
                        className="w-20 border border-brand-400 rounded-xl px-2 py-1 text-sm font-bold
                                   focus:outline-none focus:ring-2 focus:ring-brand-400 text-right"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <button onClick={() => startEdit(p)}
                      className="flex items-center gap-1 group px-2 py-1 rounded-xl hover:bg-gray-100 transition-colors">
                      <span className="font-bold text-gray-900 text-sm">
                        ${parseFloat(p.price || 0).toFixed(0)}
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
