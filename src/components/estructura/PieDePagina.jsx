import { useState, useEffect } from 'react';
import { Anchor, ShieldAlert, X, ExternalLink, Info } from 'lucide-react';

export const PieDePagina = () => {
  const [modalAbierto, setModalAbierto] = useState(false);

  // Cerrar modal al presionar la tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setModalAbierto(false);
    };
    if (modalAbierto) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalAbierto]);

  return (
    <>
      {/* Footer consistente con Cabecera.jsx y el sistema visual */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-900/90 backdrop-blur-md text-slate-400 py-4 relative z-20">
        <div className="max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          
          {/* Marca / Identidad */}
          <div className="flex items-center gap-2 text-white font-bold tracking-tight">
            <div className="w-6 h-6 rounded-lg bg-emerald-600/90 flex items-center justify-center text-white shrink-0 shadow-xs">
              <Anchor className="w-3.5 h-3.5" />
            </div>
            <span>Pesca Yucatán</span>
            <span className="text-slate-600 font-normal">|</span>
            <span className="text-slate-400 text-[11px] font-medium">Litoral Yucateco</span>
          </div>

          {/* Atribución y botón de modal */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
            <span>
              Fuentes:{' '}
              <a
                href="https://open-meteo.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-emerald-400 underline transition-colors"
              >
                Open-Meteo
              </a>{' '}
              y{' '}
              <a
                href="https://enciclovida.mx/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-emerald-400 underline transition-colors"
              >
                Enciclovida
              </a>
            </span>

            <span className="text-slate-600">•</span>

            <button
              onClick={() => setModalAbierto(true)}
              className="text-slate-300 hover:text-white font-medium underline transition-colors cursor-pointer flex items-center gap-1"
            >
              <Info className="w-3 h-3 text-emerald-400" />
              <span>Aviso legal y datos</span>
            </button>
          </div>

          {/* Copyright */}
          <div className="text-[11px] text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} Pesca Yucatán
          </div>
        </div>
      </footer>

      {/* Modal accesible que se cierra al hacer clic en el backdrop exterior */}
      {modalAbierto && (
        <div 
          onClick={() => setModalAbierto(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
        >
          {/* Contenedor del Modal constopPropagation para no cerrarse al hacer clic adentro */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 text-slate-200 rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-800 space-y-4 relative"
          >
            <button
              onClick={() => setModalAbierto(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Cerrar modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 text-white font-bold text-base">
              <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <Info className="w-4.5 h-4.5" />
              </div>
              <h3>Fuentes de Datos &amp; Deslinde Legal</h3>
            </div>

            <div className="space-y-3 text-xs leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
              <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1">
                <strong className="text-white block font-semibold">
                  Modelos Meteorológicos y Biológicos:
                </strong>
                <p className="text-slate-300 text-[11px]">
                  Variables de viento, oleaje, corrientes y presión atmosférica provienen de modelos globales abiertos de{' '}
                  <strong className="text-slate-100">Open-Meteo</strong> (GFS, ECMWF, Copernicus Marine). Catálogo biológico conectado con{' '}
                  <strong className="text-slate-100">Enciclovida (CONABIO)</strong> y normas de{' '}
                  <strong className="text-slate-100">INAPESCA</strong>.
                </p>
              </div>

              <div className="p-3.5 bg-amber-950/30 rounded-xl border border-amber-600/40 space-y-1 text-amber-200">
                <div className="flex items-center gap-1.5 font-bold text-amber-300">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                  <span>Deslinde de Responsabilidad Náutica:</span>
                </div>
                <p className="text-[11px] text-amber-100/90 leading-normal">
                  Esta plataforma es una herramienta informativa y de recreación pesquera. No reemplaza los boletines oficiales de Capitanía de Puerto, SEMAR ni Protección Civil de Yucatán. La seguridad de la embarcación y tripulación es responsabilidad exclusiva de cada capitán.
                </p>
              </div>
            </div>

            <button
              onClick={() => setModalAbierto(false)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-sm active:scale-98"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PieDePagina;