export default function Hero() {
  const scrollToMenu = () => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-brand-900 text-white">
      {/* Gold ring pattern */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='40' cy='40' r='30' stroke='%23d4a017' stroke-width='1' fill='none'/%3E%3C/svg%3E\")" }}
      />
      {/* Gold top border */}
      <div className="absolute top-0 left-0 right-0 h-1 gold-gradient" />

      <div className="relative max-w-6xl mx-auto px-4 py-14 md:py-20 flex flex-col md:flex-row items-center gap-10">

        {/* Text */}
        <div className="flex-1 text-center md:text-left animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-gold-600/40
                          text-gold-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Abierto · Tarjetas bienvenidas
          </div>

          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-4">
            <span className="gold-text">El Pollito</span>
            <br />
            <span className="text-white">Gus</span>
          </h1>

          <p className="text-gray-300 text-lg mb-3 max-w-md">
            Boneless · Nuggets · Tenders · Palomitas<br />
            <span className="text-gold-400 font-semibold">Natural · Limón · Buffalo 🔥</span>
          </p>
          <p className="text-gray-400 text-sm mb-8 max-w-sm">
            Pollo fresco y confiable. ¡Haz tu pedido en línea!
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <button
              onClick={scrollToMenu}
              className="gold-gradient text-brand-900 font-black
                         px-8 py-3.5 rounded-full text-lg transition-opacity
                         hover:opacity-90 shadow-lg shadow-gold-500/30"
            >
              Ver Menú 🍗
            </button>
            <a href="tel:+521XXXXXXXXXX"
              className="border-2 border-gold-600/50 hover:border-gold-400 text-gold-400
                         hover:text-gold-300 font-semibold px-8 py-3.5 rounded-full
                         text-lg transition-colors">
              Llamar ahora
            </a>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-3 mt-8 justify-center md:justify-start">
            {['🏆 Pollo Fresco', '💳 Tarjetas', '🔥 3 sabores', '😋 Siempre fresco'].map(b => (
              <span key={b}
                className="bg-white/5 border border-white/10 text-gray-300
                           text-xs px-3 py-1.5 rounded-full">
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* Logo / Image */}
        <div className="flex-shrink-0 text-center">
          <div className="relative inline-block">
            <div className="w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden
                            ring-4 ring-gold-500/60 shadow-2xl shadow-gold-500/20 bg-brand-800">
              <img
                src="/fotos/logo.jpeg"
                alt="El Pollito Gus"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&q=80';
                }}
              />
            </div>
            {/* Gold ring decoration */}
            <div className="absolute -inset-2 rounded-full border-2 border-gold-500/20 pointer-events-none" />
            <div className="absolute -bottom-3 -right-3 gold-gradient text-brand-900
                            font-black text-sm px-4 py-2 rounded-full shadow-lg rotate-6">
              ¡Pide ya!
            </div>
          </div>
        </div>
      </div>

      {/* Wave transition */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="w-full h-8 fill-gray-50">
          <path d="M0,40 C300,0 900,0 1200,40 L1200,40 L0,40 Z" />
        </svg>
      </div>
    </section>
  );
}
