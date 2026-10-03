import * as Astronomy from 'astronomy-engine';

/**
 * Módulo de cálculos astronómicos de alta precisión y Teoría Solunar aplicada a la pesca.
 * Determina con exactitud las 8 fases reales del ciclo lunar y la probabilidad de captura.
 * Módulo puro, agnóstico al framework (sin dependencias de React ni del navegador).
 */

/**
 * @typedef {'Luna Nueva' | 'Luna Creciente (Cóncava)' | 'Cuarto Creciente' | 'Gibosa Creciente' | 'Luna Llena' | 'Gibosa Menguante' | 'Cuarto Menguante' | 'Luna Menguante (Cóncava)'} FaseLunar8
 */

/**
 * @typedef {Object} DatosLunaresSolunar
 * @property {FaseLunar8} fase - Nombre exacto de una de las 8 fases lunares del ciclo en español.
 * @property {number} porcentajeActividad - Probabilidad de pesca solunar (45% a 95%).
 * @property {number} iluminacion - Fracción iluminada visible de la Luna expresada en porcentaje (0 a 100).
 * @property {number} grados - Longitud lunar geocéntrica exacta relativa al Sol en grados (0° a 360°).
 */

/**
 * Mapea la posición angular de la fase lunar en grados (0° a 360°) a las 8 fases astronómicas
 * con una tolerancia de ±6° en los vértices principales (Nueva, Cuartos y Llena).
 *
 * @param {number} grados - Ángulo de la fase lunar entre 0 y 360 grados.
 * @returns {FaseLunar8} Nombre oficial de la fase en español.
 */
export const mapearOchoFases = (grados) => {
  const theta = ((grados % 360) + 360) % 360;

  // 1. Luna Nueva: (354° a 360° y 0° a 6°)
  if (theta >= 354 || theta <= 6) {
    return 'Luna Nueva';
  }

  // 2. Luna Creciente (Cóncava): (7° a 83°)
  if (theta > 6 && theta < 84) {
    return 'Luna Creciente (Cóncava)';
  }

  // 3. Cuarto Creciente: (84° a 96°)
  if (theta >= 84 && theta <= 96) {
    return 'Cuarto Creciente';
  }

  // 4. Gibosa Creciente: (97° a 173°)
  if (theta > 96 && theta < 174) {
    return 'Gibosa Creciente';
  }

  // 5. Luna Llena: (174° a 186°)
  if (theta >= 174 && theta <= 186) {
    return 'Luna Llena';
  }

  // 6. Gibosa Menguante: (187° a 263°)
  if (theta > 186 && theta < 264) {
    return 'Gibosa Menguante';
  }

  // 7. Cuarto Menguante: (264° a 276°)
  if (theta >= 264 && theta <= 276) {
    return 'Cuarto Menguante';
  }

  // 8. Luna Menguante (Cóncava): (277° a 353°)
  return 'Luna Menguante (Cóncava)';
};

/**
 * Calcula con precisión astronómica la fase de la Luna, su iluminación y el índice de actividad solunar.
 *
 * Curva Solunar Armónica:
 * - Ciclo bimodal modelado mediante: P(theta) = 70 + 25 * cos(2 * theta_rad)
 * - Picos máximos (90% - 95%) en Luna Nueva (0°) y Luna Llena (180°), coincidentes con mareas vivas (sicigias).
 * - Picos mínimos (40% - 45%) en Cuartos (90° y 270°), coincidentes con mareas muertas (cuadraturas).
 * - Transición trigonométrica continua y suave a lo largo de las fases cóncavas y gibosas (~70% - 75%).
 *
 * @param {Date|string|number} [fecha=new Date()] - Fecha de referencia para el cálculo astronómico.
 * @returns {DatosLunaresSolunar} Objeto con fase, porcentajeActividad, iluminacion y grados.
 */
export const obtenerDatosLunares = (fecha = new Date(), esDeDia = true) => {
  const fechaObj = fecha instanceof Date ? fecha : new Date(fecha);

  // 1. Cálculo de fase geocéntrica en grados (0° a 360°) con Astronomy Engine
  const gradosExactos = Astronomy.MoonPhase(fechaObj);
  const gradosNormalizados = ((gradosExactos % 360) + 360) % 360;

  // 2. Porcentaje de iluminación (0 a 100)
  const infoIluminacion = Astronomy.Illumination('Moon', fechaObj);
  const iluminacion = Math.round(infoIluminacion.phase_fraction * 100);

  // 3. Mapeo a las 8 fases con tolerancia exacta de ±6°
  const fase = mapearOchoFases(gradosNormalizados);

  // 4. Cálculo de actividad solunar basada en reglas estrictas
  const porcentajeActividad = calcularActividadSolunar(gradosNormalizados, esDeDia);

  return {
    fase,
    porcentajeActividad,
    iluminacion,
    grados: Math.round(gradosNormalizados * 10) / 10,
  };
};

/**
 * Calcula la probabilidad de actividad solunar (0 a 100) de forma determinista y matemática.
 *
 * Modelo bimodal armónico basado en la Teoría Solunar de John Alden Knight:
 *  - Luna Nueva (0°) y Luna Llena (180°): Mareas vivas (sicigias). Máxima amplitud de corriente. (85% - 95%)
 *  - Cuartos (90° y 270°): Mareas muertas (cuadraturas). Corrientes mínimas, peces pasivos. (35% - 45%)
 *  - Fases intermedias (Crecientes y Menguantes cóncavas/gibosas): Transición suave armónica (55% - 75%)
 *
 * @param {number} gradosLuna Ángulo lunar geocéntrico normalizado (0 a 360).
 * @param {boolean} [esDeDia=true] Si la jornada es diurna.
 * @returns {number} Actividad biológica solunar estimada (35 a 95).
 */
export const calcularActividadSolunar = (gradosLuna, esDeDia = true) => {
  const thetaRad = (gradosLuna * Math.PI) / 180;

  // Curva armónica bimodal de Knight: picos en 0° (Nueva) y 180° (Llena)
  // Amplitud base: 65% ± 30% -> Rango: 35% en cuadraturas (90°/270°) a 95% en sicigias (0°/180°)
  let actividadBase = 65 + 30 * Math.cos(2 * thetaRad);

  const fase = mapearOchoFases(gradosLuna);

  // Ajuste biológico diurno/nocturno:
  // En Luna Llena de día, los peces comieron toda la noche con luz de luna -> día penalizado (-15%)
  if (fase === 'Luna Llena' && esDeDia) {
    actividadBase = Math.max(40, actividadBase - 15);
  }

  // En Cuartos, la marea muerta no supera el 45%
  if (fase === 'Cuarto Creciente' || fase === 'Cuarto Menguante') {
    actividadBase = Math.min(45, Math.max(35, actividadBase));
  }

  return Math.round(Math.max(30, Math.min(95, actividadBase)));
};

// Alias para garantizar compatibilidad con importaciones previas
export const calcularFaseLunar = obtenerDatosLunares;
export const determinarNombreFase = mapearOchoFases;

export default obtenerDatosLunares;
