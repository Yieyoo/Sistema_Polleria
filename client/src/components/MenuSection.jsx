import { useState, useEffect } from 'react';
import { getCategories, getProducts } from '../services/api.js';
import ProductCard from './ProductCard.jsx';

// Categorías de pollo fresco (ids 1-3)
const FRESH_IDS = [1, 2, 3];

export default function MenuSection() {
  const [categories,     setCategories]   = useState([]);
  const [products,       setProducts]     = useState([]);
  const [activeCategory, setActive]       = useState(null);
  const [loading,        setLoading]      = useState(true);
  const [error,          setError]        = useState(null);

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

  const freshCats   = categories.filter(c => FRESH_IDS.includes(c.id));
  const preparedCats = categories.filter(c => !FRESH_IDS.includes(c.id));
  const isFresh     = FRESH_IDS.includes(activeCategory);

  if (error) return (
    <div className="text-center py-16 text-gray-500">
      <span className="text-4xl">😕</span><p className="mt-2">{error}</p>
    </div>
  );

  return (
    <section id="menu" className="max-w-6xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-brand-900">
          Nuestro <span className="gold-text">Menú</span>
        </h2>
        <p className="text-gray-500 mt-1">Selecciona una categoría y agrega al carrito</p>
      </div>

      {/* ── Sección: Pollo Fresco ── */}
      <div className="mb-2">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-200" />
          <span className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <span className="w-2 h-2 bg-green-400 rounded-full" />
            Pollo Fresco
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-200" />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {freshCats.map(cat => (
            <button key={cat.id} onClick={() => setActive(cat.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full
                          font-semibold text-sm transition-all whitespace-nowrap border
                          ${activeCategory === cat.id
                            ? 'bg-green-700 text-white border-green-600 shadow-md'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-green-300 shadow-sm'}`}>
              <span>{cat.emoji}</span><span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Sección: Preparados ── */}
      <div className="mb-8 mt-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-200" />
          <span className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <span className="w-2 h-2 bg-gold-500 rounded-full" />
            Preparados
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-200" />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {preparedCats.map(cat => (
            <button key={cat.id} onClick={() => setActive(cat.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full
                          font-semibold text-sm transition-all whitespace-nowrap border
                          ${activeCategory === cat.id
                            ? 'bg-brand-900 text-gold-400 border-gold-500/50 shadow-md'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 shadow-sm'}`}>
              <span>{cat.emoji}</span><span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Nota precio para pollo fresco ── */}
      {isFresh && (
        <div className="mb-5 bg-green-50 border border-green-200 rounded-xl px-4 py-3
                        flex items-start gap-2 text-sm text-green-800">
          <span className="text-lg">📞</span>
          <div>
            <span className="font-semibold">Pollo fresco — precio por kg.</span>
            {' '}Indica en las notas del pedido la cantidad que necesitas.
            Los precios pueden variar según el corte.
          </div>
        </div>
      )}

      {/* ── Grid de productos ── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
              <div className="h-44 bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <span className="text-4xl">🍽️</span>
          <p className="mt-2">No hay productos disponibles.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map(p => <ProductCard key={p.id} product={p} isFresh={FRESH_IDS.includes(p.category_id)} />)}
        </div>
      )}
    </section>
  );
}
