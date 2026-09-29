import { MoonStar, Waves, Fish, Sparkles, ArrowUpRight } from 'lucide-react';
import { usarFaseLunar } from '../../hooks/usarFaseLunar';
import { Tarjeta } from '../ui/Tarjeta';
import { Etiqueta } from '../ui/Etiqueta';

export const TarjetaFaseLunar = () => {
  const datosLuna = usarFaseLunar();

  if (!datosLuna) {
    return (
      <Tarjeta className="mb-6 overflow-hidden border-cyan-900/10">
        <div className="animate-pulse">
          <div className="h-2 bg-slate-200" />
          <div className="p-5 sm:p-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 shrink-0 rounded-2xl bg-slate-200" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-32 rounded bg-slate-200" />
                <div className="h-6 w-44 rounded-lg bg-slate-200" />
                <div className="h-3 w-52 rounded bg-slate-200" />
              </div>
            </div>
            <div className="mt-6 h-3 rounded-full bg-slate-200" />
          </div>
        </div>
      </Tarjeta>
    );
  }

  const { fase, porcentajeActividad, iluminacion } = datosLuna;
  const actividad = Math.max(0, Math.min(100, porcentajeActividad));
  const esActividadAlta = actividad >= 80;
  const esActividadBaja = actividad < 55;

  // Textos y descripciones con sazón yucateca / costera
  const configVisual = esActividadAlta
    ? {
      estado: '¡Pique fuerte!',
      descripcion: 'Luna ideal para la corrida en la costa yucateca. Buen puerto para el mero y huachinango.',
      etiqueta: 'border-emerald-300 bg-emerald-50 text-emerald-900',
      barra: 'from-teal-500 via-emerald-400 to-green-500',
      icono: 'bg-emerald-50 text-emerald-700 ring-emerald-300',
      acento: 'text-emerald-700',
    }
    : esActividadBaja
      ? {
        estado: 'Marea baja / calma',
        descripcion: 'Actividad solunar baja en el banco. Ideal para buscar especies de ría o manglar.',
        etiqueta: 'border-amber-200 bg-amber-50 text-amber-800',
        barra: 'from-amber-400 to-orange-500',
        icono: 'bg-amber-50 text-amber-600 ring-amber-200',
        acento: 'text-amber-700',
      }
      : {
        estado: 'Mareas favorables',
        descripcion: 'Buenas condiciones en el litoral. Las mareas favorecen la pesca en la costa.',
        etiqueta: 'border-cyan-200 bg-cyan-50 text-cyan-900',
        barra: 'from-cyan-500 via-teal-400 to-emerald-400',
        icono: 'bg-cyan-50 text-cyan-700 ring-cyan-200',
        acento: 'text-cyan-800',
      };

  return (
    <Tarjeta className="group relative mb-6 overflow-hidden border-cyan-900/15 bg-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
      {/* Línea superior con colores inspirados en el mar de la península (Azul profundo a Verde esmeralda de la costa) */}
      <div className="relative h-2.5 overflow-hidden bg-gradient-to-r from-blue-950 via-cyan-700 to-emerald-500" />

      {/* Efectos de brillo de fondo sutiles */}
      <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-cyan-200/45 blur-3xl transition-transform duration-700 group-hover:scale-110" />
      <div className="pointer-events-none absolute -bottom-24 -left-20 h-52 w-52 rounded-full bg-emerald-100/40 blur-3xl" />

      <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_auto]">
        {/* Columna Principal: Fase y Datos Lunares */}
        <div className="p-5 sm:p-6 lg:p-7">
          <div className="flex items-start gap-4 sm:gap-5">
            <div className={`relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ring-1 shadow-sm transition-transform duration-500 group-hover:scale-105 sm:h-[72px] sm:w-[72px] ${configVisual.icono}`}>
              <MoonStar className="h-8 w-8 transition-transform duration-500 group-hover:rotate-6 sm:h-9 sm:w-9" />
              <div className="absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-white bg-cyan-600 text-white shadow-sm">
                <Waves className="h-3.5 w-3.5" />
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div className="mb-1.5 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-cyan-800 sm:text-xs">
                  Tablas Solunares • Litoral Yucateco
                </span>
              </div>

              <h3 className="truncate text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                {fase}
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                Influencia de la marea y la luna en el Golfo / Costa
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 sm:flex sm:items-center sm:gap-6">
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wide text-slate-400">
                Iluminación Lunar
              </span>
              <span className="mt-0.5 block text-sm font-extrabold text-slate-800">
                {iluminacion}%
              </span>
            </div>

            <div className="hidden h-8 w-px bg-slate-200 sm:block" />

            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wide text-slate-400">
                Zona de Pesca
              </span>
              <span className="mt-0.5 flex items-center gap-1.5 text-sm font-bold text-cyan-900">
                <Fish className="h-4 w-4 text-cyan-600" />
                Costa / Banco de Campeche
              </span>
            </div>
          </div>
        </div>

        {/* Columna Lateral: Índice de Actividad y Barra */}
        <div className="relative flex min-w-0 flex-col justify-center border-t border-slate-100 bg-slate-50/80 p-5 sm:p-6 lg:w-[340px] lg:border-l lg:border-t-0 lg:p-7">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Índice de Pique
              </p>

              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-4xl font-black tracking-tight text-slate-900 tabular-nums sm:text-5xl">
                  {actividad}
                </span>
                <span className="text-lg font-bold text-cyan-700">%</span>
              </div>
            </div>

            <Etiqueta color={`${configVisual.etiqueta} border px-3 py-1.5 text-[11px] font-black uppercase tracking-wide shadow-sm`}>
              {configVisual.estado}
            </Etiqueta>
          </div>

          <div className="mt-5">
            <div
              className="relative h-3.5 overflow-hidden rounded-full bg-slate-200/80 shadow-inner"
              role="progressbar"
              aria-label="Índice de actividad pesquera"
              aria-valuenow={actividad}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className={`h-full rounded-full bg-gradient-to-r ${configVisual.barra} shadow-sm transition-all duration-1000 ease-out`}
                style={{ width: `${actividad}%` }}
              />
            </div>

            <div className="mt-2 flex justify-between text-[10px] font-bold text-slate-400">
              <span>Bajo</span>
              <span>Moderado</span>
              <span>Alto</span>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-xl bg-white/70 p-2.5 border border-slate-200/60 shadow-xs">
            <ArrowUpRight className={`mt-0.5 h-4 w-4 shrink-0 ${configVisual.acento}`} />
            <p className="text-xs font-medium leading-relaxed text-slate-600">
              {configVisual.descripcion}
            </p>
          </div>
        </div>
      </div>
    </Tarjeta>
  );
};

export default TarjetaFaseLunar;