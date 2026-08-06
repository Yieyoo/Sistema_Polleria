import { useState, useEffect } from 'react';
import { getCategories, getProducts } from '../services/api.js';
import { useCart } from '../context/CartContext.jsx';

const FRESH_IDS    = [1, 2, 10, 11];
const ACCORDION_IDS = [1, 2, 10, 11, 12];

const CATEGORY_IMAGES = {
  1:  '/fotos/pechuga.jpg',
  2:  '/fotos/pierna-muslo.jpg',
  10: '/fotos/alitas.jpg',
  11: '/fotos/retazo.jpg',
  12: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&q=80',
};

function shortName(name, catName) {
  if (name.includes(' — ')) return name.split(' — ')[1];
  const firstWord = catName.split(' ')[0];
  // quitar sufijo "de [Categoria]..."
  const noSuffix = name.replace(new RegExp(`\\s+de\\s+${firstWord}.*`, 'i'), '');
  if (noSuffix !== name) return noSuffix;
  // quitar prefijo "[Categoria] (de Pollo|en|para|con|sin)?"
  const stripped = name.replace(new RegExp(`^${firstWord}\\s+(de\\s+Pollo\\s+|en\\s+|para\\s+)?`, 'i'), '');
  // si quedó vacío o empieza con preposición, devolver nombre completo
  const startsWithPrep = /^(de|en|para|con|sin)\s/i.test(stripped);
  return (stripped && !startsWithPrep) ? stripped : name;
}

function FreshProductRow({ product, catName, isFresh }) {
  const { addItem, openCart } = useCart();
  const handleAdd = () => {
    addItem({ id: product.id, name: product.name, price: parseFloat(product.price),
              image_url: product.image_url, product_id: product.id });
    openCart();
  };
  return (
    <div className="flex items-center gap-2 px-4 py-1.5
                    border-b border-gray-100 last:border-0 hover:bg-white transition-colors">
      <p className="flex-1 font-semibold text-brand-900 text-sm truncate">
        {isFresh ? shortName(product.name, catName) : product.name}
      </p>
      {isFresh ? (
        <span className="text-green-700 text-xs font-semibold w-14 text-right shrink-0">por kg</span>
      ) : (
        <p className="text-brand-900 font-bold text-sm w-14 text-right shrink-0">
          ${parseFloat(product.price).toFixed(2)}
        </p>
      )}
      <button
        onClick={handleAdd}
        className="flex-shrink-0 flex items-center justify-center bg-brand-900 hover:bg-brand-700
                   text-gold-400 w-7 h-7 rounded-lg transition-colors border border-gold-600/30"
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
}

const PRESENTACIONES = ['Entera', 'Bistec', 'Fajitas', 'Alambre', 'Molida'];

function CombinadoSelector() {
  const { addItem, openCart } = useCart();
  const [piernas, setPiernas] = useState({ qty: 1, pres: 'Entera' });
  const [muslos,  setMuslos]  = useState({ qty: 1, pres: 'Entera' });

  const handleAdd = () => {
    const p = piernas.qty > 0 ? `${piernas.qty} Pierna${piernas.qty > 1 ? 's' : ''} ${piernas.pres}` : '';
    const m = muslos.qty  > 0 ? `${muslos.qty} Muslo${muslos.qty   > 1 ? 's' : ''} ${muslos.pres}`   : '';
    const label = [p, m].filter(Boolean).join(' + ');
    addItem({
      id: `comb-${Date.now()}`,
      product_id: `comb-${Date.now()}`,
      name: `Combinado: ${label}`,
      price: 0,
      image_url: '/fotos/pierna-muslo.jpg',
    });
    openCart();
  };

  const Stepper = ({ value, onChange }) => (
    <div className="flex items-center gap-1.5">
      <button onClick={() => onChange(Math.max(0, value - 1))}
        className="w-7 h-7 rounded-lg bg-brand-900 text-gold-400 font-bold text-base flex items-center justify-center border border-gold-600/30 leading-none">
        −
      </button>
      <span className="w-5 text-center font-bold text-brand-900 text-sm">{value}</span>
      <button onClick={() => onChange(Math.min(30, value + 1))}
        className="w-7 h-7 rounded-lg bg-brand-900 text-gold-400 font-bold text-base flex items-center justify-center border border-gold-600/30 leading-none">
        +
      </button>
    </div>
  );

  const PresChips = ({ value, onChange, disabled }) => (
    <div className="flex flex-wrap gap-1 mt-1.5">
      {PRESENTACIONES.map(p => (
        <button key={p} onClick={() => !disabled && onChange(p)}
          className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors
            ${disabled ? 'opacity-30 cursor-default bg-white text-gray-400 border-gray-200'
              : value === p
                ? 'bg-brand-900 text-gold-400 border-gold-600/30'
                : 'bg-white text-gray-600 border-gray-200 hover:border-brand-400'}`}>
          {p}
        </button>
      ))}
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-center gap-3 px-4 py-1.5 bg-brand-900 mt-1">
        <div className="w-1 h-3 rounded-full bg-gold-400" />
        <span className="text-xs font-extrabold text-gold-400 uppercase tracking-widest">Combinado</span>
        <div className="w-1 h-3 rounded-full bg-gold-400" />
      </div>

      <div className="px-4 py-3 space-y-3">
        {/* Piernas */}
        <div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-brand-900">Piernas</span>
            <Stepper value={piernas.qty} onChange={qty => setPiernas(p => ({ ...p, qty }))} />
          </div>
          <PresChips value={piernas.pres} onChange={pres => setPiernas(p => ({ ...p, pres }))} disabled={piernas.qty === 0} />
        </div>

        <div className="h-px bg-gray-200" />

        {/* Muslos */}
        <div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-brand-900">Muslos</span>
            <Stepper value={muslos.qty} onChange={qty => setMuslos(p => ({ ...p, qty }))} />
          </div>
          <PresChips value={muslos.pres} onChange={pres => setMuslos(p => ({ ...p, pres }))} disabled={muslos.qty === 0} />
        </div>

        <button onClick={handleAdd}
          disabled={piernas.qty === 0 && muslos.qty === 0}
          className="w-full flex items-center justify-center gap-2 bg-brand-900 hover:bg-brand-700
                     disabled:opacity-40 disabled:cursor-not-allowed
                     text-gold-400 font-bold py-2.5 rounded-xl transition-colors border border-gold-600/30">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Agregar combinado
        </button>
        <p className="text-center text-xs text-gray-400 pb-1">Precio por kg — se calcula en tienda</p>
      </div>
    </div>
  );
}

function GroupedProductList({ products, isFresh = false, catName = '' }) {
  const { addItem, openCart } = useCart();

  const handleAdd = (p) => {
    addItem({ id: p.id, name: p.name, price: parseFloat(p.price),
              image_url: p.image_url, product_id: p.id });
    openCart();
  };

  const sections = [];
  let lastGroup = undefined;
  products.forEach(p => {
    const g = p.group || null;
    if (g !== lastGroup) { sections.push({ groupName: g, items: [] }); lastGroup = g; }
    sections[sections.length - 1].items.push(p);
  });

  return (
    <>
      {sections.map((sec, si) => (
        <div key={si}>
          {sec.groupName && (
            <div className="flex items-center justify-center gap-3 px-4 py-1.5 bg-brand-900 mt-1">
              <div className="w-1 h-3 rounded-full bg-gold-400" />
              <span className="text-xs font-extrabold text-gold-400 uppercase tracking-widest">{sec.groupName}</span>
              <div className="w-1 h-3 rounded-full bg-gold-400" />
            </div>
          )}
          {sec.items.map(p => (
            <div key={p.id}
              className="flex items-center gap-2 px-4 py-1.5
                         border-b border-gray-100 last:border-0 hover:bg-white transition-colors">
              <p className="flex-1 font-semibold text-brand-900 text-sm truncate">
                {isFresh ? shortName(p.name, catName) : (p.short_name || p.name)}
              </p>
              {isFresh ? (
                <span className="text-green-700 text-xs font-semibold w-14 text-right shrink-0">por kg</span>
              ) : (
                <p className="text-brand-900 font-bold text-sm w-14 text-right shrink-0">
                  ${parseFloat(p.price).toFixed(2)}
                </p>
              )}
              <button onClick={() => handleAdd(p)}
                className="flex-shrink-0 flex items-center justify-center bg-brand-900 hover:bg-brand-700
                           text-gold-400 w-7 h-7 rounded-lg transition-colors border border-gold-600/30">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

export default function MenuSection() {
  const [categories,       setCategories]       = useState([]);
  const [freshByCategory,  setFreshByCategory]  = useState({});
  const [openFreshCat,     setOpenFreshCat]     = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCategories()
      .then(async ({ data }) => {
        setCategories(data);
        const freshCats = data.filter(c => ACCORDION_IDS.includes(c.id)).sort((a, b) => a.sort_order - b.sort_order);
        const results = {};
        for (const cat of freshCats) {
          const { data: prods } = await getProducts(cat.id);
          results[cat.id] = prods;
        }
        setFreshByCategory(results);
      })
      .catch(() => setError('No se pudieron cargar las categorías.'));
  }, []);

  const freshCats = categories.filter(c => ACCORDION_IDS.includes(c.id)).sort((a, b) => a.sort_order - b.sort_order);

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
            <span className="font-semibold">Pollo fresco — precio por kg.</span>
            {' '}Indica en las notas la cantidad que necesitas.
            Los precios de preparados son por porción.
          </div>
        </div>

        {/* Tarjetas tipo Provexa */}
        <div className="space-y-3">
          {freshCats.map(cat => {
            const isOpen   = openFreshCat === cat.id;
            const products = freshByCategory[cat.id] || [];
            const isFresh  = FRESH_IDS.includes(cat.id);
            const imgSrc   = CATEGORY_IMAGES[cat.id] || '/fotos/logo.jpeg';

            return (
              <div key={cat.id}
                className={`rounded-2xl overflow-hidden bg-white transition-all duration-300
                            ${isOpen
                              ? 'shadow-lg shadow-black/20 ring-2 ring-gold-400/60 scale-[1.01]'
                              : 'shadow-sm border border-gray-200'}`}>

                {/* Cabecera con imagen de fondo */}
                <button
                  onClick={() => toggleFresh(cat.id)}
                  className="relative w-full h-24 flex items-end text-left overflow-hidden"
                >
                  <img
                    src={imgSrc}
                    alt={cat.name}
                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500
                                ${isOpen ? 'scale-105' : 'scale-100'}`}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div className={`absolute inset-0 transition-all duration-300
                                   ${isOpen
                                     ? 'bg-gradient-to-r from-black/85 via-black/60 to-black/30'
                                     : 'bg-gradient-to-r from-black/75 via-black/50 to-black/20'}`} />
                  <div className="relative z-10 flex items-center justify-between w-full px-4 pb-4 pt-0">
                    <div>
                      <p className="font-extrabold text-white text-base leading-tight drop-shadow">{cat.name}</p>
                      <p className={`text-xs transition-colors duration-300
                                    ${isOpen ? 'text-gold-400' : 'text-white/70'}`}>
                        {products.length > 0 ? `${products.length} opciones` : cat.description}
                      </p>
                    </div>
                    <svg className={`w-5 h-5 drop-shadow transition-all duration-300
                                    ${isOpen ? 'rotate-180 text-gold-400' : 'text-white'}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Lista de sub-productos — slide con grid trick */}
                <div style={{
                  display: 'grid',
                  gridTemplateRows: isOpen ? '1fr' : '0fr',
                  transition: 'grid-template-rows 300ms ease'
                }}>
                  <div style={{ overflow: 'hidden' }}>
                    <div className="bg-gray-50 border-t border-gray-100">
                      {products.length === 0 ? (
                        <p className="text-gray-400 text-sm px-4 py-3">Cargando...</p>
                      ) : (
                        <>
                          <GroupedProductList products={products} isFresh={isFresh} catName={cat.name} />
                          {cat.id === 2 && <CombinadoSelector />}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
