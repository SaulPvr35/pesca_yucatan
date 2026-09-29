import {
  Fish,
  AlertTriangle,
  Anchor,
  Waves,
  Compass,
  Timer,
  Info,
  Wind,
  Gauge,
  CheckCircle2,
  XCircle,
  TrendingUp,
  ShieldAlert,
  Moon,
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
 * Renderiza el icono temático protagónico según el veredicto del motor.
 *
 * @param {'favorable' | 'variable' | 'precaucion'} tipoIcono
 */
const renderizarIconoVeredicto = (tipoIcono) => {
  const size = 'w-10 h-10 sm:w-12 sm:h-12';
  switch (tipoIcono) {
    case 'favorable':
      return <Fish className={size} />;
    case 'variable':
      return <Anchor className={size} />;
    case 'precaucion':
    default:
      return <ShieldAlert className={size} />;
  }
};

/**
 * Indicador visual circular de puntaje con SVG animado.
 * @param {{ puntaje: number, color: string }} props
 */
const IndicadorPuntaje = ({ puntaje, color }) => {
  const radio = 44;
  const circunferencia = 2 * Math.PI * radio;
  const porcentaje = Math.max(0, Math.min(100, puntaje));
  const desplazamiento = circunferencia - (porcentaje / 100) * circunferencia;

  // Mapear color Tailwind a color SVG real
  const coloresSvg = {
    'bg-emerald-700': '#047857',
    'bg-green-500': '#22c55e',
    'bg-yellow-500': '#eab308',
    'bg-orange-500': '#f97316',
    'bg-red-600': '#dc2626',
  };
  const colorStroke = coloresSvg[color] || '#6b7280';

  return (
    <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        {/* Fondo del anillo */}
        <circle
          cx="50" cy="50" r={radio}
          fill="none"
          stroke="currentColor"
          strokeWidth="7"
          className="text-slate-200/60"
        />
        {/* Arco de progreso animado */}
        <circle
          cx="50" cy="50" r={radio}
          fill="none"
          stroke={colorStroke}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circunferencia}
          strokeDashoffset={desplazamiento}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Número central */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl sm:text-4xl font-black tracking-tighter text-slate-800 leading-none">
          {puntaje}
        </span>
        <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
          / 100
        </span>
      </div>
    </div>
  );
};

/**
 * Tarjeta individual de un factor clave del motor de condiciones.
 * @param {{ factor: import('../../utilidades/motorCondiciones').FactorEvaluacion }} props
 */
const TarjetaFactor = ({ factor }) => {
  const ratio = factor.maximo > 0 ? factor.puntos / factor.maximo : 0;
  const esBueno = ratio >= 0.55;
  const porcentajeBarra = Math.round(ratio * 100);

  return (
    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-slate-100 shadow-xs hover:shadow-sm transition-all duration-200">
      {/* Icono estado (check verde / X roja) */}
      <div className={`shrink-0 mt-0.5 ${esBueno ? 'text-emerald-500' : 'text-rose-400'}`}>
        {esBueno
          ? <CheckCircle2 className="w-5 h-5" />
          : <XCircle className="w-5 h-5" />
        }
      </div>

      {/* Contenido del factor */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-sm font-bold text-slate-700 truncate">
            {factor.icono} {factor.nombre}
          </span>
          <span className={`text-xs font-black tabular-nums shrink-0 ${esBueno ? 'text-emerald-600' : 'text-rose-500'}`}>
            {factor.puntos}/{factor.maximo}
          </span>
        </div>

        {/* Barra de progreso */}
        <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden mb-1.5">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${esBueno ? 'bg-emerald-400' : 'bg-rose-300'}`}
            style={{ width: `${porcentajeBarra}%` }}
          />
        </div>

        {/* Nota explicativa */}
        <p className="text-xs text-slate-500 leading-snug">
          {factor.nota}
        </p>
      </div>
    </div>
  );
};

/**
 * Tarjeta de métrica técnica individual para el grid inferior.
 * @param {{ icono: React.ReactNode, etiqueta: string, valor: string|number, unidad: string, extra?: React.ReactNode }} props
 */
const TarjetaMetrica = ({ icono, etiqueta, valor, unidad, extra }) => (
  <div className="group p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/50 flex items-center justify-between sm:flex-col sm:items-start transition-all duration-200 hover:bg-white hover:shadow-sm hover:border-slate-200">
    <div className="flex items-center gap-2 text-slate-500 sm:mb-2">
      <span className="text-slate-400 group-hover:text-slate-500 transition-colors">{icono}</span>
      <span className="text-xs font-semibold">{etiqueta}</span>
    </div>
    <div className="flex items-baseline gap-1.5">
      <span className="text-2xl font-bold text-slate-700 tracking-tight tabular-nums">
        {valor}
      </span>
      <span className="text-xs font-semibold text-slate-400">{unidad}</span>
      {extra}
    </div>
  </div>
);

/**
 * Componente Semáforo de Pesca: Diagnóstico visual prominente enfocado en la seguridad
 * y viabilidad de la jornada de pesca. Muestra un veredicto Hero con puntaje circular,
 * factores clave con indicadores de contribución, y métricas técnicas para pescadores avanzados.
 *
 * @param {Object} props
 * @param {Object} [props.ubicacionSeleccionada] - Objeto con coordenadas { lat, lon, nombre?, name? }.
 */
export const CondicionesActuales = ({ ubicacionSeleccionada }) => {
  const { datos, cargando, error } = usarClima(ubicacionSeleccionada);

  // ── 1. Estado de Carga ──
  if (cargando) {
    return (
      <Tarjeta className="mb-6">
        <div className="flex flex-col items-center justify-center py-14 text-center">
          <Cargador tamanio="lg" texto="Sondeando condiciones marinas para pescar..." />
          <p className="text-xs text-slate-500 mt-2.5">
            Analizando oleaje, viento y luna para emitir el veredicto...
          </p>
        </div>
      </Tarjeta>
    );
  }

  // ── 2. Estado de Error ──
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

  // ── 3. Sin ubicación seleccionada ──
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

  // ── 4. Sin datos disponibles ──
  if (!datos) {
    return null;
  }

  // ═══════════════════════════════════════════════════════════
  //   EXTRACCIÓN DE MÉTRICAS CRUDAS
  // ═══════════════════════════════════════════════════════════
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
  const vientoVel = datos.hourly?.wind_speed_10m?.[indiceActual] ?? '--';
  const vientoDir = datos.hourly?.wind_direction_10m?.[indiceActual] ?? '--';
  const presion = datos.hourly?.surface_pressure?.[indiceActual] ?? '--';

  const rumboOla = typeof direccionOla === 'number' ? calcularRumboCardinal(direccionOla) : '';
  const rumboViento = typeof vientoDir === 'number' ? calcularRumboCardinal(vientoDir) : '';

  // ═══════════════════════════════════════════════════════════
  //   EVALUACIÓN DEL MOTOR
  // ═══════════════════════════════════════════════════════════
  const datosLuna = obtenerDatosLunares();
  const evaluacion = evaluarCondiciones(datos, datosLuna);
  const nombrePuerto =
    ubicacionSeleccionada.nombre || ubicacionSeleccionada.name || 'Puerto';
  const esPeligro = evaluacion.estado === 'Peligro';

  return (
    <div className="space-y-4 mb-6">
      {/* ══════════════════════════════════════════════════════
          1. TARJETA HERO — VEREDICTO + PUNTAJE
         ══════════════════════════════════════════════════════ */}
      <Tarjeta className="!p-0 overflow-hidden">
        <div className={`p-5 sm:p-7 lg:p-8 rounded-2xl border-2 transition-all duration-300 ${evaluacion.estiloHero.fondo}`}>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-7">

            {/* Indicador de Puntaje Circular */}
            <IndicadorPuntaje puntaje={evaluacion.puntaje} color={evaluacion.colorTailwind} />

            {/* Texto del Veredicto */}
            <div className="flex-1 min-w-0 text-center sm:text-left">
              {/* Badge de estado + puerto */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase shadow-sm ${evaluacion.estiloHero.badge}`}
                >
                  <span className="w-2 h-2 rounded-full bg-white/90 animate-pulse" />
                  {evaluacion.estado}
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider opacity-60">
                  • {nombrePuerto}
                </span>
              </div>

              {/* Título heroico masivo */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] mb-3">
                {evaluacion.tituloVeredicto}
              </h2>

              {/* Descripción del veredicto */}
              <p className="text-sm sm:text-base font-medium leading-relaxed opacity-85 max-w-xl">
                {evaluacion.mensaje}
              </p>

              {/* Píldora de actividad sugerida */}
              {evaluacion.recomendacionCorta && (
                <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/70 border border-black/5 text-xs sm:text-sm font-bold shadow-sm backdrop-blur-sm">
                  {esPeligro
                    ? <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
                    : <Anchor className="w-4 h-4 shrink-0 text-slate-500" />
                  }
                  <span className="text-slate-600">
                    {esPeligro ? 'Alerta: ' : 'Sugerido: '}
                    <span className="text-slate-900 font-extrabold">
                      {evaluacion.recomendacionCorta}
                    </span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Tarjeta>

      {/* ══════════════════════════════════════════════════════
          2. FACTORES CLAVE — Desglose de la puntuación
         ══════════════════════════════════════════════════════ */}
      {evaluacion.factores && evaluacion.factores.length > 0 && (
        <Tarjeta>
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-500">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Factores Clave
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {evaluacion.factores.map((factor, idx) => (
              <TarjetaFactor key={idx} factor={factor} />
            ))}
          </div>

          {/* Luna info extra */}
          {datosLuna && !esPeligro && (
            <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50/50 border border-indigo-100/60">
              <Moon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="text-xs text-indigo-600 font-medium">
                {datosLuna.fase} — {datosLuna.iluminacion}% iluminación — {datosLuna.porcentajeActividad}% actividad solunar
              </span>
            </div>
          )}
        </Tarjeta>
      )}

      {/* ══════════════════════════════════════════════════════
          3. MÉTRICAS TÉCNICAS — Datos crudos para pescadores avanzados
         ══════════════════════════════════════════════════════ */}
      <Tarjeta>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
            Métricas del Mar y Clima (Hora Actual)
          </span>
          <span className="text-[10px] text-slate-400 hidden sm:inline">
            Boyas y modelo marino
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
          {/* Altura de Ola */}
          <TarjetaMetrica
            icono={<Waves className="w-4 h-4" />}
            etiqueta="Altura de Ola"
            valor={alturaOla}
            unidad="m"
          />

          {/* Periodo de Ola */}
          <TarjetaMetrica
            icono={<Timer className="w-4 h-4" />}
            etiqueta="Periodo"
            valor={periodoOla}
            unidad="seg"
          />

          {/* Dirección de Ola */}
          <TarjetaMetrica
            icono={<Compass className="w-4 h-4" />}
            etiqueta="Dir. Oleaje"
            valor={direccionOla !== '--' ? Math.round(Number(direccionOla)) + '°' : '--'}
            unidad=""
            extra={rumboOla && (
              <span className="text-xs font-bold text-slate-600 bg-slate-200/70 px-1.5 py-0.5 rounded">
                {rumboOla}
              </span>
            )}
          />

          {/* Velocidad del Viento */}
          <TarjetaMetrica
            icono={<Wind className="w-4 h-4" />}
            etiqueta="Viento"
            valor={vientoVel}
            unidad="km/h"
            extra={rumboViento && (
              <span className="text-xs font-bold text-slate-600 bg-slate-200/70 px-1.5 py-0.5 rounded">
                {rumboViento}
              </span>
            )}
          />

          {/* Presión Barométrica */}
          <TarjetaMetrica
            icono={<Gauge className="w-4 h-4" />}
            etiqueta="Presión"
            valor={presion}
            unidad="hPa"
          />

          {/* Fase Lunar */}
          <TarjetaMetrica
            icono={<Moon className="w-4 h-4" />}
            etiqueta="Luna"
            valor={datosLuna?.iluminacion ?? '--'}
            unidad="%"
            extra={datosLuna?.fase && (
              <span className="text-[10px] font-bold text-slate-500 truncate max-w-[80px]">
                {datosLuna.fase.replace('Luna ', '').replace(' (Cóncava)', '')}
              </span>
            )}
          />
        </div>
      </Tarjeta>
      {/* ══════════════════════════════════════════════════════
          4. DISCLAIMER TÉCNICO Y LEGAL
          ══════════════════════════════════════════════════════ */}
      <div className="px-3 py-2.5 rounded-xl bg-slate-100/70 border border-slate-200/60 flex items-start gap-2 text-slate-500">
        <Info className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
        <p className="text-[11px] leading-relaxed">
          <strong className="text-slate-600">Nota técnica:</strong> El puntaje refleja la favorabilidad de las condiciones ambientales (oleaje, viento, presión y solunar). <span className="underline">No representa una probabilidad garantizada de captura</span>. Los datos oceanográficos tienen precisión limitada cerca de la costa y <span className="font-semibold text-slate-700">no deben utilizarse como instrumento de navegación o seguridad marítima</span>.
        </p>
      </div>
    </div>
  );
};

export default CondicionesActuales;

