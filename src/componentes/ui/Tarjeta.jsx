/**
 * Componente Tarjeta modular para agrupar contenido con diseño de superficie limpia,
 * bordes redondeados y sombra sutil adaptada para dispositivos móviles y escritorio.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.children - Elementos o contenido a renderizar dentro de la tarjeta.
 * @param {string} [props.className=''] - Clases utilitarias adicionales de Tailwind.
 * @param {'blanco' | 'seaLight'} [props.fondo='blanco'] - Fondo de la tarjeta (blanco puro o Sea Light sutil).
 */
export const Tarjeta = ({
  children,
  className = '',
  fondo = 'blanco',
  ...props
}) => {
  const estilosFondo = {
    blanco: 'bg-white',
    seaLight: 'bg-secondary/30',
  };

  const fondoAplicado = estilosFondo[fondo] || estilosFondo.blanco;

  return (
    <div
      className={`${fondoAplicado} rounded-2xl shadow-md border border-slate-100 p-4 sm:p-6 transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
