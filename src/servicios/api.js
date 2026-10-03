/**
 * Configuración de API para obtener datos desde el Cloudflare Worker.
 */

const WORKER_URL = 
  import.meta.env.VITE_WORKER_URL || 
  'https://pesca-yucatan-worker.saulp.workers.dev/api/condiciones';

/**
 * Obtiene los datos meteorológicos y marinos para coordenadas geográficas específicas.
 *
 * @param {number|string} lat - Latitud geográfica de la ubicación.
 * @param {number|string} lon - Longitud geográfica de la ubicación.
 * @returns {Promise<Object>} Promesa que resuelve con los datos meteorológicos en formato JSON.
 * @throws {Error} Si no se proporcionan las coordenadas requeridas o si falla la petición de red.
 */
export const obtenerDatosClima = async (lat, lon) => {
  if (lat === undefined || lat === null || lon === undefined || lon === null) {
    throw new Error('Es necesario proporcionar tanto la latitud como la longitud.');
  }

  if (!WORKER_URL) {
    throw new Error('La variable de entorno VITE_WORKER_URL no está configurada.');
  }

  try {
    // Construimos la URL agregando los parámetros lat y lon
    const url = new URL(WORKER_URL);
    url.searchParams.set('lat', String(lat));
    url.searchParams.set('lon', String(lon));

    const respuesta = await fetch(url.toString());

    if (!respuesta.ok) {
      let mensajeError = `La respuesta de red no fue exitosa: ${respuesta.status}`;
      try {
        const errorJson = await respuesta.json();
        if (errorJson && errorJson.error) {
          mensajeError = errorJson.error;
        }
      } catch {
        // En caso de que la respuesta no sea JSON, se conserva el mensaje genérico con el status
      }
      throw new Error(mensajeError);
    }

    return await respuesta.json();
  } catch (error) {
    console.error('Falló al obtener los datos climáticos desde el Worker:', error);
    throw error;
  }
};
