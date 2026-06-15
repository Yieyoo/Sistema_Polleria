import { useState } from 'react';
import Navbar            from '../components/Navbar.jsx';
import Hero              from '../components/Hero.jsx';
import MenuSection       from '../components/MenuSection.jsx';
import Cart              from '../components/Cart.jsx';
import OrderForm         from '../components/OrderForm.jsx';
import OrderConfirmation from '../components/OrderConfirmation.jsx';
import { useCart }       from '../context/CartContext.jsx';

export default function Home() {
  const { itemCount, openCart } = useCart();
  const [view, setView]           = useState('menu');
  const [orderData, setOrderData] = useState(null);

  const handleOrderSuccess = (data) => {
    setOrderData(data);
    setView('confirmation');
  };

  const scrollToMenu = () =>
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />

      {/* Promo strip */}
      <div className="max-w-6xl mx-auto px-4 py-5">
        <div className="grid grid-cols-2 gap-3">

          {/* Promo 1 — Boneless / dorado */}
          <button
            onClick={scrollToMenu}
            className="relative overflow-hidden gold-gradient rounded-2xl p-4
                       text-left active:scale-95 transition-all shadow-md
                       shadow-gold-500/20 text-sm">
            <div className="absolute -right-3 -bottom-3 text-6xl opacity-20
                            pointer-events-none select-none">🍗</div>
            <div className="font-extrabold text-brand-900 leading-tight">Boneless</div>
            <div className="text-brand-700 text-xs mt-0.5">3 sabores desde $80</div>
            <span className="mt-3 inline-block bg-brand-900/15 text-brand-900
                              text-xs font-bold px-2.5 py-0.5 rounded-full">
              ⭐ Favorito
            </span>
          </button>

          {/* Promo 2 — Charolas / oscuro */}
          <button
            onClick={scrollToMenu}
            className="relative overflow-hidden bg-brand-900 border border-gold-600/30
                       rounded-2xl p-4 text-left active:scale-95 transition-all
                       shadow-md text-sm hover:border-gold-500/60">
            <div className="absolute -right-3 -bottom-3 text-6xl opacity-10
                            pointer-events-none select-none">🫕</div>
            <div className="font-extrabold text-white leading-tight">Charola Grande</div>
            <div className="text-gray-400 text-xs mt-0.5">Para 4 personas · $390</div>
            <span className="mt-3 inline-block bg-gold-500/20 text-gold-400
                              text-xs font-bold px-2.5 py-0.5 rounded-full">
              🔥 Popular
            </span>
          </button>
        </div>
      </div>

      <MenuSection />

      {/* Sticky CTA móvil */}
      {itemCount > 0 && view === 'menu' && (
        <div className="fixed bottom-4 left-4 right-4 sm:hidden z-30 animate-slide-up">
          <button
            onClick={openCart}
            className="w-full gold-gradient text-brand-900 font-black
                       py-4 rounded-2xl shadow-2xl shadow-gold-500/40
                       flex items-center justify-between px-5 transition-opacity
                       hover:opacity-95"
          >
            <span className="bg-brand-900/15 text-brand-900 font-black
                             px-2.5 py-0.5 rounded-full text-sm">
              {itemCount}
            </span>
            <span className="text-base">Ver mi pedido</span>
            <span className="text-sm opacity-75 font-medium">→</span>
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-brand-900 text-gray-400 mt-10 border-t border-gold-600/20">
        <div className="h-0.5 gold-gradient" />
        <div className="max-w-6xl mx-auto px-4 py-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img
              src="/fotos/logo.jpeg"
              alt="El Pollito Gus"
              className="w-11 h-11 rounded-xl object-cover ring-2 ring-gold-600/40"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="text-left">
              <div className="font-bold text-white text-base">El Pollito Gus</div>
              <div className="text-gold-500 text-xs">Pollo Fresco y Confiable</div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-sm mb-5">
            <span>Boneless · Nuggets · Tenders · Palomitas</span>
            <span>💳 Tarjetas de crédito y débito bienvenidas</span>
          </div>

          <div className="flex justify-center gap-2 mb-5">
            {['🔥 Natural', '🍋 Limón', '🌶️ Buffalo'].map(s => (
              <span key={s}
                className="bg-brand-800 border border-gold-600/20 text-gray-500
                           text-xs px-3 py-1.5 rounded-full">
                {s}
              </span>
            ))}
          </div>

          <a
            href="/admin/login"
            className="text-gray-600 hover:text-gray-400 text-xs underline
                       underline-offset-2 transition-colors"
          >
            Acceso administrador
          </a>
        </div>
      </footer>

      {/* Cart sidebar */}
      <Cart onCheckout={() => setView('form')} />

      {/* Order form modal */}
      {view === 'form' && (
        <OrderForm
          onSuccess={handleOrderSuccess}
          onCancel={() => setView('menu')}
        />
      )}

      {/* Confirmation modal */}
      {view === 'confirmation' && orderData && (
        <OrderConfirmation
          orderData={orderData}
          onClose={() => setView('menu')}
        />
      )}
    </div>
  );
}
