/**
 * Motor de Condiciones de Pesca — Sistema de Pesos con Regla de Seguridad Infranqueable.
 *
 * Módulo puro, agnóstico al framework (sin dependencias de React ni del navegador).
 * Enfocado en la seguridad náutica y la experiencia real de los pescadores de la costa de Yucatán.
 *
 * Arquitectura:
 *  1. KILL SWITCH — Cualquier condición insegura cortocircuita la evaluación (puntaje = 0).
 *  2. PUNTUACIÓN PONDERADA (100 pts máx.):
 *       • Luna  …… 35 %   → Actividad solunar de `astronomia.js`.
 *       • Agua  …… 35 %   → Ola + viento (penaliza turbidez y marejada).
 *       • Presión … 30 %   → Estabilidad barométrica (premio rango 1010-1015 hPa).
 *  3. VEREDICTO FINAL — Mapeo de puntaje a 4 rangos con colores Tailwind.
 */

// ─────────────────────────── CONSTANTES ───────────────────────────

/**
 * Umbrales de seguridad y puntuación para la evaluación marítima.
 * @readonly
 */
const UMBRALES = {
  // ── Kill Switch (corte inmediato si se supera cualquiera) ──
  VIENTO_PELIGRO:      30,    // km/h — Fuerza 7 Beaufort, riesgo real para lanchas ribereñas
  OLA_PELIGRO:         1.5,   // metros — Límite para embarcaciones menores
  PRESION_TORMENTA:    1005,  // hPa — Presión indicativa de sistema de baja potente

  // ── Agua y Viento (subpuntuación) ──
  OLA_IDEAL_MAX:       0.6,   // metros — Mar planchado, visibilidad excelente en aguas someras
  VIENTO_IDEAL_MAX:    15,    // km/h — Brisa suave que no enturbia ni dificulta maniobra

  // ── Presión Barométrica (subpuntuación) ──
  PRESION_IDEAL_MIN:   1010,  // hPa — Borde inferior del rango estable
  PRESION_IDEAL_MAX:   1015,  // hPa — Borde superior del rango estable
  PRESION_ALTA_APATIA: 1020,  // hPa — Presiones altas → peces apáticos, baja actividad

  // ── Seguridad Civil & Salud Térmica ──
  CALOR_EXTREMO:       40,    // °C — Sensación térmica con peligro inminente de golpe de calor
  CALOR_PRECAUCION:    35,    // °C — Sensación térmica con riesgo de deshidratación severa
  UV_EXTREMO:          11,    // Índice UV de radiación extrema
  UV_MUY_ALTO:         8,     // Índice UV muy alto
  RAFAGA_PELIGRO:      40,    // km/h — Ráfaga repentina peligrosa en altamar
  
  // ── Pesos (suman 1.0) ──
  PESO_LUNA:           0.35,
  PESO_AGUA:           0.35,
  PESO_PRESION:        0.30,
};

// ──────────────────────── TIPOS JSDoc ─────────────────────────

/**
 * @typedef {'Peligro' | 'Épico' | 'Buena Pesca' | 'Regular' | 'Difícil'} EstadoVeredicto
 */

/**
 * @typedef {Object} FactorEvaluacion
 * @property {string} nombre  - Nombre del factor (ej. "Luna", "Oleaje", "Presión").
 * @property {string} icono   - Emoji representativo para la interfaz.
 * @property {number} puntos  - Puntos que aporta este factor al total.
 * @property {number} maximo  - Puntos máximos posibles para este factor.
 * @property {string} nota    - Explicación breve de por qué suma o resta.
 */

/**
 * @typedef {Object} AlertaSeguridad
 * @property {'peligro' | 'advertencia' | 'salud'} nivel
 * @property {string} titulo
 * @property {string} descripcion
 * @property {string} accionRecomendada
 */

/**
 * @typedef {Object} EvaluacionCondiciones
 * @property {EstadoVeredicto} estado       - Categoría del veredicto.
 * @property {string} tituloVeredicto       - Titular heroico para la UI.
 * @property {string} colorTailwind         - Clase `bg-*` de Tailwind.
 * @property {string} mensaje               - Explicación para el pescador.
 * @property {string} recomendacionCorta    - Acción sugerida en una frase.
 * @property {string} tipoIcono             - Clave semántica del icono visual.
 * @property {number} puntaje               - Puntaje total (0 – 100).
 * @property {FactorEvaluacion[]} factores  - Desglose detallado de cada factor.
 * @property {AlertaSeguridad[]} alertasSeguridad - Avisos náuticos y de salud (calor/UV/viento).
 * @property {Object} estiloHero            - Mapa de clases Tailwind para tematizar el Hero.
 */

// ─────────────────── EXTRACCIÓN DE DATOS ──────────────────────

/**
 * Obtiene la fecha local en formato "YYYY-MM-DD" respetando la zona horaria del usuario.
 * @param {Date} [fecha=new Date()]
 * @returns {string}
 */
export function obtenerFechaLocal(fecha = new Date()) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

/**
 * Obtiene el prefijo de fecha y hora local en formato "YYYY-MM-DDTHH".
 * @param {Date} [fecha=new Date()]
 * @returns {string}
 */
export function obtenerPrefijoHoraLocal(fecha = new Date()) {
  const fechaStr = obtenerFechaLocal(fecha);
  const hora = String(fecha.getHours()).padStart(2, '0');
  return `${fechaStr}T${hora}`;
}

/**
 * Localiza el índice correspondiente a la hora actual dentro de un array `time` de Open-Meteo.
 * @param {string[]} timeArray - Serie de timestamps ISO-8601 truncados a la hora.
 * @returns {number} Índice más cercano a "ahora" (0 si no encuentra coincidencia).
 */
function indiceHoraActual(timeArray) {
  if (!Array.isArray(timeArray) || timeArray.length === 0) return 0;
  const prefijoLocal = obtenerPrefijoHoraLocal();
  const idx = timeArray.findIndex((t) => typeof t === 'string' && t.startsWith(prefijoLocal));
  return idx !== -1 ? idx : 0;
}

/**
 * Extrae las métricas del objeto de clima.
 * Soporta tanto la forma aplanada como la estructura `hourly` de Open-Meteo.
 *
 * @param {Object} datosClima
 * @param {number} [indiceEspecifico=null] - Índice opcional dentro de los arrays horarios (ej. para pronósticos futuros).
 * @returns {{ waveHeight: number|null, windSpeed: number|null, windGusts: number|null, pressure: number|null, temp: number|null, apparentTemp: number|null, uvIndex: number|null, seaTemp: number|null }}
 */
function extraerMetricasClima(datosClima, indiceEspecifico = null) {
  if (!datosClima || typeof datosClima !== 'object') {
    return {
      waveHeight: null,
      windSpeed: null,
      windGusts: null,
      pressure: null,
      temp: null,
      apparentTemp: null,
      uvIndex: null,
      seaTemp: null,
    };
  }

  // ── Forma aplanada ──
  if (
    indiceEspecifico === null &&
    typeof datosClima.wave_height === 'number' &&
    typeof datosClima.wind_speed_10m === 'number' &&
    typeof datosClima.surface_pressure === 'number'
  ) {
    return {
      waveHeight: datosClima.wave_height,
      windSpeed: datosClima.wind_speed_10m,
      windGusts: datosClima.wind_gusts_10m ?? datosClima.wind_speed_10m,
      pressure: datosClima.surface_pressure,
      temp: datosClima.temperature_2m ?? null,
      apparentTemp: datosClima.apparent_temperature ?? datosClima.temperature_2m ?? null,
      uvIndex: datosClima.uv_index ?? null,
      seaTemp: datosClima.sea_surface_temperature ?? null,
    };
  }

  // ── Forma Open-Meteo con arrays horarios ──
  const hourly = datosClima.hourly || datosClima;
  const idx = indiceEspecifico !== null ? indiceEspecifico : indiceHoraActual(hourly.time);

  const extraer = (arr) => (Array.isArray(arr) && typeof arr[idx] === 'number' ? arr[idx] : null);

  return {
    waveHeight: extraer(hourly.wave_height),
    windSpeed: extraer(hourly.wind_speed_10m),
    windGusts: extraer(hourly.wind_gusts_10m) ?? extraer(hourly.wind_speed_10m),
    pressure: extraer(hourly.surface_pressure),
    temp: extraer(hourly.temperature_2m),
    apparentTemp: extraer(hourly.apparent_temperature) ?? extraer(hourly.temperature_2m),
    uvIndex: extraer(hourly.uv_index),
    seaTemp: extraer(hourly.sea_surface_temperature),
  };
}

// ──────────────────── SUBPUNTUACIONES ─────────────────────────

/**
 * Subpuntuación: Luna (35 pts máx.)
 * Traslada directamente el porcentaje solunar de `astronomia.js` al peso asignado.
 *
 * @param {number} porcentajeActividad - 0 a 100 (proveniente de `obtenerDatosLunares`).
 * @returns {{ puntos: number, nota: string }}
 */
function calcularPuntosLuna(porcentajeActividad) {
  const maximo = UMBRALES.PESO_LUNA * 100; // 35
  const factor = Math.max(0, Math.min(100, porcentajeActividad)) / 100;
  const puntos = Math.round(factor * maximo * 10) / 10;

  let nota;
  if (porcentajeActividad >= 80) nota = 'Fase lunar ideal: alta actividad de peces';
  else if (porcentajeActividad >= 55) nota = 'Fase lunar moderada: actividad aceptable';
  else nota = 'Fase lunar desfavorable: peces poco activos';

  return { puntos, nota };
}

/**
 * Subpuntuación: Agua y Viento (35 pts máx.)
 * Premia oleaje < 0.6 m y viento < 15 km/h. Penaliza vientos fuertes que enturbian y
 * olas que dificultan la maniobra.
 *
 * @param {number|null} waveHeight - Altura de ola en metros.
 * @param {number|null} windSpeed  - Velocidad del viento a 10 m (km/h).
 * @returns {{ puntos: number, nota: string }}
 */
function calcularPuntosAgua(waveHeight, windSpeed) {
  const maximo = UMBRALES.PESO_AGUA * 100; // 35

  // Si faltan datos, otorgamos un mínimo conservador
  if (waveHeight === null || windSpeed === null) {
    return { puntos: 0, nota: 'Datos de oleaje o viento no disponibles' };
  }

  // Factor de ola: 1.0 cuando ≤ 0.6 m, 0.0 cuando ≥ 1.5 m (lineal)
  const olaFactor = Math.max(0, Math.min(1, 1 - (waveHeight - UMBRALES.OLA_IDEAL_MAX)
    / (UMBRALES.OLA_PELIGRO - UMBRALES.OLA_IDEAL_MAX)));

  // Factor de viento: 1.0 cuando ≤ 15 km/h, 0.0 cuando ≥ 30 km/h (lineal)
  const vientoFactor = Math.max(0, Math.min(1, 1 - (windSpeed - UMBRALES.VIENTO_IDEAL_MAX)
    / (UMBRALES.VIENTO_PELIGRO - UMBRALES.VIENTO_IDEAL_MAX)));

  const combinado = (olaFactor * 0.55 + vientoFactor * 0.45); // ola pesa ligeramente más
  const puntos = Math.round(combinado * maximo * 10) / 10;

  // Nota descriptiva
  let nota;
  if (waveHeight <= UMBRALES.OLA_IDEAL_MAX && windSpeed <= UMBRALES.VIENTO_IDEAL_MAX) {
    nota = `Mar planchado (${waveHeight} m) y brisa suave (${windSpeed} km/h): ideal`;
  } else if (waveHeight > 1.0 || windSpeed > 25) {
    nota = `Marejada (${waveHeight} m) o viento fuerte (${windSpeed} km/h): agua turbia, pesca difícil`;
  } else {
    nota = `Oleaje moderado (${waveHeight} m) con viento de ${windSpeed} km/h`;
  }

  return { puntos, nota };
}

/**
 * Subpuntuación: Presión Barométrica (30 pts máx.)
 * Premia el rango estable 1010-1015 hPa. Presiones altas (>1020) restan puntos
 * porque generan apatía en los peces. Presiones bajas restan por riesgo.
 *
 * @param {number|null} pressure - Presión atmosférica en hPa.
 * @returns {{ puntos: number, nota: string }}
 */
function calcularPuntosPresion(pressure) {
  const maximo = UMBRALES.PESO_PRESION * 100; // 30

  if (pressure === null) {
    return { puntos: 0, nota: 'Datos de presión no disponibles' };
  }

  let factor;
  let nota;

  if (pressure >= UMBRALES.PRESION_IDEAL_MIN && pressure <= UMBRALES.PRESION_IDEAL_MAX) {
    // Rango ideal: máximo puntaje
    factor = 1.0;
    nota = `Presión estable (${pressure} hPa): peces activos y en movimiento`;
  } else if (pressure > UMBRALES.PRESION_IDEAL_MAX && pressure <= UMBRALES.PRESION_ALTA_APATIA) {
    // Ligeramente alta: penalización leve
    factor = 0.7;
    nota = `Presión algo alta (${pressure} hPa): actividad reducida`;
  } else if (pressure > UMBRALES.PRESION_ALTA_APATIA) {
    // Muy alta: peces apáticos
    const exceso = pressure - UMBRALES.PRESION_ALTA_APATIA;
    factor = Math.max(0.15, 0.5 - exceso * 0.03);
    nota = `Presión alta (${pressure} hPa): peces apáticos, pesca lenta`;
  } else if (pressure >= UMBRALES.PRESION_TORMENTA && pressure < UMBRALES.PRESION_IDEAL_MIN) {
    // Presión bajando ligeramente: actividad alta (los peces se alimentan antes de tormenta)
    const deficit = UMBRALES.PRESION_IDEAL_MIN - pressure;
    factor = deficit <= 3 ? 0.9 : Math.max(0.3, 0.8 - deficit * 0.05);
    nota = deficit <= 3
      ? `Presión bajando suavemente (${pressure} hPa): peces alimentándose activamente`
      : `Presión descendiendo (${pressure} hPa): actividad intermitente`;
  } else {
    // Por debajo de tormenta — no debería llegar aquí por Kill Switch, pero defensivo
    factor = 0;
    nota = `Presión de tormenta (${pressure} hPa)`;
  }

  const puntos = Math.round(factor * maximo * 10) / 10;
  return { puntos, nota };
}

// ───────────────── ESTILOS HERO POR ESTADO ────────────────────

/**
 * Devuelve el mapa de clases Tailwind para tematizar el Hero según el estado.
 * @param {EstadoVeredicto} estado
 * @returns {Object}
 */
function obtenerEstiloHero(estado) {
  /** @type {Record<EstadoVeredicto, Object>} */
  const estilos = {
    Peligro: {
      fondo:       'bg-rose-50/80 border-rose-200 text-rose-950',
      badge:       'bg-red-600 text-white',
      iconoBg:     'bg-rose-100 text-rose-600 ring-rose-200',
      bordeAcento: 'border-l-rose-600',
    },
    Épico: {
      fondo:       'bg-emerald-50 border-emerald-200/90 text-emerald-950',
      badge:       'bg-emerald-700 text-white',
      iconoBg:     'bg-emerald-100 text-emerald-700 ring-emerald-200',
      bordeAcento: 'border-l-emerald-700',
    },
    'Buena Pesca': {
      fondo:       'bg-green-50 border-green-200/90 text-green-950',
      badge:       'bg-green-600 text-white',
      iconoBg:     'bg-green-100 text-green-600 ring-green-200',
      bordeAcento: 'border-l-green-600',
    },
    Regular: {
      fondo:       'bg-amber-50 border-amber-200/90 text-amber-950',
      badge:       'bg-amber-500 text-white',
      iconoBg:     'bg-amber-100 text-amber-600 ring-amber-200',
      bordeAcento: 'border-l-amber-500',
    },
    Difícil: {
      fondo:       'bg-orange-50 border-orange-200/90 text-orange-950',
      badge:       'bg-orange-600 text-white',
      iconoBg:     'bg-orange-100 text-orange-600 ring-orange-200',
      bordeAcento: 'border-l-orange-600',
    },
  };

  return estilos[estado] || estilos.Regular;
}

// ═══════════════════ FUNCIÓN PRINCIPAL ═════════════════════════

/**
 * Evalúa las condiciones marítimas y astronómicas combinadas, emitiendo un veredicto
 * de pesca con puntaje ponderado y una regla de seguridad infranqueable.
 *
 * @param {Object} datosClima - Respuesta de Open-Meteo (incluye ola, viento, presión).
 * @param {Object} [datosLuna] - Resultado de `obtenerDatosLunares()` de `astronomia.js`.
 * @param {number} [datosLuna.porcentajeActividad] - Índice solunar (0-100).
 * @param {string} [datosLuna.fase] - Nombre de la fase lunar.
 * @param {number} [indiceEspecifico=null] - Índice horario opcional para evaluar un momento específico.
 * @returns {EvaluacionCondiciones} Veredicto completo con puntaje, factores y estilos.
 */
export const evaluarCondiciones = (datosClima, datosLuna = null, indiceEspecifico = null) => {
  const {
    waveHeight,
    windSpeed,
    windGusts,
    pressure,
    temp,
    apparentTemp,
    uvIndex,
  } = extraerMetricasClima(datosClima, indiceEspecifico);

  // ════════════════════════════════════════════════════════════════
  //  ⚠️  SISTEMA DE ALERTAS DE SEGURIDAD & SALUD DEL PESCADOR
  // ════════════════════════════════════════════════════════════════
  /** @type {AlertaSeguridad[]} */
  const alertasSeguridad = [];

  // 1. Alerta por Calor Extremo o Deshidratación (Sensación Térmica en Yucatán)
  if (apparentTemp !== null) {
    if (apparentTemp >= UMBRALES.CALOR_EXTREMO) {
      alertasSeguridad.push({
        nivel: 'peligro',
        titulo: 'Peligro Extremo de Golpe de Calor',
        descripcion: `Sensación térmica sofocante de ${Math.round(apparentTemp)}°C (Temp: ${Math.round(temp ?? apparentTemp)}°C). Riesgo alto de golpe de calor en el mar.`,
        accionRecomendada: 'Evita navegar entre 11:00 AM y 4:00 PM. Lleva mínimo 3L de agua/electrolitos por persona, toldo/bimini obligatorio y ropa con filtro UPF 50+.',
      });
    } else if (apparentTemp >= UMBRALES.CALOR_PRECAUCION) {
      alertasSeguridad.push({
        nivel: 'salud',
        titulo: 'Precaución por Calor Intenso',
        descripcion: `Sensación térmica de ${Math.round(apparentTemp)}°C en zona costera. Deshidratación acelerada por salitre y sol reflejado.`,
        accionRecomendada: 'Hidratación constante antes de tener sed. Programa tu jornada en la madrugada (5:00 a 10:00 AM) o atardecer.',
      });
    }
  }

  // 2. Alerta de Radiación Ultravioleta (UV)
  if (uvIndex !== null) {
    if (uvIndex >= UMBRALES.UV_EXTREMO) {
      alertasSeguridad.push({
        nivel: 'peligro',
        titulo: `Índice UV Extremo (${Math.round(uvIndex)})`,
        descripcion: 'La radiación solar reflejada en el mar quema la piel en menos de 15 minutos sin protección.',
        accionRecomendada: 'Lentes polarizados con filtro UV400 (vital para vista en agua), buff para cuello, gorro con solapa y bloqueador mineral biodegradable.',
      });
    } else if (uvIndex >= UMBRALES.UV_MUY_ALTO) {
      alertasSeguridad.push({
        nivel: 'salud',
        titulo: `Índice UV Muy Alto (${Math.round(uvIndex)})`,
        descripcion: 'Fuerte exposición solar directa y reflejada en el espejo de agua.',
        accionRecomendada: 'Aplica protector solar cada 2 horas y protégete los ojos con polarizados.',
      });
    }
  }

  // 3. Alerta por Ráfagas repentinas / Aviso a embarcaciones menores
  if (windGusts !== null && windGusts >= UMBRALES.RAFAGA_PELIGRO) {
    alertasSeguridad.push({
      nivel: 'advertencia',
      titulo: `Ráfagas repentinas de ${Math.round(windGusts)} km/h`,
      descripcion: 'Viento con rachas capaces de voltear lanchas ribereñas o romper anclas en fondos arenosos de Yucatán.',
      accionRecomendada: 'Mantén línea de vista con la costa. Usa chaleco salvavidas puesto en todo momento.',
    });
  }

  // ════════════════════════════════════════════════════════════════
  //  🛑  KILL SWITCH — REGLA DE SEGURIDAD INFRANQUEABLE
  // ════════════════════════════════════════════════════════════════
  const vientoPeligroso = windSpeed !== null && windSpeed > UMBRALES.VIENTO_PELIGRO;
  const olaPeligrosa    = waveHeight !== null && waveHeight > UMBRALES.OLA_PELIGRO;
  const tormentaPresion = pressure !== null && pressure < UMBRALES.PRESION_TORMENTA;

  if (vientoPeligroso || olaPeligrosa || tormentaPresion) {
    // Construir razones específicas para el pescador
    const razones = [];
    if (vientoPeligroso) razones.push(`viento sostenido de ${windSpeed} km/h (límite lanchas: ${UMBRALES.VIENTO_PELIGRO} km/h)`);
    if (olaPeligrosa)    razones.push(`olas de ${waveHeight} m (límite embarcación menor: ${UMBRALES.OLA_PELIGRO} m)`);
    if (tormentaPresion) razones.push(`presión de ${pressure} hPa (posible depresión o frente frío activo)`);

    return {
      estado:             'Peligro',
      tituloVeredicto:    'Puerto Cerrado / No Salir',
      colorTailwind:      'bg-red-600',
      mensaje:            `Condiciones marítimas críticas: ${razones.join('; ')}. Riesgo inminente de zozobra. Quédate en tierra firme.`,
      recomendacionCorta: 'No salir al mar — Alternativa: resguardo en rías o posponer',
      tipoIcono:          'precaucion',
      puntaje:            0,
      factores: [{
        nombre: 'Seguridad Náutica',
        icono:  'seguridad',
        puntos: 0,
        maximo: 100,
        nota:   `Criterio de seguridad activado: ${razones.join('; ')}`,
      }],
      alertasSeguridad,
      estiloHero: obtenerEstiloHero('Peligro'),
    };
  }

  // ════════════════════════════════════════════════════════════════
  //  SISTEMA DE PUNTUACIÓN PONDERADA & MODELO BIOLÓGICO REAL
  // ════════════════════════════════════════════════════════════════
  const lunaActividad = datosLuna?.porcentajeActividad ?? 50;
  const lunaFase      = datosLuna?.fase ?? 'Desconocida';

  const rLuna    = calcularPuntosLuna(lunaActividad);
  const rAgua    = calcularPuntosAgua(waveHeight, windSpeed);
  const rPresion = calcularPuntosPresion(pressure);

  let puntajeTotal = Math.round(rLuna.puntos + rAgua.puntos + rPresion.puntos);

  // Ajuste realista de actividad (Ley del Mínimo Biológico)
  // En la pesca marina, si no hay corriente por marea muerta (Cuartos),
  // los peces reducen drásticamente su pique sin importar que el mar esté en calma.
  // Un día de marea muerta (actividad solunar < 50%) no supera 65 pts.
  const esMareaMuerta = lunaActividad < 50;
  if (esMareaMuerta && puntajeTotal > 65) {
    puntajeTotal = Math.round(60 + (puntajeTotal - 65) * 0.15);
  }

  /** @type {FactorEvaluacion[]} */
  const factores = [
    {
      nombre: `Luna (${lunaFase})`,
      icono:  'luna',
      puntos: rLuna.puntos,
      maximo: UMBRALES.PESO_LUNA * 100,
      nota:   rLuna.nota,
    },
    {
      nombre: 'Oleaje y Viento',
      icono:  'mar',
      puntos: rAgua.puntos,
      maximo: UMBRALES.PESO_AGUA * 100,
      nota:   rAgua.nota,
    },
    {
      nombre: 'Presión Barométrica',
      icono:  'presion',
      puntos: rPresion.puntos,
      maximo: UMBRALES.PESO_PRESION * 100,
      nota:   rPresion.nota,
    },
  ];

  // ════════════════════════════════════════════════════════════════
  //  🏆  VEREDICTO FINAL CON TEXTO DINÁMICO 100% REAL
  // ════════════════════════════════════════════════════════════════
  let estado, titulo, color, mensaje, recomendacion, icono;

  // Descripción dinámica del estado del agua
  const marEnCalma = waveHeight !== null && waveHeight <= 0.6 && windSpeed !== null && windSpeed <= 16;
  const descripcionMar = marEnCalma ? 'mar en calma y navegación cómoda' : 'oleaje activo';

  if (puntajeTotal >= 80) {
    estado        = 'Épico';
    titulo        = '¡Condiciones Épicas!';
    color         = 'bg-emerald-700';
    mensaje       = `Puntaje ${puntajeTotal}/100. Conjunción perfecta: marea viva con alta corrida (${lunaFase}), ${descripcionMar} y presión estable (${pressure ?? '--'} hPa). Jornada de máxima probabilidad de pique.`;
    recomendacion = 'Salida a fondo en arrecife, troleo y casteo abierto';
    icono         = 'favorable';
  } else if (puntajeTotal >= 65) {
    estado        = 'Buena Pesca';
    titulo        = 'Buena Pesca';
    color         = 'bg-green-500';
    mensaje       = `Puntaje ${puntajeTotal}/100. Buenas condiciones generales con balance favorable de viento y marea. Actividad consistente en zonas costeras.`;
    recomendacion = 'Salida en lancha o escollera recomendada con precauciones habituales';
    icono         = 'favorable';
  } else if (puntajeTotal >= 45) {
    estado        = 'Regular';
    titulo        = esMareaMuerta ? 'Marea Muerta / Pesca Lenta' : 'Condiciones Regulares';
    color         = 'bg-yellow-500';
    if (esMareaMuerta) {
      mensaje     = `Puntaje ${puntajeTotal}/100. Aunque hay ${descripcionMar}, la fase ${lunaFase} produce marea muerta con poca corriente. Los peces están inactivos o en el fondo. Se requiere técnica fina y carnada viva.`;
      recomendacion = 'Pesca técnica: carnada viva, fondos hondos o buscar boca de rías';
    } else {
      mensaje     = `Puntaje ${puntajeTotal}/100. Factores mixtos en contra (mar picado o viento moderado). Pique intermitente.`;
      recomendacion = 'Prefiere pesca en muelles, escolleras o canales de manglar resguardados';
    }
    icono         = 'variable';
  } else {
    estado        = 'Difícil';
    titulo        = 'Pesca Difícil';
    color         = 'bg-orange-500';
    mensaje       = `Puntaje ${puntajeTotal}/100. Múltiples factores desfavorables (mar turbio, presión oscilante o corrientes desfavorables). Éxito limitado.`;
    recomendacion = 'Evalúa posponer o intentar pesca recreativa de orilla';
    icono         = 'variable';
  }

  return {
    estado,
    tituloVeredicto:    titulo,
    colorTailwind:      color,
    mensaje,
    recomendacionCorta: recomendacion,
    tipoIcono:          icono,
    puntaje:            puntajeTotal,
    factores,
    alertasSeguridad,
    estiloHero:         obtenerEstiloHero(estado),
  };
};

/**
 * Planificador semanal de pesca: Agrupa las 168 horas devueltas por Open-Meteo en los 7 días
 * de la semana, calculando para cada día la fase lunar astronómica, condiciones climáticas
 * medias/críticas en horario idóneo de pesca (madrugada/mañana 07:00 - 10:00) y el veredicto general.
 *
 * @param {Object} datosClima - Respuesta de Open-Meteo con arrays `hourly`.
 * @param {Function} obtenerDatosLunares - Función astronómica determinista.
 * @returns {Array<Object>} Lista de 7 días evaluados con fecha, día de la semana, puntaje, veredicto y luna.
 */
export const evaluarPronosticoSemanal = (datosClima, obtenerDatosLunaresFn) => {
  if (!datosClima?.hourly?.time || !Array.isArray(datosClima.hourly.time)) {
    return [];
  }

  const times = datosClima.hourly.time;
  // Agrupar índices por fecha "YYYY-MM-DD"
  const diasMapa = new Map();

  times.forEach((tStr, index) => {
    if (typeof tStr !== 'string') return;
    const fechaClave = tStr.slice(0, 10);
    if (!diasMapa.has(fechaClave)) {
      diasMapa.set(fechaClave, []);
    }
    diasMapa.get(fechaClave).push({ index, tStr });
  });

  const resultados = [];
  const nombresDias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const nombresMeses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  for (const [fechaIso, entradas] of diasMapa.entries()) {
    // Tomamos como referencia la mañana (08:00 o la hora más cercana a la mañana)
    // que es la ventana primordial de pesca costera en Yucatán
    const entradaManiana =
      entradas.find((e) => e.tStr.includes('T08:00') || e.tStr.includes('T07:00') || e.tStr.includes('T09:00')) ||
      entradas[Math.floor(entradas.length / 2)];

    const indiceReferencia = entradaManiana.index;
    const fechaObj = new Date(fechaIso + 'T12:00:00');

    // Datos lunares reales para esa fecha
    const datosLuna = typeof obtenerDatosLunaresFn === 'function' ? obtenerDatosLunaresFn(fechaObj) : null;

    // Evaluación con el motor náutico para esa fecha/índice
    const evaluacion = evaluarCondiciones(datosClima, datosLuna, indiceReferencia);

    // Métricas del día para mostrar en la tarjeta de planificación
    const olas = entradas.map((e) => datosClima.hourly.wave_height?.[e.index]).filter((v) => typeof v === 'number');
    const vientos = entradas.map((e) => datosClima.hourly.wind_speed_10m?.[e.index]).filter((v) => typeof v === 'number');
    const temps = entradas.map((e) => datosClima.hourly.temperature_2m?.[e.index]).filter((v) => typeof v === 'number');

    const olaPromedio = olas.length > 0 ? (olas.reduce((a, b) => a + b, 0) / olas.length).toFixed(1) : '--';
    const vientoMax = vientos.length > 0 ? Math.round(Math.max(...vientos)) : '--';
    const tempMax = temps.length > 0 ? Math.round(Math.max(...temps)) : '--';

    const diaSemana = nombresDias[fechaObj.getDay()];
    const diaNumero = fechaObj.getDate();
    const mesNombre = nombresMeses[fechaObj.getMonth()];

    const hoyLocal = obtenerFechaLocal();

    resultados.push({
      fechaIso,
      etiquetaDia: `${diaSemana} ${diaNumero} ${mesNombre}`,
      diaSemana,
      diaNumero,
      esHoy: fechaIso === hoyLocal,
      puntaje: evaluacion.puntaje,
      estado: evaluacion.estado,
      tituloVeredicto: evaluacion.tituloVeredicto,
      recomendacionCorta: evaluacion.recomendacionCorta,
      colorTailwind: evaluacion.colorTailwind,
      lunaFase: datosLuna?.fase ?? '--',
      lunaIluminacion: datosLuna?.iluminacion ?? '--',
      lunaActividad: datosLuna?.porcentajeActividad ?? 50,
      olaPromedio,
      vientoMax,
      tempMax,
      alertas: evaluacion.alertasSeguridad || [],
    });
  }

  return resultados.slice(0, 7); // Retornar máximo 7 días
};

export default evaluarCondiciones;
