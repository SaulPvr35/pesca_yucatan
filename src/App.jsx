import { useState } from 'react';
import { PUERTOS_YUCATAN, PUERTO_POR_DEFECTO } from './data/ports';
import { PlantillaPrincipal } from './componentes/estructura/PlantillaPrincipal';
import { SelectorUbicacion } from './componentes/modulos/SelectorUbicacion';
import { CondicionesActuales } from './componentes/modulos/CondicionesActuales';
import { TarjetaFaseLunar } from './componentes/modulos/TarjetaFaseLunar';

export const App = () => {
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState(
    PUERTO_POR_DEFECTO || PUERTOS_YUCATAN[0]
  );

  return (
    <PlantillaPrincipal>
      {/* ── HERO PRINCIPAL ── */}
      <section 
        className="relative overflow-hidden rounded-3xl shadow-2xl mb-12 h-[420px] sm:h-[500px] bg-cover bg-center flex flex-col justify-center items-center text-center px-6 border border-white/10"
        style={{ backgroundImage: "url('/pogreso.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-sky-950/70 via-teal-950/60 to-slate-950/85 backdrop-blur-[1px]" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black tracking-widest uppercase backdrop-blur-md shadow-sm">
            Reporte marino en tiempo real
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-md leading-tight">
            Encuentra tu mejor día para pescar en <span className="text-emerald-400">Yucatán</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-100 font-medium max-w-lg mx-auto leading-relaxed">
            Condiciones marinas, fases lunares y corrientes optimizadas para la costa esmeralda.
          </p>
          <div className="pt-4">
            <a 
              href="#puertos" 
              className="inline-flex items-center justify-center px-7 py-3 bg-emerald-500 text-slate-950 font-black text-base rounded-full shadow-lg hover:bg-emerald-400 hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              Explorar Puertos ➔
            </a>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 pointer-events-none opacity-90">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-12 sm:h-16 text-slate-950/40 fill-current">
            <path d="M0,32L60,42.7C120,53,240,75,360,80C480,85,600,75,720,64C840,53,960,43,1080,48C1200,53,1320,75,1380,85.3L1440,96L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* ── CONTENEDOR PRINCIPAL ── */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* 1. SELECTOR DE UBICACIÓN */}
        <section id="puertos" className="scroll-mt-24">
          <SelectorUbicacion
            ubicacionActual={ubicacionSeleccionada}
            onCambiarUbicacion={setUbicacionSeleccionada}
          />
        </section>

        {/* 2. CONDICIONES Y FASE LUNAR */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          <div id="condiciones" className="lg:col-span-2 scroll-mt-24">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-lg p-6">
              <CondicionesActuales ubicacionSeleccionada={ubicacionSeleccionada} />
            </div>
          </div>
          <div id="luna" className="scroll-mt-24">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-lg p-6">
              <TarjetaFaseLunar />
            </div>
          </div>
        </div>

      </div>
    </PlantillaPrincipal>
  );
};

export default App;
