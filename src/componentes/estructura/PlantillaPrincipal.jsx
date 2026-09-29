import { useEffect, useRef } from 'react';
import { Cabecera } from './Cabecera';
import { PieDePagina } from './PieDePagina';

export const PlantillaPrincipal = ({ children }) => {
  const videoDesktopRef = useRef(null);
  const videoMobileRef = useRef(null);

  // Forzar la reproducción por código para evitar restricciones del navegador
  useEffect(() => {
    if (videoDesktopRef.current) {
      videoDesktopRef.current.play().catch(() => {});
    }
    if (videoMobileRef.current) {
      videoMobileRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col text-slate-100 relative overflow-x-hidden bg-transparent">
      
      {/* ── VIDEO PARA ESCRITORIO / HORIZONTAL ── */}
      <div className="fixed inset-0 w-full h-full overflow-hidden -z-30 pointer-events-none hidden md:block">
        <video
          ref={videoDesktopRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover scale-105 filter brightness-90 contrast-110"
        >
          <source src="/orizontal.mp4" type="video/mp4" />
        </video>
      </div>

      {/* ── VIDEO PARA MÓVIL / VERTICAL ── */}
      <div className="fixed inset-0 w-full h-full overflow-hidden -z-30 pointer-events-none block md:hidden">
        <video
          ref={videoMobileRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover scale-105 filter brightness-90 contrast-110"
        >
          <source src="/vertical.mp4" type="video/mp4" />
        </video>
      </div>

      {/* ── OVERLAY DEGRADADO (Más traslúcido para dejar brillar el video) ── */}
      <div className="fixed inset-0 bg-gradient-to-b from-sky-950/40 via-teal-950/60 to-slate-950/80 -z-20 pointer-events-none backdrop-blur-[0.5px]" />

      {/* Cabecera fija */}
      <Cabecera />

      {/* Contenido principal */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 relative z-10">
        {children}
      </main>

      {/* Pie de página */}
      <PieDePagina />
    </div>
  );
};

export default PlantillaPrincipal;