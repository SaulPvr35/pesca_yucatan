/**
 * Funciones de formateo
 */

/**
 * Formatea un objeto Date en una cadena legible
 * @param {Date} fecha 
 * @returns {string} Fecha formateada
 */
export const formatearFecha = (fecha) => {
  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(fecha);
};

/**
 * Formatea velocidad (ej. m/s a km/h)
 * @param {number} velocidad 
 * @returns {string} Velocidad formateada
 */
export const formatearVelocidad = (velocidad) => {
  return `${velocidad} km/h`;
};
