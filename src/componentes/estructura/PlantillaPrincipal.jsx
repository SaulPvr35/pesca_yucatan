import React from 'react';
import { Cabecera } from './Cabecera';
import { PieDePagina } from './PieDePagina';

/**
 * Envoltorio principal de la plantilla
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export const PlantillaPrincipal = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Cabecera />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
      <PieDePagina />
    </div>
  );
};
