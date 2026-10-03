import { useState } from 'react';
import { PUERTOS_YUCATAN, PUERTO_POR_DEFECTO } from './data/ports';
import { useClima } from './hooks/usarClima';
import { PlantillaPrincipal } from './components/estructura/PlantillaPrincipal';
import { SelectorUbicacion } from './components/modulos/SelectorUbicacion';
import { CondicionesActuales } from './components/modulos/CondicionesActuales';
import { PlanificadorSemanal } from './components/modulos/PlanificadorSemanal';
import { CatalogoPeces } from './components/modulos/CatalogoPeces';

export const App = () => {
  const [pestanaActiva, setPestanaActiva] = useState('pronostico');
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState(
    PUERTO_POR_DEFECTO || PUERTOS_YUCATAN[0]
  );

  // Consulta de clima compartida de nivel superior
  const { datos: datosClima } = useClima(ubicacionSeleccionada);

  return (
    <PlantillaPrincipal pestanaActiva={pestanaActiva} onCambiarPestana={setPestanaActiva}>
      {/* ── HERO PRINCIPAL RESPONSIVE ── */}
      <section
        className="relative overflow-hidden rounded-2xl shadow-lg mb-6 sm:mb-10 min-h-[320px] sm:min-h-[380px] bg-cover bg-center flex flex-col justify-center items-center text-center px-4 sm:px-8 py-8 sm:py-12 border border-slate-700/60"
        style={{ backgroundImage: "url('/pogreso.jpg')" }}
      >
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[1px]" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-slate-300 text-[10px] sm:text-xs font-semibold tracking-wider uppercase backdrop-blur-md">
            Información Marítima Oficial y Solunar
          </span>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-snug sm:leading-tight">
            {pestanaActiva === 'pronostico' ? (
              <>Pronóstico de Pesca y Condiciones Marinas en <span className="text-emerald-400">Yucatán</span></>
            ) : (
              <>Guía de Peces y Especies Marinas de <span className="text-emerald-400">Yucatán</span></>
            )}
          </h1>
          <p className="text-xs sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            {pestanaActiva === 'pronostico'
              ? 'Plataforma de consulta técnica de oleaje, viento, mareas astronómicas y seguridad náutica para embarcaciones ribereñas y pesca deportiva.'
              : 'Fichas biológicas, hábitats, temporadas de veda, técnicas de pesca y distribución en la costa yucateca y Banco de Campeche.'}
          </p>
          <div className="pt-2 sm:pt-3">
            {pestanaActiva === 'pronostico' ? (
              <a
                href="#puertos"
                className="inline-flex items-center justify-center px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                Consultar Puertos
              </a>
            ) : (
              <button
                onClick={() => setPestanaActiva('pronostico')}
                className="inline-flex items-center justify-center px-6 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md border border-slate-700 transition-all active:scale-95 cursor-pointer"
              >
                Regresar al Pronóstico
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── CONTENIDO DINÁMICO SEGÚN PESTAÑA ACTIVA ── */}
      {pestanaActiva === 'pronostico' ? (
        <div className="w-full space-y-8 sm:space-y-10">
          {/* 1. SELECTOR DE UBICACIÓN Y PUERTOS */}
          <section id="puertos" className="scroll-mt-20">
            <SelectorUbicacion
              ubicacionActual={ubicacionSeleccionada}
              onCambiarUbicacion={setUbicacionSeleccionada}
            />
          </section>

          {/* 2. CONDICIONES ACTUALES + VEREDICTO + FACTORES & ASTRONOMÍA LUNAR */}
          <section id="condiciones" className="scroll-mt-20">
            <CondicionesActuales ubicacionSeleccionada={ubicacionSeleccionada} />
          </section>

          {/* 3. PLANIFICADOR SEMANAL DE SALIDAS */}
          {datosClima && (
            <section id="planificador" className="scroll-mt-20">
              <PlanificadorSemanal
                datosClima={datosClima}
                ubicacionSeleccionada={ubicacionSeleccionada}
              />
            </section>
          )}
        </div>
      ) : (
        /* PESTAÑA: CATÁLOGO DE PECES */
        <section id="peces" className="scroll-mt-20">
          <CatalogoPeces />
        </section>
      )}
    </PlantillaPrincipal>
  );
};

export default App;
