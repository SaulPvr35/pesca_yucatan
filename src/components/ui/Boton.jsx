/**
 * Componente Botón reutilizable con diseño Mobile-First y variantes de estilo.
 *
 * @param {Object} props
 * @param {'primario' | 'secundario' | 'primaria' | 'secundaria' | 'contorno'} [props.variante='primario'] - Variante visual del botón.
 * @param {import('react').ReactNode} props.children - Contenido interno del botón.
 * @param {string} [props.className=''] - Clases adicionales de Tailwind para personalización.
 * @param {() => void} [props.onClick] - Manejador de evento de clic.
 * @param {boolean} [props.disabled=false] - Estado deshabilitado.
 * @param {'button' | 'submit' | 'reset'} [props.type='button'] - Tipo de botón HTML.
 */
export const Boton = ({
  children,
  variante = 'primario',
  className = '',
  onClick,
  disabled = false,
  type = 'button',
  ...props
}) => {
  // Mobile-first: touch-target mínimo de 44px de alto, feedback táctil activo y transiciones suaves
  const estilosBase =
    'inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-xl font-medium text-sm sm:text-base tracking-wide transition-all duration-200 cursor-pointer select-none active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed';

  const variantes = {
    primario:
      'bg-primary text-white shadow-sm hover:bg-primary/90 hover:shadow active:bg-primary/95',
    primaria:
      'bg-primary text-white shadow-sm hover:bg-primary/90 hover:shadow active:bg-primary/95',
    secundario:
      'bg-secondary text-primary font-semibold hover:bg-secondary/80 border border-secondary/60 active:bg-secondary/90',
    secundaria:
      'bg-secondary text-primary font-semibold hover:bg-secondary/80 border border-secondary/60 active:bg-secondary/90',
    contorno:
      'border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white',
  };

  const estiloSeleccionado = variantes[variante] || variantes.primario;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${estilosBase} ${estiloSeleccionado} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
