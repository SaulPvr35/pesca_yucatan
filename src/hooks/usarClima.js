import { useState, useEffect } from 'react';
import { obtenerDatosClima } from '../servicios/api';

/**
 * @typedef {Object} Ubicacion
 * @property {string} [id] - Identificador único de la ubicación o puerto (ej. 'progreso').
 * @property {number|string} [lat] - Latitud geográfica de la ubicación.
 * @property {number|string} [lon] - Longitud geográfica de la ubicación.
 */

/**
 * @typedef {Object} RetornoUsarClima
 * @property {Object|null} datos - Datos meteorológicos devueltos por el Worker, o null si aún no se han cargado.
 * @property {boolean} cargando - Indica si la solicitud de datos climáticos está en proceso.
 * @property {string|null} error - Mensaje descriptivo del error en caso de fallo, o null si no hubo errores.
 */

/**
 * Hook personalizado para consultar las condiciones climáticas y marinas según coordenadas geográficas.
 * 
 * Satisface las convenciones estándar de React Hooks iniciando con "use" para compatibilidad con linters,
 * y se exporta tanto como `useClima` como `usarClima`.
 *
 * @param {Ubicacion|null|undefined} ubicacion - Objeto con la información de ubicación que contiene lat y lon.
 * @returns {RetornoUsarClima} Objeto con los estados { datos, cargando, error }.
 */
export const useClima = (ubicacion) => {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const lat = ubicacion?.lat;
  const lon = ubicacion?.lon;

  useEffect(() => {
    // Si no contamos con latitud o longitud válidas, evitamos la llamada a la API
    if (lat === undefined || lat === null || lon === undefined || lon === null) {
      return;
    }

    let cancelado = false;

    const cargarDatos = async () => {
      setCargando(true);
      setError(null);

      try {
        const resultado = await obtenerDatosClima(lat, lon);
        if (!cancelado) {
          setDatos(resultado);
        }
      } catch (err) {
        if (!cancelado) {
          setError(err instanceof Error ? err.message : 'Error inesperado al consultar los datos del clima.');
        }
      } finally {
        if (!cancelado) {
          setCargando(false);
        }
      }
    };

    cargarDatos();

    return () => {
      cancelado = true;
    };
  }, [lat, lon]);

  return { datos, cargando, error };
};

/**
 * Alias en español para el hook de clima.
 */
export const usarClima = useClima;

export default usarClima;
