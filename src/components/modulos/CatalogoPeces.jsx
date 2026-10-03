import { useState, useMemo } from 'react';
import { 
  Fish, 
  MapPin, 
  ShieldAlert, 
  Anchor, 
  Search, 
  Layers, 
  Sparkles, 
  Info,
  CheckCircle,
  ExternalLink,
  Compass,
  Waves,
  Ruler,
  Shell
} from 'lucide-react';
import { PECES_YUCATAN, CATEGORIAS_HABITAT } from '../../data/pecesYucatan';
import { Tarjeta } from '../ui/Tarjeta';

/**
 * Módulo de Catálogo Local de Especies Marinas de Yucatán.
 * Diseño representativo de la Costa Esmeralda y Banco de Campeche.
 */
export const CatalogoPeces = () => {
  const [habitatFiltro, setHabitatFiltro] = useState('todos');
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  // Filtrado reactivo optimizado
  const especiesFiltradas = useMemo(() => {
    return PECES_YUCATAN.filter((pez) => {
      const coincideHabitat = habitatFiltro === 'todos' || pez.habitat === habitatFiltro;
      const busquedaLower = terminoBusqueda.toLowerCase().trim();
      const coincideTexto =
        !busquedaLower ||
        pez.nombreComun.toLowerCase().includes(busquedaLower) ||
        pez.nombreCientifico.toLowerCase().includes(busquedaLower) ||
        pez.zonas.toLowerCase().includes(busquedaLower);
      return coincideHabitat && coincideTexto;
    });
  }, [habitatFiltro, terminoBusqueda]);

  // Estilos y acentos dinámicos por hábitat de Yucatán
  const getHabitatBadge = (habitat) => {
    switch (habitat) {
      case 'manglar':
        return {
          bg: 'bg-emerald-500/10 text-emerald-800 border-emerald-300',
          gradient: 'from-emerald-900/10 via-teal-900/5 to-transparent',
          label: '🌿 Ría / Manglar'
        };
      case 'arrecife':
        return {
          bg: 'bg-teal-500/10 text-teal-800 border-teal-300',
          gradient: 'from-teal-900/10 via-cyan-900/5 to-transparent',
          label: '🪸 Arrecife y Bajo'
        };
      case 'profundo':
        return {
          bg: 'bg-indigo-500/10 text-indigo-800 border-indigo-300',
          gradient: 'from-indigo-950/15 via-blue-900/5 to-transparent',
          label: '🌊 Aguas Profundas'
        };
      default:
        return {
          bg: 'bg-sky-500/10 text-sky-800 border-sky-300',
          gradient: 'from-sky-900/10 via-cyan-900/5 to-transparent',
          label: '🏖️ Costa y Muelle'
        };
    }
  };

  return (
    <div className="space-y-7">
      {/* Encabezado Principal del Módulo con vibras de Costa Esmeralda */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-cyan-950 text-white p-6 sm:p-8 shadow-xl border border-teal-800/40">
        {/* Efecto de olas de fondo y resplandor */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-80 h-80 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-300/40">
              <Fish className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-black uppercase tracking-widest text-emerald-300 flex items-center gap-1.5 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                  <Waves className="w-3 h-3 text-cyan-300" /> Litoral Yucateco & Banco de Campeche
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-xs">
                Peces & Especies de Yucatán
              </h2>
              <p className="text-xs sm:text-sm text-cyan-100/80 font-medium max-w-xl mt-1">
                Fichas de identificación ribereña y deportiva: Progreso, Sisal, Alacranes, Celestún, Dzilam y Río Lagartos.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-900/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-teal-500/30 shadow-inner">
            <Shell className="w-4 h-4 text-amber-300" />
            <span className="text-xs font-bold text-teal-200">
              <strong className="text-white text-sm">{especiesFiltradas.length}</strong> de {PECES_YUCATAN.length} especies
            </span>
          </div>
        </div>

        {/* Buscador y Filtros por Hábitat */}
        <div className="relative z-10 flex flex-col md:flex-row items-stretch md:items-center gap-3 pt-2">
          {/* Barra de búsqueda */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-teal-300/70 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por especie, nombre científico o puerto (ej. Mero, Sisal, Robalo)..."
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl text-xs sm:text-sm text-white font-medium placeholder-teal-100/50 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white/15 transition-all shadow-inner"
            />
          </div>

          {/* Selector de Hábitats */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORIAS_HABITAT.map((cat) => {
              const esActivo = habitatFiltro === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setHabitatFiltro(cat.id)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-tight whitespace-nowrap transition-all cursor-pointer shadow-xs active:scale-95 ${
                    esActivo
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 font-black shadow-md shadow-teal-500/30'
                      : 'bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10'
                  }`}
                >
                  {cat.etiqueta}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid de Especies con diseño de tarjeta viva y animaciones */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
        {especiesFiltradas.map((pez) => {
          const esComercial = pez.importancia === 'comercial';
          const esDeportiva = pez.importancia === 'deportiva';
          const habitatInfo = getHabitatBadge(pez.habitat);

          return (
            <div
              key={pez.id}
              className="group bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-teal-300/80 transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1.5 relative"
            >
              {/* Contenedor de la Imagen Marina */}
              <div className="relative h-52 w-full bg-gradient-to-b from-sky-50 via-teal-50/60 to-slate-100 overflow-hidden flex items-center justify-center p-4 border-b border-slate-100">
                {/* Patrón sutil y luz de fondo */}
                <div className={`absolute inset-0 bg-gradient-to-tr ${habitatInfo.gradient} pointer-events-none`} />
                <div className="absolute w-36 h-36 bg-teal-300/20 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
                
                {/* Imagen del pez con animación de flotado y zoom */}
                <img
                  src={pez.imagenUrl}
                  alt={pez.nombreComun}
                  loading="lazy"
                  className="w-full h-full object-contain filter drop-shadow-lg z-10 transition-transform duration-500 ease-out group-hover:scale-110 group-hover:animate-fish-float"
                />
                
                {/* Badges superiores (Importancia + Hábitat) */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1.5 z-20 pointer-events-none">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs backdrop-blur-md ${
                    esComercial
                      ? 'bg-emerald-700/90 text-white border border-emerald-500/50'
                      : esDeportiva
                      ? 'bg-sky-700/90 text-white border border-sky-500/50'
                      : 'bg-amber-700/90 text-white border border-amber-500/50'
                  }`}>
                    {pez.importancia}
                  </span>
                  
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shadow-2xs bg-white/95 backdrop-blur-md ${habitatInfo.bg}`}>
                    {habitatInfo.label}
                  </span>
                </div>

                {/* Talla promedio con ícono de regla */}
                <div className="absolute bottom-2.5 right-3 bg-slate-900/85 backdrop-blur-md text-amber-300 text-[10px] font-black px-2.5 py-1 rounded-xl shadow-md border border-slate-700/60 flex items-center gap-1 z-20">
                  <Ruler className="w-3 h-3 text-cyan-300" />
                  <span>{pez.tallaPromedio}</span>
                </div>
              </div>

              {/* Contenido de la Ficha */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug group-hover:text-teal-700 transition-colors">
                      {pez.nombreComun}
                    </h3>
                  </div>

                  <p className="text-xs italic text-teal-800/80 font-semibold mb-2.5 flex items-center gap-1">
                    <Compass className="w-3 h-3 text-teal-500 shrink-0" />
                    <span>{pez.nombreCientifico}</span>
                    <span className="text-slate-400 font-normal">({pez.familia})</span>
                  </p>
                  
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {pez.descripcion}
                  </p>
                </div>

                {/* Ficha técnica regional de Yucatán */}
                <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs">
                  {/* Zonas y Puertos */}
                  <div className="flex items-start gap-2 text-slate-700 bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span className="line-clamp-2 text-[11px] leading-tight">
                      <strong className="text-slate-900">Puertos / Zonas:</strong> {pez.zonas}
                    </span>
                  </div>

                  {/* Técnica y señuelos */}
                  <div className="flex items-start gap-2 text-slate-700 bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                    <Anchor className="w-3.5 h-3.5 text-cyan-600 shrink-0 mt-0.5" />
                    <div className="text-[11px] leading-tight">
                      <div><strong className="text-slate-900">Técnica:</strong> {pez.tecnicaRecomendada}</div>
                      <div className="text-slate-500 mt-0.5 text-[10px]"><strong className="text-slate-700">Cebo/Señuelo:</strong> {pez.carnadaSenuelo}</div>
                    </div>
                  </div>

                  {/* Veda regulatoria */}
                  <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/70 text-[11px]">
                    <div className="flex items-center gap-1.5 text-amber-900 font-bold mb-0.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>Regulación / Temporada de Veda:</span>
                    </div>
                    <span className="text-slate-700 leading-tight block text-[10.5px] pl-5">{pez.temporadaVeda}</span>
                  </div>

                  {/* Enlace Oficial a la Ficha de Enciclovida */}
                  {pez.fichaCientificaUrl && (
                    <a
                      href={pez.fichaCientificaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-600 hover:to-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md hover:shadow-teal-700/20 active:scale-98"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Ficha Científica Enciclovida</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-80" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Nota técnica e institucional */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border border-teal-200/70 flex items-start gap-3.5 text-slate-700 text-xs leading-relaxed shadow-sm">
        <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
          <Info className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-bold text-slate-900 mb-0.5">Compromiso con la Pesca Sustentable en Yucatán</h4>
          <p>
            Respete siempre las tallas mínimas reglamentarias y los periodos oficiales de veda de CONAPESCA e INAPESCA. Cuidemos los arrecifes, bancos coralinos y rías de nuestra Península para asegurar el futuro de las familias ribereñas y la pesca deportiva responsable.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CatalogoPeces;
