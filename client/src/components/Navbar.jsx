import { useCart } from '../context/CartContext.jsx';

export default function Navbar() {
  const { itemCount, toggleCart } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-brand-900 border-b border-gold-600/30 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 min-w-0">
          <img
            src="/fotos/logo.jpeg"
            alt="El Pollito Gus"
            className="h-9 w-9 rounded-xl object-cover flex-shrink-0 ring-2 ring-gold-500/60"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="min-w-0">
            <div className="font-extrabold text-white text-[15px] leading-tight">
              El Pollito <span className="gold-text">Gus</span>
            </div>
            <div className="text-gold-500 text-xs leading-tight hidden sm:block">
              Pollo Fresco y Confiable
            </div>
          </div>
        </a>

        {/* Cart button */}
        <button
          onClick={toggleCart}
          className="relative flex items-center gap-2 gold-gradient
                     text-brand-900 font-bold px-4 py-2.5
                     rounded-full transition-opacity hover:opacity-90
                     text-sm shadow-md shadow-gold-500/20 flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h11M7 13L5.4 5M10 21a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2z"/>
          </svg>
          <span className="hidden sm:inline">Mi pedido</span>
          {itemCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-white text-brand-900
                             text-[10px] font-black w-5 h-5 rounded-full
                             flex items-center justify-center animate-bounce-in
                             ring-2 ring-gold-500">
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
