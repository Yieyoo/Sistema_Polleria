import { useState, useEffect, useCallback } from 'react';
import { useNavigate }  from 'react-router-dom';
import { getOrders, updateStatus, getDailySummary } from '../services/api.js';
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

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ── Header ── */}
      <header className="bg-brand-900 text-white px-4 sm:px-6 h-16 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <img src="/fotos/logo.jpeg" alt="logo"
            className="w-9 h-9 rounded-full object-cover ring-2 ring-gold-400/40"
            onError={e => { e.target.style.display = 'none'; }} />
          <div>
            <p className="font-extrabold text-white leading-tight text-sm sm:text-base">El Pollito Gus</p>
            <p className="text-gold-400 text-xs leading-tight">Panel Administrador</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-white text-xs font-semibold">{adminUser.full_name || 'Admin'}</p>
            <p className="text-gray-400 text-xs">{formatDateLong()}</p>
          </div>
          <button onClick={load}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
          </button>
          <button onClick={logout}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-2 rounded-xl text-sm font-semibold transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Salir
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <KpiCard icon="📋" label="Pedidos hoy"   value={summary?.total_orders   ?? '—'} accent="gray" />
          <KpiCard icon="⏳" label="Pendientes"    value={summary?.pending         ?? '—'} accent="amber" />
          <KpiCard icon="👨‍🍳" label="Preparando"  value={summary?.preparing       ?? '—'} accent="blue" />
          <KpiCard icon="🛵" label="En camino"    value={summary?.on_the_way      ?? '—'} accent="orange" />
          <KpiCard icon="✅" label="Entregados"   value={summary?.delivered        ?? '—'} accent="green" />
          <KpiCard icon="💰" label="Ingresos"
            value={summary ? `$${parseFloat(summary.total_revenue || 0).toFixed(0)}` : '—'}
            accent="gold" wide />
        </div>

        {/* ── Filtros ── */}
        <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
          {/* Tabs de estado */}
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

          {/* Fecha */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-gray-400 uppercase shrink-0">Fecha</label>
            <input type="date" value={filters.date}
              onChange={e => { setFilters(f => ({ ...f, date: e.target.value })); setPage(1); }}
              className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-brand-400" />
            <button onClick={() => { setFilters({ status: '', date: todayISO() }); setPage(1); }}
              className="text-xs text-gray-400 hover:text-brand-600 font-medium transition-colors">
              Hoy
            </button>
          </div>
        </div>

        {/* ── Lista de pedidos ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-extrabold text-gray-900 text-base">
              Pedidos
              {total > 0 && <span className="ml-2 text-gray-400 font-normal text-sm">({total})</span>}
            </h2>
            {loading && (
              <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            )}
          </div>

          {orders.length === 0 && !loading ? (
            <div className="bg-white rounded-2xl shadow-sm text-center py-16 text-gray-400">
              <span className="text-5xl">📋</span>
              <p className="mt-3 font-medium">No hay pedidos con estos filtros</p>
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

          {/* Paginación */}
          {total > LIMIT && (
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-gray-500">
                {Math.min((page - 1) * LIMIT + 1, total)}–{Math.min(page * LIMIT, total)} de {total}
              </span>
              <div className="flex gap-2">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-xl disabled:opacity-40 hover:bg-gray-50 font-medium">
                  ← Anterior
                </button>
                <button disabled={page * LIMIT >= total} onClick={() => setPage(p => p + 1)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-xl disabled:opacity-40 hover:bg-gray-50 font-medium">
                  Siguiente →
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Modal detalle ── */}
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

// ── KPI Card ────────────────────────────────────────────────────────────────

const ACCENT = {
  gray:   { bg: 'bg-gray-100',   icon: 'text-gray-500',   val: 'text-gray-900' },
  amber:  { bg: 'bg-amber-100',  icon: 'text-amber-500',  val: 'text-amber-700' },
  blue:   { bg: 'bg-blue-100',   icon: 'text-blue-500',   val: 'text-blue-700' },
  orange: { bg: 'bg-orange-100', icon: 'text-orange-500', val: 'text-orange-700' },
  green:  { bg: 'bg-green-100',  icon: 'text-green-500',  val: 'text-green-700' },
  gold:   { bg: 'bg-brand-900',  icon: 'text-gold-400',   val: 'text-gold-400' },
};

function KpiCard({ icon, label, value, accent = 'gray', wide }) {
  const c = ACCENT[accent];
  return (
    <div className={`rounded-2xl shadow-sm px-4 py-3 flex flex-col gap-1
      ${accent === 'gold' ? 'bg-brand-900' : 'bg-white'}
      ${wide ? 'sm:col-span-1' : ''}`}>
      <div className={`text-xl ${c.icon}`}>{icon}</div>
      <div className={`text-2xl font-extrabold ${c.val}`}>{value}</div>
      <div className={`text-xs font-medium ${accent === 'gold' ? 'text-gold-400/70' : 'text-gray-400'}`}>{label}</div>
    </div>
  );
}

// ── Order Card ───────────────────────────────────────────────────────────────

function OrderCard({ order, onStatusChange, onDetail }) {
  const border = CARD_BORDER[order.status] || 'border-l-gray-300';

  return (
    <div className={`bg-white rounded-2xl shadow-sm border-l-4 ${border} overflow-hidden`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-gray-50">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-brand-700 text-sm">{order.order_number}</span>
          <StatusBadge status={order.status} />
        </div>
        <span className="text-xs text-gray-400">{formatTime(order.created_at)}</span>
      </div>

      {/* Body */}
      <div className="px-4 py-3 grid sm:grid-cols-2 gap-3">
        {/* Cliente */}
        <div>
          <p className="font-bold text-gray-900 text-sm">{order.customer_name}</p>
          <p className="text-xs text-gray-400">{order.customer_phone}</p>
          {order.customer_address && (
            <p className="text-xs text-gray-500 mt-0.5 truncate">{order.customer_address}</p>
          )}
        </div>
        {/* Resumen */}
        <div className="flex flex-col items-start sm:items-end gap-1">
          <span className="text-lg font-extrabold text-gray-900">
            ${parseFloat(order.total).toFixed(2)}
          </span>
          <span className="text-xs text-gray-400">
            {order.payment_method === 'efectivo' ? '💵 Efectivo' : '💳 Tarjeta'}
          </span>
          {order.items && order.items.length > 0 && (
            <p className="text-xs text-gray-500 text-right">
              {order.items.slice(0, 2).map(i => `${i.quantity}× ${i.product_name}`).join(' · ')}
              {order.items.length > 2 && ` +${order.items.length - 2} más`}
            </p>
          )}
        </div>
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-2 px-4 pb-3 flex-wrap">
        <select value={order.status} onChange={e => onStatusChange(e.target.value)}
          className="text-xs border border-gray-200 rounded-xl px-3 py-2
                     focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white font-medium">
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
          Detalle
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

// ── Order Detail Modal ───────────────────────────────────────────────────────

function OrderDetailModal({ order, onClose, onStatusChange }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white px-5 pt-5 pb-3 border-b border-gray-100">
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
          {/* Cliente */}
          <section>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Cliente</h4>
            <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
              <InfoRow icon="👤" value={order.customer_name} bold />
              <InfoRow icon="📱" value={order.customer_phone} />
              <InfoRow icon="📍" value={order.customer_address} />
              {order.customer_references && <InfoRow icon="🏠" value={order.customer_references} />}
              <InfoRow icon={order.payment_method === 'efectivo' ? '💵' : '💳'}
                value={order.payment_method === 'efectivo' ? 'Pago en efectivo' : 'Tarjeta / Transferencia'} />
            </div>
          </section>

          {/* Productos */}
          <section>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Productos</h4>
            <div className="bg-gray-50 rounded-2xl overflow-hidden">
              {(order.items || []).map((item, i) => (
                <div key={i}
                  className="flex justify-between items-center px-4 py-2.5 text-sm
                             border-b border-gray-100 last:border-0">
                  <span className="text-gray-700">
                    <span className="font-bold text-gray-900">{item.quantity}×</span> {item.product_name}
                  </span>
                  <span className="font-semibold text-gray-900">
                    ${parseFloat(item.item_total).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between px-4 py-3 font-extrabold text-base
                              border-t-2 border-gray-200 bg-white">
                <span>Total</span>
                <span className="text-brand-700">${parseFloat(order.total).toFixed(2)}</span>
              </div>
            </div>
          </section>

          {/* Notas */}
          {order.notes && (
            <div className="flex gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 text-sm">
              <span>📝</span>
              <span className="text-amber-800">{order.notes}</span>
            </div>
          )}

          {/* Estado */}
          <section>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Cambiar estado</h4>
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

          {/* WhatsApp */}
          <a href={buildNotifyLink(order)} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full
                       bg-[#25D366] hover:bg-[#20b858] text-white font-bold
                       py-4 rounded-2xl transition-colors shadow-sm">
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

// ── Helpers ──────────────────────────────────────────────────────────────────

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
