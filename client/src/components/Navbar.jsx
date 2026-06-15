import { useCart } from '../context/CartContext.jsx';

export default function Navbar() {
  const { itemCount, toggleCart } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 min-w-0">
          <img
            src="/fotos/logo.jpeg"
            alt="El Pollito Gus"
            className="h-9 w-9 rounded-xl object-cover flex-shrink-0 shadow-sm"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="min-w-0">
            <div className="font-extrabold text-gray-900 text-[15px] leading-tight">
              El Pollito <span className="text-orange-500">Gus</span>
            </div>
            <div className="text-gray-400 text-xs leading-tight hidden sm:block">
              Pollo Fresco y Confiable
            </div>
          </div>
        </a>

        {/* Cart button */}
        <button
          onClick={toggleCart}
          className="relative flex items-center gap-2 bg-orange-500 hover:bg-orange-600
                     active:bg-orange-700 text-white font-semibold px-4 py-2.5
                     rounded-full transition-colors text-sm shadow-sm shadow-orange-200 flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h11M7 13L5.4 5M10 21a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2z"/>
          </svg>
          <span className="hidden sm:inline">Mi pedido</span>
          {itemCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-gray-900 text-white
                             text-[10px] font-black w-5 h-5 rounded-full
                             flex items-center justify-center animate-bounce-in
                             ring-2 ring-white">
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
