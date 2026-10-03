import { useRef, useEffect } from 'react';
import { MapPin, ChevronDown, Anchor, Compass } from 'lucide-react';
import { PUERTOS_YUCATAN } from '../../data/ports';

/**
 * Componente Selector de Ubicación con enfoque Mobile-First, scroll sincronizado
 * y diseño de alta gama para los puertos de la costa de Yucatán.
 */
export const SelectorUbicacion = ({ ubicacionActual, onCambiarUbicacion }) => {
  const puertoActivoId = ubicacionActual?.id || PUERTOS_YUCATAN[0]?.id;
  const scrollContainerRef = useRef(null);

  const handleSeleccionar = (idPuerto) => {
    const seleccionado = PUERTOS_YUCATAN.find((p) => p.id === idPuerto);
    if (seleccionado && onCambiarUbicacion) {
      onCambiarUbicacion(seleccionado);
    }
  };

  // Efecto para centrar automáticamente la píldora activa en el scroll horizontal
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeElement = scrollContainerRef.current.querySelector(`[data-port-id="${puertoActivoId}"]`);
      if (activeElement) {
        const containerWidth = scrollContainerRef.current.offsetWidth;
        const elementLeft = activeElement.offsetLeft;
        const elementWidth = activeElement.offsetWidth;

        scrollContainerRef.current.scrollTo({
          left: elementLeft - containerWidth / 2 + elementWidth / 2,
          behavior: 'smooth'
        });
      }
    }
  }, [puertoActivoId]);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200/80 mb-6 relative overflow-hidden">
      {/* Detalle decorativo superior sutil */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/40 via-primary to-emerald-400" />

      {/* Encabezado del selector */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/80 text-primary flex items-center justify-center shrink-0 shadow-inner ring-1 ring-primary/10">
            <Anchor className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-text tracking-tight leading-tight">
              Puntos de Pesca & Puertos
            </h2>
            <p className="text-2xs sm:text-xs text-slate-500 font-medium">
              Costa de Yucatán (13 puntos de Poniente a Oriente)
            </p>
          </div>
        </div>

        {ubicacionActual && (
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-secondary/60 px-3 py-1 rounded-full border border-primary/10 shadow-2xs">
            <Compass className="w-3.5 h-3.5 animate-spin-slow text-primary" />
            {ubicacionActual.lat}° N, {Math.abs(Number(ubicacionActual.lon))}° O
          </span>
        )}
      </div>

      {/* Menú desplegable nativo estilizado para pantallas compactas */}
      <div className="relative mb-3.5 block sm:hidden">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-primary">
          <MapPin className="w-4 h-4" />
        </div>
        <select
          value={puertoActivoId}
          onChange={(e) => handleSeleccionar(e.target.value)}
          aria-label="Selecciona un puerto de pesca"
          className="w-full min-h-[48px] pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-text font-bold text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all shadow-2xs"
        >
          {PUERTOS_YUCATAN.map((puerto) => (
            <option key={puerto.id} value={puerto.id} className="py-1 font-medium">
              {puerto.nombre} • {puerto.tipo}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {/* Grupo de Píldoras / Pestañas táctiles (Scroll horizontal inteligente) */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          role="tablist"
          aria-label="Puertos disponibles"
          className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth touch-pan-x"
        >
          {PUERTOS_YUCATAN.map((puerto) => {
            const esActivo = puerto.id === puertoActivoId;

            return (
              <button
                key={puerto.id}
                data-port-id={puerto.id}
                role="tab"
                type="button"
                aria-selected={esActivo}
                onClick={() => handleSeleccionar(puerto.id)}
                className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-wide whitespace-nowrap transition-all duration-200 cursor-pointer select-none flex items-center gap-2 shrink-0 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary ${esActivo
                    ? 'bg-primary text-white shadow-md ring-1 ring-primary/80 scale-[1.02]'
                    : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/70 border border-slate-200/60 hover:text-slate-900'
                  }`}
              >
                <MapPin
                  className={`w-3.5 h-3.5 shrink-0 transition-colors ${esActivo ? 'text-accent' : 'text-slate-400'
                    }`}
                />
                <span>{puerto.nombre}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tarjeta de descripción y metadatos del puerto activo */}
      {ubicacionActual && (
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 bg-slate-50/60 p-3 rounded-xl border border-slate-200/40">
          <div className="flex items-center gap-2.5 min-w-0">
            {ubicacionActual.tipo && (
              <span className="font-extrabold text-primary bg-secondary px-2.5 py-1 rounded-lg shrink-0 uppercase tracking-wider text-[10px] ring-1 ring-primary/10">
                {ubicacionActual.tipo}
              </span>
            )}
            <span className="text-slate-600 font-medium truncate">
              {ubicacionActual.descripcion}
            </span>
          </div>
          <span className="font-bold text-slate-400 shrink-0 text-right sm:text-left">
            {ubicacionActual.lat}° N, {Math.abs(Number(ubicacionActual.lon))}° O
          </span>
        </div>
      )}
    </div>
  );
};

export default SelectorUbicacion;