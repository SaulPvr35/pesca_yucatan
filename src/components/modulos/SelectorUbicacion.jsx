import { MapPin, ChevronDown, Anchor } from 'lucide-react';
import { PUERTOS_YUCATAN } from '../../data/ports';

/**
 * Componente Selector de Ubicación con enfoque Mobile-First y doble modalidad interactiva:
 * - Pestañas/Píldoras táctiles con scroll horizontal suave (acceso rápido con el pulgar en móviles).
 * - Menú desplegable nativo enriquecido (<select>) para accesibilidad completa y pantallas compactas.
 *
 * @param {Object} props
 * @param {import('../../data/ports').PuertoYucatan} [props.ubicacionActual] - Objeto del puerto activo.
 * @param {(puerto: import('../../data/ports').PuertoYucatan) => void} props.onCambiarUbicacion - Callback al seleccionar puerto.
 */
export const SelectorUbicacion = ({ ubicacionActual, onCambiarUbicacion }) => {
  const puertoActivoId = ubicacionActual?.id || PUERTOS_YUCATAN[0]?.id;

  const handleSeleccionar = (idPuerto) => {
    const seleccionado = PUERTOS_YUCATAN.find((p) => p.id === idPuerto);
    if (seleccionado && onCambiarUbicacion) {
      onCambiarUbicacion(seleccionado);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 mb-6">
      {/* Encabezado del selector */}
      <div className="flex items-center justify-between gap-2 mb-3.5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-secondary/60 text-primary">
            <Anchor className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-text leading-tight">
              Puntos de Pesca & Puertos
            </h2>
            <p className="text-2xs sm:text-xs text-slate-500">
              Costa de Yucatán (13 puntos de Poniente a Oriente)
            </p>
          </div>
        </div>

        {ubicacionActual && (
          <span className="hidden sm:inline-flex items-center gap-1 text-2xs font-semibold text-primary bg-secondary/50 px-2.5 py-1 rounded-full">
            <MapPin className="w-3 h-3" />
            {ubicacionActual.lat}° N, {Math.abs(Number(ubicacionActual.lon))}° O
          </span>
        )}
      </div>

      {/* Menú desplegable nativo estilizado (accesibilidad y selección rápida) */}
      <div className="relative mb-3 block sm:hidden">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-primary">
          <MapPin className="w-4 h-4" />
        </div>
        <select
          value={puertoActivoId}
          onChange={(e) => handleSeleccionar(e.target.value)}
          aria-label="Selecciona un puerto de pesca"
          className="w-full min-h-[48px] pl-10 pr-10 py-2.5 bg-background border border-slate-200 rounded-xl text-text font-semibold text-sm appearance-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all shadow-2xs"
        >
          {PUERTOS_YUCATAN.map((puerto) => (
            <option key={puerto.id} value={puerto.id} className="py-1">
              {puerto.nombre} • {puerto.tipo}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {/* Grupo de Píldoras / Pestañas táctiles (Mobile-First scrollable) */}
      <div className="relative">
        <div
          role="tablist"
          aria-label="Puertos disponibles"
          className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar scroll-smooth touch-pan-x"
        >
          {PUERTOS_YUCATAN.map((puerto) => {
            const esActivo = puerto.id === puertoActivoId;

            return (
              <button
                key={puerto.id}
                role="tab"
                type="button"
                aria-selected={esActivo}
                onClick={() => handleSeleccionar(puerto.id)}
                className={`min-h-[44px] px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap transition-all duration-200 cursor-pointer select-none flex items-center gap-1.5 shrink-0 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-primary ${
                  esActivo
                    ? 'bg-primary text-white shadow-sm ring-1 ring-primary/80'
                    : 'bg-secondary/40 text-text hover:bg-secondary/70 border border-secondary/80'
                }`}
              >
                <MapPin
                  className={`w-3.5 h-3.5 shrink-0 ${
                    esActivo ? 'text-accent' : 'text-primary'
                  }`}
                />
                <span>{puerto.nombre}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detalle o resumen del puerto seleccionado */}
      {ubicacionActual && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-2xs sm:text-xs text-slate-500">
          <div className="flex items-center gap-2 min-w-0">
            {ubicacionActual.tipo && (
              <span className="font-bold text-primary bg-secondary/80 px-2 py-0.5 rounded-md shrink-0">
                {ubicacionActual.tipo}
              </span>
            )}
            <span className="italic text-slate-600 line-clamp-1">
              {ubicacionActual.descripcion}
            </span>
          </div>
          <span className="font-semibold text-primary shrink-0 ml-auto">
            {ubicacionActual.lat}°, {ubicacionActual.lon}°
          </span>
        </div>
      )}
    </div>
  );
};

export default SelectorUbicacion;
