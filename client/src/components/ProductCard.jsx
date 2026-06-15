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
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md
                    transition-all border border-gray-100 hover:border-gold-200
                    group animate-fade-in flex flex-col">
      {/* Image */}
      <div className="relative h-36 sm:h-40 overflow-hidden bg-gray-100 flex-shrink-0">
        <img
          src={product.image_url || 'https://placehold.co/400x300/111/d4a017?text=🍗'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => { e.target.src = 'https://placehold.co/400x300/111111/d4a017?text=🍗'; }}
        />
        {!product.available && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-white text-gray-700 font-semibold px-3 py-1 rounded-full text-xs">
              No disponible
            </span>
          </div>
        )}
        {isFresh && (
          <span className="absolute top-2 left-2 bg-green-600 text-white text-[10px]
                           font-bold px-2 py-0.5 rounded-full shadow-sm">
            Por kg
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-gray-400 text-xs mt-1 line-clamp-2 leading-relaxed flex-1">
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-50">
          {isFresh ? (
            <span className="text-green-700 text-xs font-semibold bg-green-50
                             px-2 py-1 rounded-lg">
              Precio por kg
            </span>
          ) : (
            <span className="text-brand-900 font-extrabold text-base">
              ${parseFloat(product.price).toFixed(0)}
            </span>
          )}
          <button
            onClick={handleAdd}
            disabled={!product.available}
            className="w-9 h-9 bg-brand-900 hover:bg-brand-700 active:bg-black
                       disabled:bg-gray-200 disabled:cursor-not-allowed
                       text-gold-400 rounded-full flex items-center justify-center
                       transition-colors border border-gold-600/30
                       hover:border-gold-500/60 flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
