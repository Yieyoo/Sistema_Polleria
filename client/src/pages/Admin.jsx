import { useState, useEffect, useCallback } from 'react';
import { useNavigate }  from 'react-router-dom';
import { getOrders, updateStatus, getDailySummary } from '../services/api.js';
import StatusBadge, { STATUS_CONFIG } from '../components/StatusBadge.jsx';

const STATUS_LIST = ['pendiente', 'preparando', 'en_camino', 'entregado', 'cancelado'];

export default function Admin() {
  const navigate = useNavigate();
  const adminUser = JSON.parse(localStorage.getItem('admin_user') || '{}');

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

  // Auto-refresh every 30s
  useEffect(() => {
    const id = setInterval(load, 30_000);
    return () => clearInterval(id);
  }, [load]);

  const handleStatus = async (orderId, status) => {
    try {
      await updateStatus(orderId, status);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
      if (selected?.id === orderId) setSelected(prev => ({ ...prev, status }));
      load(); // reload summary
    } catch (e) {
      alert('Error al actualizar el estado.');
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <header className="bg-brand-700 text-white px-4 h-14 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2 font-bold text-lg">
          <span>🐔</span>
          <span>Admin — El Pollito Gus</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-brand-200 text-sm hidden sm:block">{adminUser.full_name}</span>
          <button onClick={logout}
            className="bg-brand-800 hover:bg-brand-900 px-3 py-1.5 rounded-lg text-sm transition-colors">
            Salir
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* Summary cards */}
        {summary && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <SummaryCard label="Total pedidos"   value={summary.total_orders}     color="text-gray-900" />
            <SummaryCard label="Pendientes"      value={summary.pending}          color="text-yellow-600" />
            <SummaryCard label="Preparando"      value={summary.preparing}        color="text-blue-600" />
            <SummaryCard label="En camino"       value={summary.on_the_way}       color="text-orange-600" />
            <SummaryCard label="Entregados"      value={summary.delivered}        color="text-green-600" />
            <SummaryCard
              label="Ingresos del día"
              value={`$${parseFloat(summary.total_revenue).toFixed(2)}`}
              color="text-brand-600"
              large
            />
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm px-4 py-3 flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">FECHA</label>
            <input
              type="date"
              value={filters.date}
              onChange={e => { setFilters(p => ({ ...p, date: e.target.value })); setPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">ESTADO</label>
            <select
              value={filters.status}
              onChange={e => { setFilters(p => ({ ...p, status: e.target.value })); setPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
            >
              <option value="">Todos</option>
              {STATUS_LIST.map(s => (
                <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
              ))}
            </select>
          </div>
          <button onClick={() => { setFilters({ status: '', date: todayISO() }); setPage(1); }}
            className="text-sm text-brand-600 hover:text-brand-700 font-medium">
            Limpiar filtros
          </button>
          <button onClick={load}
            className="ml-auto bg-brand-50 hover:bg-brand-100 text-brand-700 font-semibold
                       px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            Actualizar
          </button>
        </div>

        {/* Orders table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">
              Pedidos {total > 0 && <span className="text-gray-400 font-normal text-sm">({total} total)</span>}
            </h2>
            {loading && (
              <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            )}
          </div>

          {orders.length === 0 && !loading ? (
            <div className="text-center py-16 text-gray-400">
              <span className="text-4xl">📋</span>
              <p className="mt-2">No hay pedidos con estos filtros.</p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Pedido</th>
                      <th className="px-4 py-3 text-left font-semibold">Cliente</th>
                      <th className="px-4 py-3 text-left font-semibold">Hora</th>
                      <th className="px-4 py-3 text-right font-semibold">Total</th>
                      <th className="px-4 py-3 text-left font-semibold">Estado</th>
                      <th className="px-4 py-3 text-left font-semibold">Acciones</th>
                      <th className="px-4 py-3 text-center font-semibold">Detalle</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map(order => (
                      <tr key={order.id} className="hover:bg-orange-50/40 transition-colors">
                        <td className="px-4 py-3 font-mono font-semibold text-brand-700">
                          {order.order_number}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">{order.customer_name}</div>
                          <div className="text-gray-400 text-xs">{order.customer_phone}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">
                          {formatTime(order.created_at)}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-gray-900">
                          ${parseFloat(order.total).toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-4 py-3">
                          <StatusSelect
                            current={order.status}
                            onChange={s => handleStatus(order.id, s)}
                          />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => setSelected(order)}
                            className="text-brand-600 hover:text-brand-700 font-medium text-xs"
                          >
                            Ver
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-gray-100">
                {orders.map(order => (
                  <div key={order.id} className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono font-bold text-brand-700 text-sm">
                          {order.order_number}
                        </span>
                        <div className="font-semibold text-gray-900">{order.customer_name}</div>
                        <div className="text-xs text-gray-400">{formatTime(order.created_at)}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">${parseFloat(order.total).toFixed(2)}</div>
                        <StatusBadge status={order.status} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusSelect
                        current={order.status}
                        onChange={s => handleStatus(order.id, s)}
                      />
                      <button
                        onClick={() => setSelected(order)}
                        className="text-brand-600 text-xs font-medium border border-brand-200
                                   px-3 py-1.5 rounded-lg hover:bg-brand-50"
                      >
                        Detalle
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          {total > LIMIT && (
            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-sm">
              <span className="text-gray-500">
                Mostrando {Math.min((page - 1) * LIMIT + 1, total)}–{Math.min(page * LIMIT, total)} de {total}
              </span>
              <div className="flex gap-2">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">
                  ←
                </button>
                <button disabled={page * LIMIT >= total} onClick={() => setPage(p => p + 1)}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">
                  →
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Order detail modal */}
      {selected && (
        <OrderDetailModal
          order={selected}
          onClose={() => setSelected(null)}
          onStatusChange={(s) => handleStatus(selected.id, s)}
        />
      )}
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────

function SummaryCard({ label, value, color, large }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm px-4 py-3 ${large ? 'sm:col-span-1' : ''}`}>
      <div className={`font-extrabold ${large ? 'text-xl' : 'text-2xl'} ${color}`}>{value}</div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}

function StatusSelect({ current, onChange }) {
  return (
    <select
      value={current}
      onChange={e => onChange(e.target.value)}
      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5
                 focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
    >
      {STATUS_LIST.map(s => (
        <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
      ))}
    </select>
  );
}

function buildNotifyLink(order) {
  const digits = order.customer_phone.replace(/\D/g, '');
  const phone  = digits.length === 10 ? `52${digits}` : digits;
  const msg =
    `🐔 *Hola ${order.customer_name}!*\n\n` +
    `Tu pedido *${order.order_number}* ya está listo para recoger en *El Pollito Gus* ✅\n\n` +
    `🛒 *Tu pedido:*\n` +
    (order.items || []).map(i => `  • ${i.quantity}x ${i.product_name}`).join('\n') +
    `\n\n💵 *Total: $${parseFloat(order.total).toFixed(2)}*\n\n` +
    `¡Te esperamos! 😊`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}

function OrderDetailModal({ order, onClose, onStatusChange }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-5 pt-5 pb-3 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900">{order.order_number}</h3>
            <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleString('es-MX')}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* Cliente */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Datos del cliente</h4>
            <div className="bg-gray-50 rounded-xl p-3 space-y-1 text-sm">
              <Row label="Nombre"    value={order.customer_name} />
              <Row label="Teléfono"  value={order.customer_phone} />
              <Row label="Dirección" value={order.customer_address} />
              {order.customer_references && <Row label="Referencias" value={order.customer_references} />}
              <Row label="Pago"
                value={order.payment_method === 'efectivo' ? '💵 Efectivo' : '🏦 Transferencia'} />
            </div>
          </div>

          {/* Productos */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Productos</h4>
            <div className="bg-gray-50 rounded-xl overflow-hidden">
              {(order.items || []).map((item, i) => (
                <div key={i}
                  className="flex justify-between items-center px-3 py-2.5 text-sm
                             border-b border-gray-100 last:border-0">
                  <span className="text-gray-700">
                    <span className="font-bold text-gray-900">{item.quantity}x</span> {item.product_name}
                  </span>
                  <span className="font-semibold">${parseFloat(item.item_total).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between px-3 py-2.5 font-bold text-base border-t-2 border-gray-200">
                <span>Total</span>
                <span className="text-brand-600">${parseFloat(order.total).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notas */}
          {order.notes && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2.5 text-sm">
              <span className="font-semibold text-yellow-800">Nota: </span>
              <span className="text-yellow-700">{order.notes}</span>
            </div>
          )}

          {/* Estado */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Cambiar estado</h4>
            <div className="grid grid-cols-2 gap-2">
              {STATUS_LIST.map(s => (
                <button
                  key={s}
                  onClick={() => onStatusChange(s)}
                  className={`py-2.5 rounded-xl text-sm font-semibold transition-all
                              ${order.status === s
                                ? 'bg-brand-900 text-gold-400 shadow-sm'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {STATUS_CONFIG[s].label}
                </button>
              ))}
            </div>
          </div>

          {/* Avisar al cliente */}
          <div className="pt-1">
            <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Notificar al cliente</h4>
            <a
              href={buildNotifyLink(order)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full
                         bg-[#25D366] hover:bg-[#20b858] text-white font-bold
                         py-3.5 rounded-xl transition-colors shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Avisar al cliente — ¡Pedido listo!
            </a>
            <p className="text-xs text-gray-400 text-center mt-1.5">
              Abre WhatsApp con mensaje pre-escrito para {order.customer_name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex gap-2 text-sm">
      <span className="text-gray-500 min-w-24">{label}:</span>
      <span className="text-gray-900 font-medium">{value}</span>
    </div>
  );
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
