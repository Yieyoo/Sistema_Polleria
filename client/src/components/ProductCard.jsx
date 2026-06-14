import { useCart } from '../context/CartContext.jsx';

export default function ProductCard({ product, isFresh = false }) {
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
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all
                    overflow-hidden flex flex-col animate-fade-in group
                    border border-gray-100 hover:border-gold-300">
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-gray-100">
        <img
          src={product.image_url || 'https://placehold.co/400x300/111/d4a017?text=🍗'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => { e.target.src = 'https://placehold.co/400x300/111111/d4a017?text=🍗'; }}
        />
        {!product.available && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-white text-gray-700 font-semibold px-3 py-1 rounded-full text-sm">
              No disponible
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-bold text-gray-900 text-base leading-tight mb-1">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-gray-500 text-sm flex-1 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-auto">
          {isFresh ? (
            <span className="text-green-700 font-bold text-sm bg-green-50 px-2 py-1 rounded-lg">
              Precio por kg
            </span>
          ) : (
            <span className="text-brand-900 font-extrabold text-xl">
              ${parseFloat(product.price).toFixed(2)}
            </span>
          )}
          <button
            onClick={handleAdd}
            disabled={!product.available}
            className="bg-brand-900 hover:bg-brand-700 disabled:bg-gray-200 disabled:cursor-not-allowed
                       text-gold-400 font-bold px-4 py-2 rounded-xl transition-colors
                       flex items-center gap-1.5 border border-gold-600/30 hover:border-gold-500/60"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}
