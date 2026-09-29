import { useState } from 'react';
import { PUERTOS_YUCATAN, PUERTO_POR_DEFECTO } from './data/ports';
import { SelectorUbicacion } from './componentes/modulos/SelectorUbicacion';
import { CondicionesActuales } from './componentes/modulos/CondicionesActuales';
import { TarjetaFaseLunar } from './componentes/modulos/TarjetaFaseLunar';

/**
 * Componente Principal de la Aplicación Pesca Yucatán.
 * Orquesta la selección de puertos, el Semáforo de Pesca y el Calendario Solunar en tiempo real.
 */
export const App = () => {
  // Inicializamos con el puerto por defecto (Progreso - Muelle de Chocolate)
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState(
    PUERTO_POR_DEFECTO || PUERTOS_YUCATAN[0]
  );

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-text py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Cabecera descriptiva de la aplicación */}
        <header className="mb-6 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Golfo de México • Península de Yucatán
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-text tracking-tight mt-0.5">
            Pesca Yucatán
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Semáforo de pesca y condiciones de oleaje en tiempo real
          </p>
        </header>

        {/* 1. Selector interactivo de ubicación (13 puntos de Poniente a Oriente) */}
        <SelectorUbicacion
          ubicacionActual={ubicacionSeleccionada}
          onCambiarUbicacion={setUbicacionSeleccionada}
        />

        {/* 2. Panel y Semáforo de Pesca en tiempo real */}
        <CondicionesActuales
          ubicacionSeleccionada={ubicacionSeleccionada}
        />

        {/* 3. Indicador Solunar de Fase Lunar y Probabilidad de Pique */}
        <TarjetaFaseLunar />
      </div>
    </main>
  );
};

export default App;
