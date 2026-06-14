import { useCart } from '../context/CartContext.jsx';

export default function Navbar() {
  const { itemCount, toggleCart } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-brand-900 shadow-xl border-b border-gold-600/30">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <a href="/" className="flex items-center gap-3">
          <img
            src="/fotos/logo.jpeg"
            alt="El Pollito Gus"
            className="h-11 w-11 rounded-full object-cover ring-2 ring-gold-500"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="leading-tight">
            <div className="font-extrabold text-white text-lg tracking-tight">
              El Pollito <span className="gold-text">Gus</span>
            </div>
            <div className="text-gold-500 text-xs font-medium">Pollo Fresco y Confiable</div>
          </div>
        </a>

        {/* Cart button */}
        <button
          onClick={toggleCart}
          className="relative flex items-center gap-2 bg-gold-500 hover:bg-gold-400
                     text-brand-900 font-bold px-4 py-2 rounded-full transition-colors shadow-md"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h11M7 13L5.4 5M10 21a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2z"/>
          </svg>
          <span className="hidden sm:inline">Mi pedido</span>
          {itemCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-white text-brand-900
                             text-xs font-black w-5 h-5 rounded-full flex items-center justify-center
                             animate-bounce-in ring-2 ring-gold-500">
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
