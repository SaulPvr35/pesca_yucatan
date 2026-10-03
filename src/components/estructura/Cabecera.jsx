import { Anchor, Navigation, ShieldCheck, Fish, Compass } from 'lucide-react';

export const Cabecera = ({ pestanaActiva = 'pronostico', onCambiarPestana }) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 text-white shadow-md backdrop-blur-md border-b border-slate-800">
      <div className="container mx-auto flex justify-between items-center py-3.5 px-4 sm:px-6">
        <div 
          onClick={() => onCambiarPestana && onCambiarPestana('pronostico')}
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
            <Anchor className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-base sm:text-lg tracking-tight block leading-tight">Pesca Yucatán</span>
            <span className="text-[10px] text-slate-400 font-medium block">Monitoreo Marino y Solunar</span>
          </div>
        </div>

        {/* Selector de Pestañas Principales */}
        <div className="flex items-center gap-1.5 sm:gap-3 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
          <button
            onClick={() => onCambiarPestana && onCambiarPestana('pronostico')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              pestanaActiva === 'pronostico'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Pronóstico Marino</span>
          </button>

          <button
            onClick={() => onCambiarPestana && onCambiarPestana('peces')}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              pestanaActiva === 'peces'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Fish className="w-3.5 h-3.5" />
            <span>Peces de Yucatán</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Cabecera;