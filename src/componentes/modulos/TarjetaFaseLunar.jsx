import { MoonStar, Sparkles, Activity, ArrowUpRight, Compass } from 'lucide-react';
import { usarFaseLunar } from '../../hooks/usarFaseLunar';
import { Tarjeta } from '../ui/Tarjeta';
import { Etiqueta } from '../ui/Etiqueta';

/**
 * Componente TarjetaFaseLunar: Indicador Solunar avanzado con diseño premium,
 * efectos lumínicos dinámicos y microanimaciones de alta gama.
 */
export const TarjetaFaseLunar = () => {
  const datosLuna = usarFaseLunar();

  if (!datosLuna) {
    return (
      <Tarjeta className="mb-6 p-6 animate-pulse bg-gradient-to-br from-slate-50 to-slate-100/50">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-slate-200 rounded-2xl animate-pulse" />
          <div className="space-y-2 flex-1">
            <div className="h-4 w-28 bg-slate-200 rounded" />
            <div className="h-6 w-40 bg-slate-200 rounded-lg" />
          </div>
        </div>
      </Tarjeta>
    );
  }

  const { fase, porcentajeActividad, iluminacion } = datosLuna;
  const esActividadAlta = porcentajeActividad >= 80;
  const esActividadBaja = porcentajeActividad < 55;

  // Clases y colores con estética marina / espacial sutil
  const configVisual = esActividadAlta
    ? {
      badgeColor: 'bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 border-amber-300 shadow-sm font-black',
      barraColor: 'bg-gradient-to-r from-amber-400 to-emerald-500',
      glowAura: 'from-amber-500/10 via-transparent to-transparent',
      textoEstado: 'Actividad Óptima',
      iconoGlow: 'text-amber-500 bg-amber-50 ring-amber-200/60',
    }
    : esActividadBaja
      ? {
        badgeColor: 'bg-slate-100 text-slate-600 border-slate-200 font-bold',
        barraColor: 'bg-slate-400',
        glowAura: 'from-slate-500/5 via-transparent to-transparent',
        textoEstado: 'Actividad Moderada-Baja',
        iconoGlow: 'text-slate-500 bg-slate-100 ring-slate-200/60',
      }
      : {
        badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200/80 font-bold',
        barraColor: 'bg-gradient-to-r from-primary to-emerald-400',
        glowAura: 'from-primary/10 via-transparent to-transparent',
        textoEstado: 'Actividad Favorable',
        iconoGlow: 'text-primary bg-secondary/80 ring-primary/20',
      };

  return (
    <Tarjeta className="mb-6 overflow-hidden relative group hover:shadow-lg transition-all duration-300 border-slate-200/80">
      {/* Fondo ambiental lumínico dinámico */}
      <div className={`absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl ${configVisual.glowAura} rounded-full blur-2xl pointer-events-none transition-all duration-700 group-hover:scale-110`} />

      <div className="relative grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-100">

        {/* Columna Izquierda: Iconografía y Fase (7 columnas en md) */}
        <div className="p-4 sm:p-6 md:col-span-7 flex items-center gap-4 sm:gap-5">
          {/* Contenedor de la Luna con efectos tridimensionales y pulso sutil */}
          <div className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl ${configVisual.iconoGlow} flex items-center justify-center shrink-0 shadow-inner ring-1 transition-transform duration-500 group-hover:scale-105`}>
            <MoonStar className="w-8 h-8 sm:w-9 sm:h-9 transition-transform duration-700 group-hover:rotate-12" />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white shadow-sm flex items-center justify-center text-[10px] font-black text-primary border border-slate-100">
              🌙
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-2xs font-bold uppercase tracking-widest text-primary mb-1">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-500" />
              <span>Ciclo Solunar y Gravitacional</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-text tracking-tight truncate group-hover:text-primary transition-colors">
              {fase}
            </h3>

            <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block animate-ping" />
                Iluminación: <strong className="text-slate-700">{iluminacion}%</strong>
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-400 font-medium">Influencia en mareas vivas</span>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Métricas y Medidor con Animaciones (5 columnas en md) */}
        <div className="p-4 sm:p-6 md:col-span-5 flex flex-col justify-center bg-slate-50/40">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
              <Activity className="w-4 h-4 text-primary" />
              <span>Factor Biológico</span>
            </div>
            <Etiqueta color={configVisual.badgeColor}>
              {configVisual.textoEstado}
            </Etiqueta>
          </div>

          {/* Valor Numérico Destacado */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-3xl sm:text-4xl font-black text-text tracking-tight tabular-nums">
              {porcentajeActividad}%
            </span>
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-0.5">
              índice de actividad <ArrowUpRight className="w-3 h-3 text-emerald-500 inline" />
            </span>
          </div>

          {/* Barra de Progreso Avanzada con Sombra Interna */}
          <div className="w-full h-3 bg-slate-200/70 rounded-full overflow-hidden p-0.5 shadow-inner border border-slate-200/60">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out ${configVisual.barraColor}`}
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