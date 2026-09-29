export const PieDePagina = () => {
  return (
    <footer className="bg-gradient-to-t from-slate-950 via-sky-950 to-teal-950 text-slate-300 py-10 border-t border-slate-800 mt-auto">
      <div className="container mx-auto px-6 text-center text-sm space-y-3">
        <p className="font-bold text-white tracking-wide">Go Pesca Yucatán — Reportes marinos y solunares para la costa esmeralda.</p>
        <p className="text-slate-400 text-xs">Desarrollado para una navegación segura, deportiva y sustentable en el Golfo de México.</p>
        <p className="text-slate-500 text-xs pt-4">&copy; {new Date().getFullYear()} Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};