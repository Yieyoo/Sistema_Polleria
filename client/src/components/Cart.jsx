import { useCart } from '../context/CartContext.jsx';

export default function Cart({ onCheckout }) {
  const { items, isOpen, closeCart, removeItem, updateQty, subtotal, itemCount } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/70 z-40 transition-opacity" onClick={closeCart} />

      {/* Panel */}
      <aside className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50
                        flex flex-col shadow-2xl animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-brand-900 text-white
                        border-b border-gold-600/30">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h11M7 13L5.4 5M10 21a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2z"/>
            </svg>
            <span className="font-bold text-lg">Mi pedido</span>
            {itemCount > 0 && (
              <span className="bg-gold-500 text-brand-900 text-xs font-black
                               px-2 py-0.5 rounded-full">{itemCount}</span>
            )}
          </div>
          <button onClick={closeCart}
            className="hover:bg-white/10 p-1.5 rounded-lg transition-colors text-gray-400 hover:text-white">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
              <span className="text-6xl">🛒</span>
              <p className="text-lg font-semibold">Tu carrito está vacío</p>
              <p className="text-sm text-center">Agrega productos del menú para comenzar</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map(item => (
                <li key={item.id} className="flex gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <img
                    src={item.image_url || 'https://placehold.co/80x80/111/d4a017?text=🍗'}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    onError={(e) => { e.target.src = 'https://placehold.co/80x80/111111/d4a017?text=🍗'; }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{item.name}</p>
                    <p className="text-brand-700 font-bold">${item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <button onClick={() => updateQty(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full bg-white border border-gray-200
                                   hover:bg-red-50 hover:border-red-300 flex items-center justify-center
                                   text-gray-600 font-bold transition-colors">−</button>
                      <span className="font-bold text-gray-900 w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full bg-white border border-gray-200
                                   hover:bg-green-50 hover:border-green-300 flex items-center justify-center
                                   text-gray-600 font-bold transition-colors">+</button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button onClick={() => removeItem(item.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors p-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <span className="text-gray-800 font-bold text-sm">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-4 bg-white space-y-4">
            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>Total:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <button
              onClick={() => { closeCart(); onCheckout(); }}
              className="w-full gold-gradient text-brand-900 font-black
                         py-3.5 rounded-xl text-lg shadow-lg shadow-gold-500/30
                         hover:opacity-90 transition-opacity"
            >
              Confirmar Pedido →
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
