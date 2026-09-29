export const Cabecera = () => {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-sky-950 via-cyan-900 to-emerald-900 text-white shadow-xl backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-500 text-slate-950 px-2.5 py-1 rounded-xl font-black text-lg shadow-md">GO</span>
          <span className="font-black text-xl tracking-tight">PESCA YUCATÁN</span>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-semibold">
          <a href="#puertos" className="hover:text-emerald-400 transition-colors">Puertos</a>
          <a href="#condiciones" className="hover:text-emerald-400 transition-colors">Condiciones</a>
          <a href="#especies" className="hover:text-emerald-400 transition-colors">Especies</a>
          <a href="#licencia" className="hover:text-emerald-400 transition-colors">Licencia</a>
        </nav>
      </div>
    </header>
  );
};