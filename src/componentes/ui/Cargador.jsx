/**
 * Componente Cargador (Spinner) animado con SVG accesible que utiliza el color Primario del sistema.
 *
 * @param {Object} props
 * @param {'sm' | 'md' | 'lg'} [props.tamanio='md'] - Escala del spinner.
 * @param {string} [props.texto] - Mensaje de carga opcional visible junto al spinner.
 * @param {string} [props.className=''] - Clases adicionales de Tailwind para el contenedor.
 */
export const Cargador = ({
  tamanio = 'md',
  texto = '',
  className = '',
  ...props
}) => {
  const tamanioDimensiones = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const dimensionSvg = tamanioDimensiones[tamanio] || tamanioDimensiones.md;

  return (
    <div
      role="status"
      aria-label="Cargando información"
      className={`inline-flex flex-col sm:flex-row items-center justify-center gap-2.5 ${className}`}
      {...props}
    >
      <svg
        className={`animate-spin text-primary ${dimensionSvg}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-85"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {texto && (
        <span className="text-sm font-medium text-slate-600 animate-pulse">
          {texto}
        </span>
      )}
    </div>
  );
};
