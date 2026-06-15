import { useCart } from '../context/CartContext.jsx';

export default function Cart({ onCheckout }) {
  const { items, isOpen, closeCart, removeItem, updateQty, subtotal, itemCount } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 z-40 transition-opacity" onClick={closeCart} />

      {/* Panel */}
      <aside className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50
                        flex flex-col shadow-2xl animate-slide-in">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-white
                        border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h11M7 13L5.4 5M10 21a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2z"/>
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-base">Mi pedido</span>
            {itemCount > 0 && (
              <span className="bg-orange-500 text-white text-xs font-bold
                               px-2 py-0.5 rounded-full min-w-[20px] text-center">
                {itemCount}
              </span>
            )}
          </div>
          <button onClick={closeCart}
            className="hover:bg-gray-100 p-2 rounded-xl transition-colors text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-4xl">🛒</span>
              </div>
              <p className="text-base font-semibold text-gray-600">Tu carrito está vacío</p>
              <p className="text-sm text-gray-400 text-center">
                Agrega productos del menú para comenzar
              </p>
            </div>
          ) : (
            <ul className="space-y-2.5">
              {items.map(item => (
                <li key={item.id}
                  className="flex gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                  <img
                    src={item.image_url || 'https://placehold.co/64x64/f97316/white?text=🍗'}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-xl flex-shrink-0 bg-gray-200"
                    onError={(e) => { e.target.src = 'https://placehold.co/64x64/f97316/white?text=🍗'; }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{item.name}</p>
                    <p className="text-orange-500 font-bold text-sm">${item.price.toFixed(0)}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <button onClick={() => updateQty(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full bg-white border border-gray-200
                                   hover:bg-red-50 hover:border-red-300 flex items-center
                                   justify-center text-gray-600 font-bold transition-colors text-base">
                        −
                      </button>
                      <span className="font-bold text-gray-900 w-6 text-center text-sm">
                        {item.quantity}
                      </span>
                      <button onClick={() => updateQty(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full bg-white border border-gray-200
                                   hover:bg-green-50 hover:border-green-300 flex items-center
                                   justify-center text-gray-600 font-bold transition-colors text-base">
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between flex-shrink-0">
                    <button onClick={() => removeItem(item.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors p-1 rounded-lg
                                 hover:bg-red-50">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <span className="text-gray-800 font-bold text-sm">
                      ${(item.price * item.quantity).toFixed(0)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-4 py-4 bg-white space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">Subtotal</span>
              <span className="font-bold text-gray-900 text-lg">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-gray-400 -mt-1">
              <span>Envío</span>
              <span className="text-green-600 font-semibold">Gratis · Recoger en tienda</span>
            </div>
            <button
              onClick={() => { closeCart(); onCheckout(); }}
              className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700
                         text-white font-bold py-4 rounded-2xl text-base
                         shadow-md shadow-orange-200 transition-colors"
            >
              Confirmar Pedido · ${subtotal.toFixed(2)}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
