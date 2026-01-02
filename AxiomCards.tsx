
import React from 'react';
import { Axiom } from './types';

interface AxiomCardsProps {
  axioms: Axiom[];
  variant?: 'fullscreen' | 'embedded';
}

export const AxiomCards: React.FC<AxiomCardsProps> = ({ axioms, variant = 'embedded' }) => {
  if (!axioms || axioms.length === 0) return null;

  const containerClasses = variant === 'fullscreen'
    ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-8 w-full perspective-2000 py-10"
    : "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4 perspective-1000 opacity-90 hover:opacity-100 transition-all duration-700";

  const cardHeight = variant === 'fullscreen' ? "h-40 sm:h-56 md:h-72" : "h-28 md:h-40";

  return (
    <div className={containerClasses}>
      {axioms.map((item, idx) => (
        <div key={idx} className={`group ${cardHeight} relative transition-all duration-500 hover:scale-[1.05]`}>
          <div className="card-inner cursor-pointer shadow-2xl rounded-2xl">
            {/* Front Side */}
            <div className="absolute inset-0 backface-hidden glass-dark rounded-2xl p-4 md:p-6 flex flex-col items-center justify-center text-center border border-white/10 overflow-hidden bg-white/[0.03]">
              <span className="text-indigo-400/50 text-[7px] md:text-[10px] font-black tracking-[0.4em] uppercase mb-2 md:mb-4">AXIOM {idx + 1}</span>
              <h3 className="text-[10px] md:text-[16px] font-bold text-white leading-tight uppercase px-1 line-clamp-4 tracking-wide">
                {item.axiom}
              </h3>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>
            </div>
            
            {/* Back Side */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-indigo-900/40 backdrop-blur-3xl rounded-2xl p-4 md:p-8 flex flex-col items-center justify-center text-center border border-indigo-500/30 overflow-hidden shadow-inner shadow-indigo-500/20">
              <div className="w-full h-full overflow-y-auto custom-scrollbar flex items-center justify-center">
                <p className="italic text-[9px] md:text-[14px] text-indigo-50/90 leading-relaxed font-medium px-1">
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
