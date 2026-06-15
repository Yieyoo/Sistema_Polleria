export default function Hero() {
  const scrollToMenu = () => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bg-orange-500">
      <div className="max-w-6xl mx-auto px-4 pt-7 pb-8">

        {/* Top row: logo + name */}
        <div className="flex items-start gap-4">
          <div className="w-[72px] h-[72px] md:w-20 md:h-20 rounded-2xl overflow-hidden
                          bg-white/20 flex-shrink-0 ring-2 ring-white/30 shadow-lg">
            <img
              src="/fotos/logo.jpeg"
              alt="El Pollito Gus"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1562967914-608f82629710?w=200&q=80';
              }}
            />
          </div>

          <div className="flex-1 min-w-0 pt-0.5">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 bg-white/20 text-white
                               text-xs font-semibold px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                Abierto ahora
              </span>
              <span className="text-orange-100 text-xs hidden sm:inline">Tarjetas bienvenidas</span>
            </div>
            <h1 className="text-white font-extrabold text-2xl md:text-[28px] leading-none tracking-tight">
              El Pollito Gus
            </h1>
            <p className="text-orange-100 text-sm mt-1 leading-snug">
              Boneless · Nuggets · Tenders · Palomitas
            </p>
            <p className="text-orange-200 text-xs mt-0.5">
              Natural · Limón · Buffalo 🔥
            </p>
          </div>
        </div>

        {/* Stats chips */}
        <div className="flex items-center gap-2 mt-5 overflow-x-auto scrollbar-hide pb-0.5">
          {[
            { icon: '⭐', text: '4.8 calificación' },
            { icon: '⏱', text: '20–30 min' },
            { icon: '💳', text: 'Tarjetas' },
            { icon: '🏆', text: 'Siempre fresco' },
            { icon: '🛍️', text: 'Recoger en tienda' },
          ].map(s => (
            <span key={s.text}
              className="flex-shrink-0 inline-flex items-center gap-1.5 bg-white/15
                         text-white text-xs font-medium px-3 py-1.5 rounded-full">
              {s.icon} {s.text}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-5">
          <button
            onClick={scrollToMenu}
            className="bg-white text-orange-600 font-bold text-sm px-6 py-2.5
                       rounded-full hover:bg-orange-50 active:bg-orange-100
                       transition-colors shadow-sm"
          >
            Ver menú completo ↓
          </button>
        </div>
      </div>
    </section>
  );
}
