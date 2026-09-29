import React from 'react';

/**
 * Componente de la Cabecera
 */
export const Cabecera = () => {
  return (
    <header className="bg-primary text-white p-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Pesca Yucatán</h1>
        <nav>
          {/* Enlaces de navegación irán aquí */}
        </nav>
      </div>
    </header>
  );
};
