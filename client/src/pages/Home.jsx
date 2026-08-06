import { useState } from 'react';
import Navbar            from '../components/Navbar.jsx';
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
        {/* WhatsApp CTA */}
        <div className="border-t border-white/10 pt-8 pb-6 px-6 mb-6">
          <p className="text-white font-semibold text-sm mb-1">💬 ¿No encuentras lo que buscas?</p>
          <p className="text-gray-400 text-sm mb-4">📲 Escríbenos por WhatsApp</p>
          <a
            href="https://wa.me/521XXXXXXXXXX"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d]
                       text-white font-bold px-6 py-2.5 rounded-full transition-colors shadow-lg"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.562 4.14 1.541 5.875L0 24l6.29-1.512A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.368l-.36-.214-3.733.898.939-3.627-.235-.373A9.818 9.818 0 1112 21.818z"/>
            </svg>
            Contactar
          </a>
        </div>

        <img src="/fotos/logo.jpeg" alt="El Pollito Gus" className="w-16 h-16 rounded-full mx-auto mb-3 ring-2 ring-gold-600/40 object-cover"
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
