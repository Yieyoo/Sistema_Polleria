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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />
      <MenuSection />

      {/* Sticky CTA móvil */}
      {itemCount > 0 && view === 'menu' && (
        <div className="fixed bottom-4 left-4 right-4 sm:hidden z-30">
          <button
            onClick={openCart}
            className="w-full gold-gradient text-brand-900 font-black
                       py-4 rounded-2xl shadow-2xl shadow-gold-500/40
                       flex items-center justify-center gap-2 text-lg"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h11M7 13L5.4 5M10 21a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2z"/>
            </svg>
            Ver mi pedido ({itemCount})
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-brand-900 text-gray-400 text-center py-10 mt-12">
        <img src="/logo.png" alt="El Pollito Gus" className="w-16 h-16 rounded-full mx-auto mb-3 ring-2 ring-gold-600/40 object-cover"
          onError={(e) => { e.target.style.display='none'; }} />
        <p className="font-bold text-gold-400 text-lg mb-1">El Pollito Gus</p>
        <p className="text-sm">Pollo Fresco y Confiable</p>
        <p className="text-sm mt-1">Boneless · Nuggets · Tenders · Palomitas</p>
        <p className="text-sm mt-1">💳 Tarjetas de crédito y débito bienvenidas</p>

        <a href="/admin/login" className="mt-4 inline-block text-gray-600 hover:text-gray-400 text-xs underline">
          Acceso administrador
        </a>
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
