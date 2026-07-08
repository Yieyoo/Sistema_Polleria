import { useState, useEffect } from 'react';
import { getCategories, getProducts } from '../services/api.js';
import ProductCard from './ProductCard.jsx';

const FRESH_IDS = [1, 2, 3, 10, 11];

export default function MenuSection() {
  const [categories,       setCategories]       = useState([]);
  const [freshByCategory,  setFreshByCategory]  = useState({});
  const [activePrepared,   setActivePrepared]   = useState(null);
  const [preparedProducts, setPreparedProducts] = useState([]);
  const [loadingPrepared,  setLoadingPrepared]  = useState(false);
  const [error,            setError]            = useState(null);

  useEffect(() => {
    getCategories()
      .then(async ({ data }) => {
        setCategories(data);

        // Carga todos los productos frescos de golpe
        const freshCats = data
          .filter(c => FRESH_IDS.includes(c.id))
          .sort((a, b) => a.sort_order - b.sort_order);
        const results = {};
        for (const cat of freshCats) {
          const { data: prods } = await getProducts(cat.id);
          results[cat.id] = prods;
        }
        setFreshByCategory(results);

        // Primera categoría preparada activa
        const firstPrep = data.find(c => !FRESH_IDS.includes(c.id));
        if (firstPrep) setActivePrepared(firstPrep.id);
      })
      .catch(() => setError('No se pudieron cargar las categorías.'));
  }, []);

  useEffect(() => {
    if (!activePrepared) return;
    setLoadingPrepared(true);
    getProducts(activePrepared)
      .then(({ data }) => { setPreparedProducts(data); setLoadingPrepared(false); })
      .catch(() => setLoadingPrepared(false));
  }, [activePrepared]);

  const freshCats   = categories.filter(c =>  FRESH_IDS.includes(c.id)).sort((a, b) => a.sort_order - b.sort_order);
  const preparedCats = categories.filter(c => !FRESH_IDS.includes(c.id));

  if (error) return (
    <div className="text-center py-16 text-gray-500">
      <span className="text-4xl">😕</span><p className="mt-2">{error}</p>
    </div>
  );

  return (
    <section id="menu" className="max-w-6xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-brand-900">
          Nuestro <span className="gold-text">Menú</span>
        </h2>
        <p className="text-gray-500 mt-1">Selecciona un producto y agrégalo al carrito</p>
      </div>

      {/* ═══════════════════════════════════════
          POLLO FRESCO — todas las categorías
      ═══════════════════════════════════════ */}
      <div className="mb-14">
        {/* Encabezado sección */}
        <div className="flex items-center gap-3 mb-5">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-green-200" />
          <span className="flex items-center gap-2 text-sm font-bold text-green-700 uppercase tracking-widest">
            <span className="w-2.5 h-2.5 bg-green-400 rounded-full" />
            Pollo Fresco
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-green-200" />
        </div>

        {/* Nota precio */}
        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl px-4 py-3
                        flex items-start gap-2 text-sm text-green-800">
          <span className="text-lg">📞</span>
          <div>
            <span className="font-semibold">Precio por kg.</span>
            {' '}Indica en las notas del pedido la cantidad que necesitas.
            Los precios pueden variar según el corte.
          </div>
        </div>

        {/* Categorías y sus productos */}
        <div className="space-y-10">
          {freshCats.map(cat => (
            <div key={cat.id}>
              {/* Título de categoría */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{cat.emoji}</span>
                <div>
                  <h3 className="font-extrabold text-brand-900 text-lg leading-tight">{cat.name}</h3>
                  <p className="text-gray-400 text-xs">{cat.description}</p>
                </div>
                <div className="h-px flex-1 bg-gray-100 ml-2" />
              </div>

              {/* Productos */}
              {!freshByCategory[cat.id] ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
                      <div className="h-36 bg-gray-200" />
                      <div className="p-3 space-y-2">
                        <div className="h-3 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-100 rounded w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {freshByCategory[cat.id].map(p => (
                    <ProductCard key={p.id} product={p} isFresh={true} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════
          PREPARADOS — tabs como antes
      ═══════════════════════════════════════ */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-200" />
          <span className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest">
            <span className="w-2.5 h-2.5 bg-gold-500 rounded-full" />
            Preparados
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gray-200" />
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-6">
          {preparedCats.map(cat => (
            <button key={cat.id} onClick={() => setActivePrepared(cat.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full
                          font-semibold text-sm transition-all whitespace-nowrap border
                          ${activePrepared === cat.id
                            ? 'bg-brand-900 text-gold-400 border-gold-500/50 shadow-md'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 shadow-sm'}`}>
              <span>{cat.emoji}</span><span>{cat.name}</span>
            </button>
          ))}
        </div>

        {loadingPrepared ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
                <div className="h-44 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {preparedProducts.map(p => <ProductCard key={p.id} product={p} isFresh={false} />)}
          </div>
        )}
      </div>
    </section>
  );
}
