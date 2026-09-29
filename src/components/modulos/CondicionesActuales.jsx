import {
  Fish,
  AlertTriangle,
  Anchor,
  Waves,
  Compass,
  Timer,
  Info,
} from 'lucide-react';
import { usarClima } from '../../hooks/usarClima';
import { evaluarCondiciones } from '../../utilidades/motorCondiciones';
import { obtenerDatosLunares } from '../../utilidades/astronomia';
import { Tarjeta } from '../ui/Tarjeta';
import { Cargador } from '../ui/Cargador';

/**
 * Convierte grados angulares a rumbo cardinal náutico tradicional.
 *
 * @param {number|undefined|null} grados - Dirección en grados (0 a 360).
 * @returns {string} Siglas del rumbo (ej. N, NE, ESE, etc.).
 */
const calcularRumboCardinal = (grados) => {
  if (typeof grados !== 'number' || isNaN(grados)) return '--';
  const rumbos = [
    'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
    'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO',
  ];
  const indice = Math.round(grados / 22.5) % 16;
  return rumbos[indice];
};

/**
 * Renderiza el icono temático protagónico según el veredicto del semáforo.
 *
 * @param {'favorable' | 'variable' | 'precaucion'} tipoIcono
 */
const renderizarIconoVeredicto = (tipoIcono) => {
  switch (tipoIcono) {
    case 'favorable':
      return <Fish className="w-9 h-9 sm:w-11 sm:h-11" />;
    case 'variable':
      return <Anchor className="w-9 h-9 sm:w-11 sm:h-11" />;
    case 'precaucion':
    default:
      return <AlertTriangle className="w-9 h-9 sm:w-11 sm:h-11" />;
  }
};

/**
 * Componente Semáforo de Pesca: Diagnóstico visual prominente enfocado en la seguridad
 * y viabilidad de la jornada de pesca, respaldado por métricas marinas secundarias.
 *
 * @param {Object} props
 * @param {Object} [props.ubicacionSeleccionada] - Objeto con coordenadas { lat, lon, nombre?, name? }.
 */
export const CondicionesActuales = ({ ubicacionSeleccionada }) => {
  const { datos, cargando, error } = usarClima(ubicacionSeleccionada);

  // 1. Estado de Carga
  if (cargando) {
    return (
      <Tarjeta className="mb-6">
        <div className="flex flex-col items-center justify-center py-14 text-center">
          <Cargador tamanio="lg" texto="Sondeando condiciones marinas para pescar..." />
          <p className="text-xs text-slate-500 mt-2.5">
            Analizando oleaje y emitiendo el veredicto náutico...
          </p>
        </div>
      </Tarjeta>
    );
  }

  // 2. Estado de Error
  if (error) {
    return (
      <Tarjeta className="mb-6 border-l-4 border-l-rose-500 bg-rose-50/40">
        <div className="flex items-start gap-3.5">
          <div className="p-2 rounded-lg bg-rose-100 text-rose-600 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-rose-900 text-base">
              No fue posible conectar con el pronóstico marino
            </h3>
            <p className="text-sm text-rose-700 mt-1">
              {error || 'Falla temporal al conectar con la estación meteorológica.'}
            </p>
            <p className="text-xs text-rose-500 mt-2">
              Verifica tu conexión a internet o cambia de puerto en el selector.
            </p>
          </div>
        </div>
      </Tarjeta>
    );
  }

  // 3. Estado sin ubicación seleccionada
  if (!ubicacionSeleccionada || ubicacionSeleccionada.lat == null || ubicacionSeleccionada.lon == null) {
    return (
      <Tarjeta className="mb-6 text-center py-8">
        <div className="inline-flex p-3 rounded-full bg-secondary/50 text-primary mb-3">
          <Info className="w-6 h-6" />
        </div>
        <h3 className="font-semibold text-text text-base">Selecciona un punto de pesca</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
          Elige un puerto en el selector superior para conocer el veredicto del semáforo.
        </p>
      </Tarjeta>
    );
  }

  // 4. Si aún no hay datos disponibles
  if (!datos) {
    return null;
  }

  // Extracción de la hora actual en el array horario de Open-Meteo
  let indiceActual = 0;
  if (datos.hourly?.time && Array.isArray(datos.hourly.time)) {
    const horaActualPrefijo = new Date().toISOString().slice(0, 13);
    const idxEncontrado = datos.hourly.time.findIndex(
      (t) => typeof t === 'string' && t.startsWith(horaActualPrefijo)
    );
    if (idxEncontrado !== -1) {
      indiceActual = idxEncontrado;
    }
  }

  const alturaOla = datos.hourly?.wave_height?.[indiceActual] ?? '--';
  const direccionOla = datos.hourly?.wave_direction?.[indiceActual] ?? '--';
  const periodoOla = datos.hourly?.wave_period?.[indiceActual] ?? '--';
  const rumboCardinal = typeof direccionOla === 'number' ? calcularRumboCardinal(direccionOla) : '';

  // Datos lunares para el sistema de puntuación ponderada
  const datosLuna = obtenerDatosLunares();

  // Evaluación mediante el motor de condiciones de pesca (Kill Switch + Puntaje)
  const evaluacion = evaluarCondiciones(datos, datosLuna);
  const nombrePuerto =
    ubicacionSeleccionada.nombre || ubicacionSeleccionada.name || 'Puerto';

  return (
    <Tarjeta className="mb-6 overflow-hidden">
      {/* 1. SECCIÓN HERO: EL VEREDICTO DE PESCA MANDA */}
      <div
        className={`p-5 sm:p-7 rounded-2xl border transition-all ${evaluacion.estiloHero.fondo}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
          {/* Gran Icono Náutico / Pescador */}
          <div
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ring-4 transition-transform active:scale-95 ${evaluacion.estiloHero.iconoBg}`}
          >
            {renderizarIconoVeredicto(evaluacion.tipoIcono)}
          </div>

          {/* Información del Veredicto en Tipografía Heroica */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase shadow-2xs ${evaluacion.estiloHero.badge}`}
              >
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                Semáforo {evaluacion.estado}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                • {nombrePuerto}
              </span>
            </div>

            {/* Título de impacto visual masivo */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight mb-2.5">
              {evaluacion.tituloVeredicto}
            </h2>

            {/* Copy en auténtico lenguaje de pescador */}
            <p className="text-sm sm:text-base font-medium leading-relaxed opacity-90 max-w-2xl">
              {evaluacion.mensaje}
            </p>

            {/* Píldora de modalidad de pesca sugerida */}
            {evaluacion.recomendacionCorta && (
              <div className="mt-3.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/80 border border-current/10 text-xs sm:text-sm font-bold shadow-2xs backdrop-blur-xs">
                <Anchor className="w-4 h-4 shrink-0 text-slate-600" />
                <span className="text-slate-700">
                  Actividad sugerida:{' '}
                  <span className="text-slate-900 font-extrabold">
                    {evaluacion.recomendacionCorta}
                  </span>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. DATOS SECUNDARIOS DEL MAR (SOPORTE TÉCNICO SUBORDINADO AL VEREDICTO) */}
      <div className="mt-6 pt-5 border-t border-slate-100">
        <div className="flex items-center justify-between mb-3 text-slate-400">
          <span className="text-2xs sm:text-xs font-bold uppercase tracking-wider text-slate-500">
            Métricas del Mar (Hora Actual)
          </span>
          <span className="text-2xs text-slate-400">
            Boyas y modelo marino
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Altura de Ola */}
          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/50 flex items-center justify-between sm:flex-col sm:items-start transition-colors hover:bg-slate-50">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <Waves className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold">Altura de Ola</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-700 tracking-tight">
                {alturaOla}
              </span>
              <span className="text-xs font-semibold text-slate-400">m</span>
            </div>
          </div>

          {/* Dirección de Ola */}
          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/50 flex items-center justify-between sm:flex-col sm:items-start transition-colors hover:bg-slate-50">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <Compass className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold">Dirección</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-slate-700 tracking-tight">
                {direccionOla !== '--' ? Math.round(Number(direccionOla)) : '--'}°
              </span>
              {rumboCardinal && (
                <span className="text-xs font-bold text-slate-600 bg-slate-200/70 px-1.5 py-0.5 rounded">
                  {rumboCardinal}
                </span>
              )}
            </div>
          </div>

          {/* Periodo de Ola */}
          <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/50 flex items-center justify-between sm:flex-col sm:items-start transition-colors hover:bg-slate-50">
            <div className="flex items-center gap-2 text-slate-500 mb-1">
              <Timer className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold">Periodo</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-700 tracking-tight">
                {periodoOla}
              </span>
              <span className="text-xs font-semibold text-slate-400">seg</span>
            </div>
          </div>
        </div>
      </div>
    </Tarjeta>
  );
};

export default CondicionesActuales;
