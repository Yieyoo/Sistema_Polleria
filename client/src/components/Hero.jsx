export default function Hero() {
  const scrollToMenu = () => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bg-brand-900 border-b border-gold-600/20">
      {/* Línea dorada superior */}
      <div className="h-0.5 gold-gradient" />

      <div className="max-w-6xl mx-auto px-4 pt-7 pb-8">

        {/* Top row: logo + name */}
        <div className="flex items-start gap-4">
          <div className="w-[72px] h-[72px] md:w-20 md:h-20 rounded-2xl overflow-hidden
                          bg-brand-800 flex-shrink-0 ring-2 ring-gold-500/50 shadow-lg
                          shadow-gold-500/10">
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
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-gold-600/40
                               text-gold-400 text-xs font-semibold px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                Abierto ahora
              </span>
              <span className="text-gray-500 text-xs hidden sm:inline">· Tarjetas bienvenidas</span>
            </div>
            <h1 className="font-extrabold text-2xl md:text-[28px] leading-none tracking-tight">
              <span className="text-white">El Pollito </span>
              <span className="gold-text">Gus</span>
            </h1>
            <p className="text-gray-400 text-sm mt-1 leading-snug">
              Boneless · Nuggets · Tenders · Palomitas
            </p>
            <p className="text-gold-600 text-xs mt-0.5">
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
              className="flex-shrink-0 inline-flex items-center gap-1.5 bg-white/5
                         border border-white/10 text-gray-300 text-xs font-medium
                         px-3 py-1.5 rounded-full whitespace-nowrap">
              {s.icon} {s.text}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-5">
          <button
            onClick={scrollToMenu}
            className="gold-gradient text-brand-900 font-black text-sm px-6 py-2.5
                       rounded-full hover:opacity-90 active:opacity-80
                       transition-opacity shadow-lg shadow-gold-500/25"
          >
            Ver menú completo ↓
          </button>
        </div>
      </div>
    </section>
  );
}
