import React from 'react';

/**
 * Componente Pie de Página
 */
export const PieDePagina = () => {
  return (
    <footer className="bg-text text-white p-4 mt-auto">
      <div className="container mx-auto text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Pesca Yucatán. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};
