import { MoonStar, Sparkles, Activity } from 'lucide-react';
import { usarFaseLunar } from '../../hooks/usarFaseLunar';
import { Tarjeta } from '../ui/Tarjeta';
import { Etiqueta } from '../ui/Etiqueta';

/**
 * Componente TarjetaFaseLunar: Indicador Solunar de probabilidad de actividad biológica
 * de los peces según los ciclos gravitacionales y lumínicos de la Luna.
 *
 * Diseño horizontal responsivo (Mobile-First) en dos columnas:
 * - Columna Izquierda: Representación visual, nombre de la fase e iluminación.
 * - Columna Derecha: Probabilidad de captura con tipografía audaz, medidor de progreso y badge dinámico.
 */
export const TarjetaFaseLunar = () => {
  const datosLuna = usarFaseLunar();

  if (!datosLuna) {
    return (
      <Tarjeta className="mb-6 p-6 animate-pulse">
        <div className="h-5 w-32 bg-slate-200 rounded mb-3" />
        <div className="h-10 w-full bg-slate-100 rounded-xl" />
      </Tarjeta>
    );
  }

  const { fase, porcentajeActividad, iluminacion } = datosLuna;
  const esActividadAlta = porcentajeActividad > 80;
  const esActividadBaja = porcentajeActividad < 60;

  // Lógica de etiqueta semántica
  const textoEtiqueta = esActividadAlta
    ? 'Actividad Alta'
    : esActividadBaja
    ? 'Actividad Baja'
    : 'Actividad Moderada';

  // Respetando el color acento 'Sand' (#F5E9D0) y paleta de diseño
  const colorEtiqueta = esActividadAlta
    ? 'bg-accent text-amber-950 border-amber-300/80 shadow-2xs font-bold'
    : esActividadBaja
    ? 'bg-slate-100 text-slate-600 border-slate-200'
    : 'bg-secondary text-primary border-secondary/80';

  const colorBarra = esActividadAlta
    ? 'bg-amber-500'
    : esActividadBaja
    ? 'bg-slate-400'
    : 'bg-primary';

  return (
    <Tarjeta className="mb-6 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
        {/* Columna Izquierda: Representación Lunar */}
        <div className="p-4 sm:p-5 flex items-center gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-secondary/60 text-primary flex items-center justify-center shrink-0 shadow-inner ring-1 ring-primary/10">
            <MoonStar className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-2xs font-bold uppercase tracking-wider text-primary mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Teoría Solunar</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-text tracking-tight truncate">
              {fase}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Iluminación visible: <span className="font-bold text-slate-700">{iluminacion}%</span>
            </p>
          </div>
        </div>

        {/* Columna Derecha: Probabilidad de Actividad y Barra Medidora */}
        <div className="p-4 sm:p-5 flex flex-col justify-center">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
              <Activity className="w-4 h-4 text-primary" />
              <span>Pique y Actividad</span>
            </div>
            <Etiqueta color={colorEtiqueta}>
              {textoEtiqueta}
            </Etiqueta>
          </div>

          {/* Valor Numérico Grande y Audaz */}
          <div className="flex items-baseline gap-1.5 mb-2.5">
            <span className="text-3xl sm:text-4xl font-black text-text tracking-tight">
              {porcentajeActividad}%
            </span>
            <span className="text-xs font-semibold text-slate-400">
              probabilidad de captura
            </span>
          </div>

          {/* Barra de progreso medidor */}
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/50">
            <div
              className={`h-full rounded-full transition-all duration-700 ${colorBarra}`}
              style={{ width: `${porcentajeActividad}%` }}
              role="progressbar"
              aria-valuenow={porcentajeActividad}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>
      </div>
    </Tarjeta>
  );
};

export default TarjetaFaseLunar;
