import { Moon, Waves, Fish, ArrowUpRight, Compass, Sparkles } from 'lucide-react';
import { usarFaseLunar } from '../../hooks/usarFaseLunar';
import { Tarjeta } from '../ui/Tarjeta';

export const TarjetaFaseLunar = () => {
  const datosLuna = usarFaseLunar();

  if (!datosLuna) {
    return (
      <Tarjeta className="overflow-hidden border-slate-200 bg-white">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-32 bg-slate-200 rounded" />
          <div className="h-10 w-full bg-slate-200 rounded-xl" />
          <div className="h-3 w-48 bg-slate-200 rounded" />
        </div>
      </Tarjeta>
    );
  }

  const { fase, porcentajeActividad, iluminacion } = datosLuna;
  const actividad = Math.max(0, Math.min(100, porcentajeActividad));
  const esActividadAlta = actividad >= 80;
  const esActividadBaja = actividad < 55;

  const configVisual = esActividadAlta
    ? {
        estado: 'Marea Viva • Alta Actividad',
        descripcion: 'Fase óptima para especies depredadoras costeras. Mayor corriente y renovación de agua.',
        badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        barra: 'bg-emerald-600',
        iconoBg: 'bg-emerald-100/70 text-emerald-800',
        valorColor: 'text-emerald-800',
      }
    : esActividadBaja
    ? {
        estado: 'Marea Muerta • En Cuadraturas',
        descripcion: 'Menor amplitud de marea. Se sugiere pesca en esteros, fondos de estructura o carnada viva.',
        badge: 'bg-slate-100 text-slate-700 border-slate-200',
        barra: 'bg-slate-500',
        iconoBg: 'bg-slate-100 text-slate-700',
        valorColor: 'text-slate-700',
      }
    : {
        estado: 'Marea Intermedia • Favorable',
        descripcion: 'Condiciones estándar de marea en el litoral. Productividad regular con técnica apropiada.',
        badge: 'bg-sky-50 text-sky-800 border-sky-200',
        barra: 'bg-sky-600',
        iconoBg: 'bg-sky-100/70 text-sky-800',
        valorColor: 'text-sky-800',
      };

  return (
    <Tarjeta className="border-slate-200/90 bg-white shadow-xs overflow-hidden">
      {/* Encabezado formal de la tarjeta */}
      <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl shrink-0 ${configVisual.iconoBg}`}>
            <Moon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight leading-tight">
              Astronomía y Solunar
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Golfo de México • Banco de Campeche
            </p>
          </div>
        </div>

        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase border ${configVisual.badge}`}>
          {iluminacion}% luz
        </span>
      </div>

      {/* Contenido principal: Fase y Valor Solunar */}
      <div className="py-4 space-y-4">
        <div className="flex items-baseline justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              Fase Lunar Actual
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {fase}
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
              Índice Solunar
            </span>
            <div className="flex items-baseline justify-end gap-1">
              <span className={`text-3xl font-black tracking-tight tabular-nums ${configVisual.valorColor}`}>
                {actividad}
              </span>
              <span className="text-xs font-bold text-slate-400">/ 100</span>
            </div>
          </div>
        </div>

        {/* Barra de progreso solunar */}
        <div className="space-y-1.5">
          <div
            className="w-full h-2 rounded-full bg-slate-100 overflow-hidden"
            role="progressbar"
            aria-valuenow={actividad}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out ${configVisual.barra}`}
              style={{ width: `${actividad}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400">
            <span>Reposo (0)</span>
            <span className="font-bold text-slate-600">{configVisual.estado}</span>
            <span>Pico (100)</span>
          </div>
        </div>

        {/* Diagnóstico náutico breve */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-600 leading-relaxed flex items-start gap-2">
          <ArrowUpRight className="w-4 h-4 shrink-0 text-slate-400 mt-0.5" />
          <span>{configVisual.descripcion}</span>
        </div>

        {/* Metadatos en dos bloques compactos */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
          <div className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-200/40">
            <div className="flex items-center gap-1.5 text-slate-500 mb-0.5">
              <Waves className="w-3.5 h-3.5 text-sky-600" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Marea</span>
            </div>
            <span className="text-xs font-bold text-slate-800">
              {esActividadAlta ? 'Régimen Vivo' : esActividadBaja ? 'Régimen Muerto' : 'Intermedia'}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50/70 border border-slate-200/40">
            <div className="flex items-center gap-1.5 text-slate-500 mb-0.5">
              <Fish className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Actividad</span>
            </div>
            <span className="text-xs font-bold text-slate-800">
              {actividad >= 75 ? 'Excelente' : actividad >= 50 ? 'Regular' : 'Baja'}
            </span>
          </div>
        </div>
      </div>
    </Tarjeta>
  );
};

export default TarjetaFaseLunar;