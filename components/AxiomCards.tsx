
import React from 'react';
import { Axiom } from '../types';

interface AxiomCardsProps {
  axioms: Axiom[];
  variant?: 'fullscreen' | 'embedded';
}

export const AxiomCards: React.FC<AxiomCardsProps> = ({ axioms, variant = 'embedded' }) => {
  if (axioms.length === 0) return null;

  const containerClasses = variant === 'fullscreen'
    ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-10 w-full perspective-2000"
    : "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 md:gap-4 perspective-1000 opacity-40 hover:opacity-100 transition-all duration-700";

  const cardHeight = variant === 'fullscreen' ? "h-36 sm:h-56 md:h-72" : "h-24 md:h-36";

  return (
    <div className={containerClasses}>
      {axioms.map((item, idx) => (
        <div key={idx} className={`group ${cardHeight} relative transition-all duration-500 hover:scale-[1.08]`}>
          <div className="w-full h-full card-inner cursor-pointer shadow-2xl rounded-2xl">
            {/* Front Side */}
            <div className="absolute inset-0 backface-hidden glass-dark rounded-2xl p-3 md:p-6 flex flex-col items-center justify-center text-center border-t border-white/5 overflow-hidden">
              <span className="text-indigo-500/40 text-[6px] md:text-[8px] font-black tracking-[0.4em] uppercase mb-1 md:mb-4">AXIOM {idx + 1}</span>
              <h3 className="academic-serif text-[10px] md:text-[18px] font-black text-white leading-tight uppercase px-1 line-clamp-4">
                {item.axiom}
              </h3>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
            </div>
            
            {/* Back Side */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-indigo-950/40 backdrop-blur-3xl rounded-2xl p-3 md:p-8 flex flex-col items-center justify-center text-center border border-indigo-500/20 overflow-hidden shadow-inner shadow-indigo-500/10">
              <div className="w-full h-full overflow-y-auto custom-scrollbar flex items-center justify-center">
                <p className="italic text-[9px] md:text-[14px] text-indigo-100/90 leading-snug md:leading-relaxed font-medium px-1 academic-serif">
                  {item.definition}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
