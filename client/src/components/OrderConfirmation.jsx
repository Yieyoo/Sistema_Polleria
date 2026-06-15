import { useCart } from '../context/CartContext.jsx';

export default function OrderConfirmation({ orderData, onClose }) {
  const { clearCart } = useCart();
  const { order } = orderData;

  const handleClose = () => {
    clearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl animate-bounce-in overflow-hidden">

        {/* Header verde */}
        <div className="bg-green-500 px-6 py-7 text-center text-white">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center
                          mx-auto mb-3 border-2 border-white/30">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold">¡Pedido recibido!</h2>
          <p className="text-green-100 mt-1 text-sm">En breve comenzamos a prepararlo</p>
        </div>

        <div className="px-5 py-5 space-y-4">
          {/* Número de pedido */}
          <div className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-100">
            <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide font-semibold">
              Tu número de pedido
            </p>
            <p className="text-2xl font-black text-gray-900 tracking-wider">
              {order.order_number}
            </p>
            <p className="text-xs text-gray-400 mt-1">Guárdalo para recoger en tienda</p>
          </div>

          {/* Resumen */}
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Cliente</span>
              <span className="font-semibold text-gray-900">{order.customer_name}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Pago</span>
              <span className="font-semibold text-gray-900">
                {order.payment_method === 'efectivo' ? '💵 Efectivo' : '💳 Tarjeta/Transferencia'}
              </span>
            </div>
            <div className="border-t border-gray-100 pt-2.5 flex justify-between font-bold text-base">
              <span className="text-gray-900">Total</span>
              <span className="text-orange-500">${parseFloat(order.total).toFixed(2)}</span>
            </div>
          </div>

          {/* Aviso WhatsApp */}
          <div className="bg-green-50 border border-green-100 rounded-2xl p-3.5 flex gap-3 items-start">
            <div className="text-2xl flex-shrink-0">📲</div>
            <div>
              <p className="text-sm font-semibold text-green-800">
                Te avisamos cuando esté listo
              </p>
              <p className="text-xs text-green-700 mt-0.5">
                Recibirás un WhatsApp cuando tu pedido esté listo para recoger.
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="flex items-center justify-between px-2 py-1">
            <Step icon="✅" label="Recibido" active />
            <div className="flex-1 h-px bg-gray-200 mx-2" />
            <Step icon="🔥" label="Preparando" />
            <div className="flex-1 h-px bg-gray-200 mx-2" />
            <Step icon="🎉" label="¡Listo!" />
          </div>
        </div>

        <div className="px-5 pb-5">
          <button
            onClick={handleClose}
            className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700
                       text-white font-bold py-3.5 rounded-2xl transition-colors
                       shadow-sm text-base"
          >
            Volver al menú
          </button>
        </div>
      </div>
    </div>
  );
}

function Step({ icon, label, active }) {
  return (
    <div className={`flex flex-col items-center gap-1 ${active ? 'text-green-600' : 'text-gray-400'}`}>
      <span className="text-lg">{icon}</span>
      <span className={`text-[10px] font-semibold ${active ? 'text-green-700' : 'text-gray-400'}`}>
        {label}
      </span>
    </div>
  );
}
