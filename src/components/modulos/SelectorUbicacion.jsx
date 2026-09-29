// import React from 'react';
import { MapPin, ChevronDown, Anchor } from 'lucide-react';
import { PUERTOS_YUCATAN } from '../../data/ports';

/**
 * Selector de Ubicación premium:
 * - Mobile-First con scroll horizontal suave.
 * - Menú desplegable accesible (<select>) para pantallas compactas.
 * - Píldoras interactivas con estados activos destacados.
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
    <section className="bg-white rounded-2xl p-5 shadow-lg border border-slate-200 mb-8">
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 shadow-inner">
            <Anchor className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">
              Puntos de Pesca & Puertos
            </h2>
            <p className="text-xs text-slate-500">
              Costa de Yucatán (13 puntos)
            </p>
          </div>
        </div>

        {ubicacionActual && (
          <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 shadow-sm">
            <MapPin className="w-3 h-3" />
            {ubicacionActual.lat}° N, {Math.abs(Number(ubicacionActual.lon))}° O
          </span>
        )}
      </div>

      {/* Menú desplegable para móviles */}
      <div className="relative mb-4 block sm:hidden">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-emerald-600">
          <MapPin className="w-4 h-4" />
        </div>
        <select
          value={puertoActivoId}
          onChange={(e) => handleSeleccionar(e.target.value)}
          aria-label="Selecciona un puerto de pesca"
          className="w-full min-h-[48px] pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all shadow-sm"
        >
          {PUERTOS_YUCATAN.map((puerto) => (
            <option key={puerto.id} value={puerto.id}>
              {puerto.nombre} • {puerto.tipo}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {/* Píldoras scrollables */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {PUERTOS_YUCATAN.map((puerto) => {
          const esActivo = puerto.id === puertoActivoId;
          return (
            <button
              key={puerto.id}
              onClick={() => handleSeleccionar(puerto.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-2 shrink-0 active:scale-95 ${
                esActivo
                  ? 'bg-emerald-600 text-white shadow-md ring-1 ring-emerald-700 scale-105'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <MapPin
                className={`w-4 h-4 ${
                  esActivo ? 'text-yellow-300' : 'text-emerald-600'
                }`}
              />
              {puerto.nombre}
            </button>
          );
        })}
      </div>

      {/* Detalle del puerto seleccionado */}
      {ubicacionActual && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm text-slate-600">
          <div className="flex items-center gap-2 min-w-0">
            {ubicacionActual.tipo && (
              <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md shrink-0 uppercase text-xs">
                {ubicacionActual.tipo}
              </span>
            )}
            <span className="italic truncate">{ubicacionActual.descripcion}</span>
          </div>
          <span className="font-semibold text-emerald-700 shrink-0">
            {ubicacionActual.lat}° N, {Math.abs(Number(ubicacionActual.lon))}° O
          </span>
        </div>
      )}
    </section>
  );
};

export default SelectorUbicacion;
