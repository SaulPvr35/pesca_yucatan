import { useMemo } from 'react';
import { obtenerDatosLunares } from '../utilidades/astronomia';

/**
 * Custom Hook para consultar la fase lunar y la probabilidad de actividad solunar de pesca.
 *
 * Calcula de manera reactiva y eficiente los datos lunares al montar el componente,
 * memoizando el resultado para evitar re-renderizados innecesarios y garantizando
 * compatibilidad estricta con las mejores prácticas de React 19.
 *
 * @param {Date|string|number} [fecha] - Fecha para el cálculo astronómico (por defecto la fecha actual).
 * @returns {import('../utilidades/astronomia').DatosLunares} Objeto con fase, porcentajeActividad e iluminacion.
 */
export const useFaseLunar = (fecha) => {
  const tiempoClave = fecha ? new Date(fecha).getTime() : undefined;

  return useMemo(() => {
    const fechaEvaluada = tiempoClave ? new Date(tiempoClave) : new Date();
    return obtenerDatosLunares(fechaEvaluada);
  }, [tiempoClave]);
};

/**
 * Alias en español para el custom hook.
 */
export const usarFaseLunar = useFaseLunar;

export default usarFaseLunar;
