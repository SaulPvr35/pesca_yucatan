import { useState } from 'react';
import { Calendar, Compass, Waves, Wind, Moon, CheckCircle, AlertCircle, ShieldAlert, Sparkles, Navigation } from 'lucide-react';
import { evaluarPronosticoSemanal } from '../../utilidades/motorCondiciones';
import { obtenerDatosLunares } from '../../utilidades/astronomia';

/**
 * Módulo de Planificación de Pesca (Próximos 7 días)
 * Reutiliza las 168 horas ya consultadas de Open-Meteo sin generar ninguna petición de red adicional.
 */
export const PlanificadorSemanal = ({ datosClima, ubicacionSeleccionada }) => {
  const [diaSeleccionadoIdx, setDiaSeleccionadoIdx] = useState(0);

  if (!datosClima?.hourly?.time) {
    return null;
  }

  const pronosticoSemanal = evaluarPronosticoSemanal(datosClima, obtenerDatosLunares);

  if (!pronosticoSemanal || pronosticoSemanal.length === 0) {
    return null;
  }

  const diaActual = pronosticoSemanal[diaSeleccionadoIdx] || pronosticoSemanal[0];
  const nombrePuerto = ubicacionSeleccionada?.nombre || ubicacionSeleccionada?.name || 'la costa';

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-sm border border-slate-200/90 relative overflow-hidden space-y-6">
      {/* Detalle superior sutil */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-900 via-primary to-emerald-500" />

      {/* Encabezado formal */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 shrink-0">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Planificación Semanal de Salidas
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Pronóstico de viabilidad para {nombrePuerto} (horizonte de 7 días continuos)
            </p>
          </div>
        </div>

        <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 self-start sm:self-auto">
          Actualización sincronizada
        </span>
      </div>

      {/* Selector Horizontal de Días (7 columnas en desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {pronosticoSemanal.map((dia, idx) => {
          const esActivo = idx === diaSeleccionadoIdx;
          const esExcelente = dia.puntaje >= 75;
          const esRegular = dia.puntaje >= 50 && dia.puntaje < 75;

          return (
            <button
              key={dia.fechaIso}
              onClick={() => setDiaSeleccionadoIdx(idx)}
              className={`p-3.5 rounded-xl border text-left transition-all duration-200 relative flex flex-col justify-between cursor-pointer select-none ${
                esActivo
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-primary/40'
                  : 'bg-slate-50 hover:bg-slate-100/90 border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <span className={`text-[11px] font-bold uppercase tracking-wider ${esActivo ? 'text-slate-300' : 'text-slate-500'}`}>
                    {dia.esHoy ? 'Hoy' : dia.diaSemana.slice(0, 3)}
                  </span>
                  <span className={`text-xs font-bold tabular-nums ${
                    esActivo
                      ? 'text-white'
                      : esExcelente
                      ? 'text-emerald-700 font-extrabold'
                      : esRegular
                      ? 'text-amber-700 font-extrabold'
                      : 'text-slate-600'
                  }`}>
                    {dia.puntaje}%
                  </span>
                </div>

                <div className={`text-lg font-black tracking-tight leading-none mb-2.5 ${esActivo ? 'text-white' : 'text-slate-900'}`}>
                  {dia.diaNumero}
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-200/50 text-[11px]">
                <div className="flex items-center justify-between text-slate-500">
                  <span className={`inline-flex items-center gap-1 font-semibold ${esActivo ? 'text-slate-200' : 'text-slate-600'}`}>
                    <Waves className="w-3 h-3 text-sky-500" /> {dia.olaPromedio} m
                  </span>
                  <span className={`inline-flex items-center gap-1 font-semibold ${esActivo ? 'text-slate-200' : 'text-slate-600'}`}>
                    <Wind className="w-3 h-3 text-teal-500" /> {dia.vientoMax} km/h
                  </span>
                </div>
                <div className={`truncate font-medium flex items-center gap-1 ${esActivo ? 'text-slate-300' : 'text-slate-500'}`}>
                  <Moon className="w-3 h-3 shrink-0 text-indigo-400" />
                  <span className="truncate">{dia.lunaFase.replace('Luna ', '').replace(' (Cóncava)', '')}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detalle y Veredicto del Día Seleccionado */}
      <div className="rounded-xl border border-slate-200/90 bg-slate-50/80 p-4 sm:p-6 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-900 text-white">
                {diaActual.etiquetaDia} {diaActual.esHoy ? '(Hoy)' : ''}
              </span>
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold border ${
                diaActual.puntaje >= 75
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold'
                  : diaActual.puntaje >= 50
                  ? 'bg-amber-50 text-amber-800 border-amber-200 font-bold'
                  : 'bg-white text-slate-800 border-slate-200 font-bold'
              }`}>
                Veredicto: {diaActual.estado} ({diaActual.puntaje} / 100)
              </span>
            </div>
            <h4 className="text-xl font-black text-slate-900 tracking-tight">
              {diaActual.tituloVeredicto}
            </h4>
          </div>

          <div className="grid grid-cols-3 gap-2.5 w-full md:w-auto">
            <div className="px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-center shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Fase Lunar</span>
              <span className="text-xs font-bold text-slate-800">{diaActual.lunaFase}</span>
            </div>
            <div className="px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-center shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Oleaje Medio</span>
              <span className="text-xs font-bold text-slate-800">{diaActual.olaPromedio} m</span>
            </div>
            <div className="px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-center shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Viento Máximo</span>
              <span className="text-xs font-bold text-slate-800">{diaActual.vientoMax} km/h</span>
            </div>
          </div>
        </div>

        {/* Recomendación y Diagnóstico de Planificación */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-slate-700">
            <Navigation className="w-4 h-4 text-primary shrink-0" />
            <span>
              <strong className="text-slate-900">Estrategia recomendada:</strong> {diaActual.recomendacionCorta}
            </span>
          </div>

          {diaActual.alertas && diaActual.alertas.length > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-100 text-amber-950 border border-amber-200 text-xs font-bold">
              <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>{diaActual.alertas[0].titulo}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanificadorSemanal;
