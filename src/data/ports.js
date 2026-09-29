/**
 * Catálogo exhaustivo de puertos, rías, muelles y puntos estratégicos de pesca
 * en la costa de Yucatán, ordenados geográficamente de poniente a oriente.
 *
 * @typedef {Object} PuertoYucatan
 * @property {string} id - Identificador único URL/clave del puerto.
 * @property {string} nombre - Nombre del puerto o punto de pesca para visualización.
 * @property {number} lat - Latitud geográfica decimal.
 * @property {number} lon - Longitud geográfica decimal.
 * @property {string} tipo - Clasificación náutica/costera (ej. 'Muelle', 'Escollera', 'Ría/Puerto').
 * @property {string} descripcion - Recomendación y contexto local de pesca.
 * @property {string} [name] - Alias para compatibilidad con componentes que consuman .name.
 */

/**
 * Listado de 13 puntos de pesca costeros en Yucatán (de Poniente a Oriente).
 * @type {PuertoYucatan[]}
 */
export const PUERTOS_YUCATAN = [
  {
    id: 'celestun',
    nombre: 'Celestún',
    name: 'Celestún',
    lat: 20.86,
    lon: -90.40,
    tipo: 'Ría/Puerto',
    descripcion: 'Pesca en ría y mar abierto. Cuidado con las corrientes.',
  },
  {
    id: 'sisal',
    nombre: 'Sisal',
    name: 'Sisal',
    lat: 21.16,
    lon: -90.03,
    tipo: 'Muelle/Playa',
    descripcion: 'Excelente para pesca de muelle y escolleras.',
  },
  {
    id: 'chuburna',
    nombre: 'Chuburná Puerto',
    name: 'Chuburná Puerto',
    lat: 21.25,
    lon: -89.81,
    tipo: 'Escollera',
    descripcion: 'La escollera es ideal para pesca de orilla (robálo, pargo).',
  },
  {
    id: 'chelem',
    nombre: 'Chelem',
    name: 'Chelem',
    lat: 21.26,
    lon: -89.73,
    tipo: 'Ría/Muelle',
    descripcion: 'Pesca tranquila en la ría y zona de muelles.',
  },
  {
    id: 'progreso',
    nombre: 'Progreso (Muelle de Chocolate)',
    name: 'Progreso (Muelle de Chocolate)',
    lat: 21.28,
    lon: -89.66,
    tipo: 'Muelle Principal',
    descripcion: 'Principal puerto. Pesca de altura y en muelle.',
  },
  {
    id: 'chicxulub',
    nombre: 'Chicxulub Puerto',
    name: 'Chicxulub Puerto',
    lat: 21.29,
    lon: -89.60,
    tipo: 'Muelle',
    descripcion: 'Buen punto para pesca nocturna en el muelle.',
  },
  {
    id: 'uaymitun',
    nombre: 'Uaymitún',
    name: 'Uaymitún',
    lat: 21.31,
    lon: -89.48,
    tipo: 'Playa',
    descripcion: 'Zona de playa abierta, ideal para surfcasting.',
  },
  {
    id: 'telchac',
    nombre: 'Telchac Puerto',
    name: 'Telchac Puerto',
    lat: 21.34,
    lon: -89.26,
    tipo: 'Muelle/Escollera',
    descripcion: 'Aguas más claras, buena pesca en la escollera.',
  },
  {
    id: 'sancrisanto',
    nombre: 'San Crisanto',
    name: 'San Crisanto',
    lat: 21.35,
    lon: -89.17,
    tipo: 'Playa/Manglar',
    descripcion: 'Pesca combinada entre playa y canales de manglar.',
  },
  {
    id: 'dzilam',
    nombre: 'Dzilam de Bravo',
    name: 'Dzilam de Bravo',
    lat: 21.39,
    lon: -88.89,
    tipo: 'Puerto/Reserva',
    descripcion: 'Rica biodiversidad, excelente pesca deportiva.',
  },
  {
    id: 'sanfelipe',
    nombre: 'San Felipe',
    name: 'San Felipe',
    lat: 21.56,
    lon: -88.23,
    tipo: 'Ría/Puerto',
    descripcion: 'Tradición pesquera, ría protegida de los vientos.',
  },
  {
    id: 'riolagartos',
    nombre: 'Río Lagartos',
    name: 'Río Lagartos',
    lat: 21.60,
    lon: -88.16,
    tipo: 'Ría/Puerto',
    descripcion: 'Corrientes fuertes, ideal para especies grandes.',
  },
  {
    id: 'elcuyo',
    nombre: 'El Cuyo',
    name: 'El Cuyo',
    lat: 21.51,
    lon: -87.67,
    tipo: 'Muelle/Playa',
    descripcion: 'Frontera con Quintana Roo, oleaje diferente y vientos fuertes.',
  },
];

/**
 * Puerto por defecto: Progreso (Muelle de Chocolate) o el primer puerto.
 */
export const PUERTO_POR_DEFECTO =
  PUERTOS_YUCATAN.find((p) => p.id === 'progreso') || PUERTOS_YUCATAN[0];

// Alias para garantizar compatibilidad con importaciones anteriores
export const YUCATAN_PORTS = PUERTOS_YUCATAN;
export const DEFAULT_PORT = PUERTO_POR_DEFECTO;

export default PUERTOS_YUCATAN;
