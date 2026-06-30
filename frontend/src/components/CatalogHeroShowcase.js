import React from 'react';

const CatalogHeroShowcase = () => {
  // Subtle inline wood grain SVG background
  const woodGrainSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><path d="M0,50 Q25,40 50,50 T100,50 M0,20 Q25,30 50,20 T100,20 M0,80 Q25,75 50,80 T100,80" fill="none" stroke="%23B08D57" stroke-width="0.5" opacity="0.12"/></svg>`;

  return (
    <div className="relative w-full flex flex-col items-center justify-center p-8 rounded-[24px] border border-borderSubtle bg-white dark:bg-dark-light overflow-hidden shadow-xl min-h-[460px] md:min-h-[500px]">
      
      {/* Wood grain micro texture background overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{ backgroundImage: `url('${woodGrainSvg}')`, backgroundSize: '180px 180px' }}
      />
      
      {/* Ambient soft gold radial background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full bg-primary/10 blur-[80px] pointer-events-none" />

      {/* Product Display Port with a real photograph of premium Teak sofa */}
      <div className="w-full flex items-center justify-center relative z-10 select-none pb-4">
        <img 
          src="/images/sofa-teak.png" 
          alt="Premium Solid Teakwood (Sagwan) Handcrafted Sofa" 
          className="w-auto h-[240px] md:h-[260px] object-contain drop-shadow-[0_25px_40px_rgba(43,38,33,0.18)] hover:scale-102 transition-transform duration-500"
          loading="lazy"
        />
      </div>

      {/* Luxury Statistics Banner */}
      <div className="relative z-10 w-full border-t border-borderSubtle/60 pt-8 grid grid-cols-2 gap-y-4 gap-x-4 text-center">
        <div>
          <div className="font-serif text-lg md:text-xl font-bold text-primary">25+ Years</div>
          <div className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-[#5B5048] dark:text-gray-400">Of Craftsmanship</div>
        </div>
        <div>
          <div className="font-serif text-lg md:text-xl font-bold text-primary">500+</div>
          <div className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-[#5B5048] dark:text-gray-400">Custom Projects</div>
        </div>
        <div>
          <div className="font-serif text-lg md:text-xl font-bold text-primary">100%</div>
          <div className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-[#5B5048] dark:text-gray-400">Sagwan Wood</div>
        </div>
        <div>
          <div className="font-serif text-lg md:text-xl font-bold text-primary">Mumbai</div>
          <div className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-[#5B5048] dark:text-gray-400">Since 1999</div>
        </div>
      </div>

    </div>
  );
};

export default CatalogHeroShowcase;
