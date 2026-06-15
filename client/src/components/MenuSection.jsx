import { useState, useEffect } from 'react';
import { getCategories, getProducts } from '../services/api.js';
import { useCart } from '../context/CartContext.jsx';
import ProductCard from './ProductCard.jsx';

const FRESH_IDS = [1, 2, 3];

export default function MenuSection() {
  const [categories,     setCategories]   = useState([]);
  const [products,       setProducts]     = useState([]);
  const [activeCategory, setActive]       = useState(null);
  const [loading,        setLoading]      = useState(true);
  const [error,          setError]        = useState(null);
  const [featured,       setFeatured]     = useState([]);

  useEffect(() => {
    getCategories()
      .then(({ data }) => {
        setCategories(data);
        if (data.length) setActive(data[0].id);
      })
      .catch(() => setError('No se pudieron cargar las categorías.'));
  }, []);

  useEffect(() => {
    if (!activeCategory) return;
    setLoading(true);
    getProducts(activeCategory)
      .then(({ data }) => { setProducts(data); setLoading(false); })
      .catch(() => { setError('Error al cargar productos.'); setLoading(false); });
  }, [activeCategory]);

  // Carga "Lo más pedido" (Boneless — cat 4) independiente del tab activo
  useEffect(() => {
    getProducts(4)
      .then(({ data }) => setFeatured(data.slice(0, 6)))
      .catch(() => {});
  }, []);

  const freshCats    = categories.filter(c =>  FRESH_IDS.includes(c.id));
  const preparedCats = categories.filter(c => !FRESH_IDS.includes(c.id));
  const isFresh      = FRESH_IDS.includes(activeCategory);
  const activeLabel  = categories.find(c => c.id === activeCategory);

  if (error) return (
    <div className="text-center py-16 text-gray-400">
      <span className="text-5xl">😕</span>
      <p className="mt-3 font-medium">{error}</p>
    </div>
  );

  return (
    <section id="menu" className="pb-12">

      {/* ── Sticky category tabs ─────────────────────────────── */}
      <div className="sticky top-16 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 space-y-2.5">

          {/* Pollo Fresco */}
          {freshCats.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5
                            flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                Pollo Fresco
              </p>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
                {freshCats.map(cat => (
                  <button key={cat.id} onClick={() => setActive(cat.id)}
                    className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5
                                rounded-full font-semibold text-xs transition-all whitespace-nowrap
                                ${activeCategory === cat.id
                                  ? 'bg-green-700 text-white shadow-sm'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    <span>{cat.emoji}</span><span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Preparados */}
          {preparedCats.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5
                            flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-gold-500 rounded-full" />
                Preparados
              </p>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
                {preparedCats.map(cat => (
                  <button key={cat.id} onClick={() => setActive(cat.id)}
                    className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5
                                rounded-full font-semibold text-xs transition-all whitespace-nowrap
                                ${activeCategory === cat.id
                                  ? 'bg-brand-900 text-gold-400 shadow-sm'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    <span>{cat.emoji}</span><span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 pt-6">

        {/* Aviso pollo fresco */}
        {isFresh && (
          <div className="mb-5 bg-green-50 border border-green-200 rounded-2xl px-4 py-3
                          flex items-start gap-3 text-sm text-green-800">
            <span className="text-lg flex-shrink-0">📞</span>
            <div>
              <span className="font-semibold">Pollo fresco — precio por kg.</span>
              {' '}Indica en las notas la cantidad que necesitas.
              Los precios varían según el corte.
            </div>
          </div>
        )}

        {/* Lo más pedido — horizontal scroll */}
        {!isFresh && featured.length > 0 && (
          <div className="mb-8 animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-900 text-base">🔥 Lo más pedido</h3>
              <button
                onClick={() => setActive(4)}
                className="text-gold-600 hover:text-gold-700 text-sm font-semibold transition-colors">
                Ver todos →
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
              {featured.map(p => <FeaturedCard key={p.id} product={p} />)}
            </div>
          </div>
        )}

        {/* Section heading */}
        {activeLabel && (
          <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>{activeLabel.emoji}</span>
            <span>{activeLabel.name}</span>
          </h2>
        )}

        {/* Product grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
                <div className="h-36 bg-gray-200" />
                <div className="p-3 space-y-2">
                  <div className="h-3.5 bg-gray-200 rounded-full w-3/4" />
                  <div className="h-3 bg-gray-100 rounded-full w-full" />
                  <div className="h-3 bg-gray-100 rounded-full w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <span className="text-5xl">🍽️</span>
            <p className="mt-3 font-medium">No hay productos disponibles</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {products.map(p => (
              <ProductCard key={p.id} product={p} isFresh={FRESH_IDS.includes(p.category_id)} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function FeaturedCard({ product }) {
  const { addItem, openCart } = useCart();

  const handleAdd = () => {
    addItem({
      id:         product.id,
      name:       product.name,
      price:      parseFloat(product.price),
      image_url:  product.image_url,
      product_id: product.id,
    });
    openCart();
  };

  return (
    <div className="flex-shrink-0 w-40 bg-white rounded-2xl shadow-sm border border-gray-100
                    overflow-hidden hover:shadow-md hover:border-gold-200 transition-all animate-fade-in">
      <div className="h-24 bg-gray-100 overflow-hidden">
        <img
          src={product.image_url || 'https://placehold.co/160x96/111/d4a017?text=🍗'}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => { e.target.src = 'https://placehold.co/160x96/111/d4a017?text=🍗'; }}
        />
      </div>
      <div className="p-2.5">
        <p className="font-semibold text-gray-900 text-xs leading-tight line-clamp-2 min-h-[32px]">
          {product.name}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-brand-900 font-bold text-sm">
            ${parseFloat(product.price).toFixed(0)}
          </span>
          <button
            onClick={handleAdd}
            className="w-7 h-7 bg-brand-900 hover:bg-brand-700 active:bg-black
                       text-gold-400 rounded-full flex items-center justify-center
                       transition-colors flex-shrink-0 border border-gold-600/30
                       hover:border-gold-500/60">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
