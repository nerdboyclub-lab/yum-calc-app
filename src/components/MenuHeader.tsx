import coffeeHero from "@/assets/coffee-hero.jpg";

const MenuHeader = () => {
  return (
    <header className="relative overflow-hidden">
      {/* Hero image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={coffeeHero}
          alt="Gentlemen Coffee"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-espresso/60 via-espresso/30 to-background" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-card/90 backdrop-blur-sm flex items-center justify-center mb-2 shadow-lg border border-gold/30">
            <span className="text-2xl">☕</span>
          </div>
          <h1 className="text-2xl font-bold text-cream tracking-wide">
            To4kavcentre
          </h1>
          <p className="text-gold-light text-xs font-body tracking-[0.2em] uppercase mt-1">
            Premium Coffee House
          </p>
        </div>
      </div>

      {/* Info bar */}
      <div className="px-5 py-3 flex items-center gap-2 text-muted-foreground text-xs">
        <svg className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>Фергана, Узбекистан</span>
      </div>
    </header>
  );
};

export default MenuHeader;
