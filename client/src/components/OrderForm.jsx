import { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { createOrder } from '../services/api.js';

export default function OrderForm({ onSuccess, onCancel }) {
  const { items, subtotal } = useCart();
  const [form, setForm] = useState({
    customer_name:    '',
    customer_phone:   '',
    customer_address: 'Recoge en tienda',
    payment_method:   'efectivo',
    notes:            '',
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const validate = () => {
    if (!form.customer_name.trim())  return 'Por favor ingresa tu nombre completo.';
    if (!form.customer_phone.trim()) return 'Por favor ingresa tu número de teléfono.';
    if (!/^[\d\s\-\+\(\)]{7,15}$/.test(form.customer_phone.replace(/\s/g, '')))
      return 'El teléfono debe tener entre 7 y 15 dígitos.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);
    setError('');
    try {
      const payload = {
        ...form,
        items: items.map(i => ({
          product_id: i.product_id || i.id,
          name:       i.name,
          price:      i.price,
          quantity:   i.quantity,
        })),
      };
      const { data } = await createOrder(payload);
      onSuccess(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al enviar el pedido. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl
                      max-h-[95vh] overflow-y-auto shadow-2xl animate-fade-in">

        {/* Header */}
        <div className="sticky top-0 bg-white px-5 pt-5 pb-4 border-b border-gray-100 z-10
                        rounded-t-3xl sm:rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Datos para tu pedido</h2>
            <button onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100
                         rounded-xl transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mini resumen */}
          <div className="mt-3 bg-gray-50 rounded-xl px-4 py-2.5 flex justify-between items-center">
            <span className="text-gray-500 text-sm">
              {items.length} {items.length === 1 ? 'producto' : 'productos'}
            </span>
            <span className="font-bold text-brand-900 text-sm">Total: ${subtotal.toFixed(2)}</span>
          </div>

          {/* Aviso */}
          <div className="mt-2.5 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2
                          flex items-center gap-2 text-xs text-amber-800">
            <span>🏪</span>
            <span>
              <strong>Pedido para recoger en tienda.</strong> Te avisamos por WhatsApp cuando esté listo.
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-5 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3
                            rounded-xl text-sm flex items-start gap-2">
              <span className="flex-shrink-0 mt-0.5">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <Field label="Nombre completo *">
            <input
              type="text"
              placeholder="Ej: Juan Pérez"
              value={form.customer_name}
              onChange={e => update('customer_name', e.target.value)}
              className={inputClass}
              maxLength={200}
              required
            />
          </Field>

          <Field label="WhatsApp / Teléfono *">
            <input
              type="tel"
              placeholder="Ej: 55 1234 5678"
              value={form.customer_phone}
              onChange={e => update('customer_phone', e.target.value)}
              className={inputClass}
              maxLength={20}
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              📲 Te mandamos WhatsApp cuando tu pedido esté listo
            </p>
          </Field>

          <Field label="Forma de pago *">
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'efectivo',      label: '💵 Efectivo',      desc: 'Pagas al recoger' },
                { value: 'transferencia', label: '💳 Tarjeta/Trans.', desc: 'Crédito, débito o transferencia' },
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => update('payment_method', opt.value)}
                  className={`p-3 rounded-xl border-2 text-left transition-all
                              ${form.payment_method === opt.value
                                ? 'border-brand-900 bg-gray-50'
                                : 'border-gray-200 hover:border-gray-300 bg-white'}`}
                >
                  <div className="font-semibold text-gray-900 text-sm">{opt.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </Field>

          <Field label="Notas adicionales">
            <textarea
              placeholder="Sin cebolla, extra picante, cantidad de kg para el pollo fresco..."
              value={form.notes}
              onChange={e => update('notes', e.target.value)}
              className={`${inputClass} resize-none`}
              rows={3}
              maxLength={300}
            />
          </Field>

          <div className="pt-1">
            <button
              type="submit"
              disabled={loading}
              className="w-full gold-gradient disabled:opacity-50 disabled:cursor-not-allowed
                         text-brand-900 font-black py-4 rounded-2xl text-base
                         shadow-lg shadow-gold-500/25 hover:opacity-90 transition-opacity"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  Enviando pedido...
                </span>
              ) : (
                `Hacer Pedido · $${subtotal.toFixed(2)}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputClass = `w-full border border-gray-200 rounded-xl px-4 py-2.5 text-gray-900
                    placeholder-gray-400 bg-white text-sm
                    focus:outline-none focus:ring-2 focus:ring-gold-400
                    focus:border-transparent transition-shadow`;

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
