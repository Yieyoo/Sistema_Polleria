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

          {/* Promo 1 — Boneless */}
          <button
            onClick={scrollToMenu}
            className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-amber-400
                       rounded-2xl p-4 text-left text-white hover:from-orange-600 hover:to-amber-500
                       active:scale-95 transition-all shadow-sm text-sm">
            <div className="absolute -right-3 -bottom-3 text-6xl opacity-20 pointer-events-none
                            select-none">🍗</div>
            <div className="font-extrabold leading-tight">Boneless</div>
            <div className="text-orange-100 text-xs mt-0.5">3 sabores desde $80</div>
            <span className="mt-3 inline-block bg-white/25 text-white text-xs font-bold
                              px-2.5 py-0.5 rounded-full">
              ⭐ Favorito
            </span>
          </button>

          {/* Promo 2 — Charolas */}
          <button
            onClick={scrollToMenu}
            className="relative overflow-hidden bg-gradient-to-br from-red-600 to-rose-500
                       rounded-2xl p-4 text-left text-white hover:from-red-700 hover:to-rose-600
                       active:scale-95 transition-all shadow-sm text-sm">
            <div className="absolute -right-3 -bottom-3 text-6xl opacity-20 pointer-events-none
                            select-none">🫕</div>
            <div className="font-extrabold leading-tight">Charola Grande</div>
            <div className="text-red-100 text-xs mt-0.5">Para 4 personas · $390</div>
            <span className="mt-3 inline-block bg-white/25 text-white text-xs font-bold
                              px-2.5 py-0.5 rounded-full">
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
            className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700
                       text-white font-bold py-4 rounded-2xl shadow-2xl shadow-orange-500/40
                       flex items-center justify-between px-5 transition-colors"
          >
            <span className="bg-white/20 text-white font-bold px-2.5 py-0.5 rounded-full text-sm">
              {itemCount}
            </span>
            <span className="text-base">Ver mi pedido</span>
            <span className="text-sm opacity-75 font-medium">→</span>
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-10">
        <div className="max-w-6xl mx-auto px-4 py-10 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img
              src="/fotos/logo.jpeg"
              alt="El Pollito Gus"
              className="w-11 h-11 rounded-xl object-cover shadow-sm"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="text-left">
              <div className="font-bold text-white text-base">El Pollito Gus</div>
              <div className="text-orange-400 text-xs">Pollo Fresco y Confiable</div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-x-5 gap-y-1
                          text-gray-500 text-sm mb-5">
            <span>Boneless · Nuggets · Tenders · Palomitas</span>
            <span>💳 Tarjetas de crédito y débito bienvenidas</span>
          </div>

          <div className="flex justify-center gap-3 mb-5">
            {['🔥 Natural', '🍋 Limón', '🌶️ Buffalo'].map(s => (
              <span key={s}
                className="bg-gray-800 text-gray-400 text-xs px-3 py-1.5 rounded-full">
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
