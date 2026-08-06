import { useState, useEffect } from 'react';
import { getCategories, getProducts } from '../services/api.js';
import { useCart } from '../context/CartContext.jsx';
import ProductCard from './ProductCard.jsx';

const FRESH_IDS = [1, 2, 3, 10, 11];

// Imagen por categoría fresca
const FRESH_IMAGES = {
  1:  '/fotos/pechuga.jpg',
  2:  '/fotos/pierna-muslo.jpg',
  3:  '/fotos/piernas.jpg',
  10: '/fotos/alitas.jpg',
  11: '/fotos/retazo.jpg',
};

function FreshProductRow({ product }) {
  const { addItem, openCart } = useCart();
  const handleAdd = () => {
    addItem({ id: product.id, name: product.name, price: parseFloat(product.price),
              image_url: product.image_url, product_id: product.id });
    openCart();
  };
  return (
    <div className="flex items-center justify-between px-4 py-3
                    border-b border-gray-100 last:border-0 hover:bg-white transition-colors">
      <div className="flex-1 min-w-0 pr-3">
        <p className="font-semibold text-brand-900 text-sm leading-tight">{product.name}</p>
        <span className="inline-block mt-0.5 text-green-700 text-xs font-medium
                         bg-green-50 px-2 py-0.5 rounded-full">Precio por kg</span>
      </div>
      <button
        onClick={handleAdd}
        className="flex-shrink-0 flex items-center gap-1 bg-brand-900 hover:bg-brand-700
                   text-gold-400 font-bold text-sm px-4 py-2 rounded-xl transition-colors
                   border border-gold-600/30"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Agregar
      </button>
    </div>
  );
}

export default function MenuSection() {
  const [categories,       setCategories]       = useState([]);
  const [freshByCategory,  setFreshByCategory]  = useState({});
  const [openFreshCat,     setOpenFreshCat]     = useState(null);
  const [activePrepared,   setActivePrepared]   = useState(null);
  const [preparedProducts, setPreparedProducts] = useState([]);
  const [loadingPrepared,  setLoadingPrepared]  = useState(false);
  const [error,            setError]            = useState(null);

  useEffect(() => {
    getCategories()
      .then(async ({ data }) => {
        setCategories(data);
        const freshCats = data.filter(c => FRESH_IDS.includes(c.id)).sort((a, b) => a.sort_order - b.sort_order);
        const results = {};
        for (const cat of freshCats) {
          const { data: prods } = await getProducts(cat.id);
          results[cat.id] = prods;
        }
        setFreshByCategory(results);
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

  const freshCats    = categories.filter(c =>  FRESH_IDS.includes(c.id)).sort((a, b) => a.sort_order - b.sort_order);
  const preparedCats = categories.filter(c => !FRESH_IDS.includes(c.id));

  const toggleFresh = (id) => setOpenFreshCat(prev => prev === id ? null : id);

  if (error) return (
    <div className="text-center py-16 text-gray-500">
      <span className="text-4xl">😕</span><p className="mt-2">{error}</p>
    </div>
  );

  return (
    <section id="menu" className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-brand-900">
          Nuestro <span className="gold-text">Menú</span>
        </h2>
        <p className="text-gray-500 mt-1">Selecciona un producto y agrégalo al carrito</p>
      </div>

      {/* ══ POLLO FRESCO ══ */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-green-200" />
          <span className="flex items-center gap-2 text-xs font-bold text-green-700 uppercase tracking-widest">
            <span className="w-2 h-2 bg-green-400 rounded-full" />
            Pollo Fresco
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-green-200" />
        </div>

        <div className="mb-4 bg-green-50 border border-green-200 rounded-xl px-4 py-3
                        flex items-start gap-2 text-sm text-green-800">
          <span className="text-base">📞</span>
          <div>
            <span className="font-semibold">Precio por kg.</span>
            {' '}Indica en las notas la cantidad que necesitas.
          </div>
        </div>

        {/* Tarjetas tipo Provexa */}
        <div className="space-y-3">
          {freshCats.map(cat => {
            const isOpen   = openFreshCat === cat.id;
            const products = freshByCategory[cat.id] || [];
            const imgSrc   = FRESH_IMAGES[cat.id] || '/fotos/logo.jpeg';

            return (
              <div key={cat.id} className="rounded-2xl overflow-hidden shadow-sm border border-gray-200 bg-white">
                {/* Cabecera con imagen de fondo */}
                <button
                  onClick={() => toggleFresh(cat.id)}
                  className="relative w-full h-24 flex items-end text-left overflow-hidden"
                >
                  <img
                    src={imgSrc}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />
                  <div className="relative z-10 flex items-center justify-between w-full px-4 pb-4 pt-0">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl drop-shadow">{cat.emoji}</span>
                      <div>
                        <p className="font-extrabold text-white text-base leading-tight drop-shadow">{cat.name}</p>
                        <p className="text-white/70 text-xs">
                          {products.length > 0 ? `${products.length} opciones` : cat.description}
                        </p>
                      </div>
                    </div>
                    <span className={`text-white text-2xl font-light transition-transform duration-200 drop-shadow
                                     ${isOpen ? 'rotate-45' : ''}`}>
                      +
                    </span>
                  </div>
                </button>

                {/* Lista de sub-productos sin imágenes */}
                {isOpen && (
                  <div className="bg-gray-50 border-t border-gray-100">
                    {products.length === 0 ? (
                      <p className="text-gray-400 text-sm px-4 py-3">Cargando...</p>
                    ) : (
                      products.map(p => <FreshProductRow key={p.id} product={p} />)
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ══ PREPARADOS ══ */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gray-200" />
          <span className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <span className="w-2 h-2 bg-gold-500 rounded-full" />
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
