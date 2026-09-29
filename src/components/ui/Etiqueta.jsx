/**
 * Componente Etiqueta (Badge) con forma de píldora compacta para mostrar estados,
 * alertas o categorías de forma visual y accesible.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} props.children - Texto o contenido de la etiqueta (ej. "Favorable").
 * @param {string} [props.color] - Color dinámico de Tailwind para fondo y texto (ej. "bg-green-500 text-white" o "bg-green-500").
 * @param {'Favorable' | 'Variable' | 'Precaución' | 'porDefecto'} [props.estado] - Estado semántico predefinido.
 * @param {string} [props.className=''] - Clases adicionales de Tailwind para sobrescribir o extender estilos.
 */
export const Etiqueta = ({
  children,
  color = '',
  estado,
  className = '',
  ...props
}) => {
  // Paleta predefinida semántica en armonía con el motor de condiciones y tema costero
  const estilosPorEstado = {
    Favorable: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Variable: 'bg-amber-100 text-amber-800 border-amber-200',
    Precaución: 'bg-rose-100 text-rose-800 border-rose-200',
    porDefecto: 'bg-secondary text-primary border-secondary/80',
  };

  // Si se provee un color dinámico específico por props, se utiliza con prioridad.
  // Si la clase pasada es sólo un color de fondo (ej. "bg-green-500"), agregamos contraste de texto en blanco.
  let estiloColor;
  if (color) {
    const tieneColorTexto = color.includes('text-');
    estiloColor = tieneColorTexto ? color : `${color} text-white`;
  } else if (estado && estilosPorEstado[estado]) {
    estiloColor = estilosPorEstado[estado];
  } else {
    estiloColor = estilosPorEstado.porDefecto;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold tracking-wide border shadow-2xs transition-colors select-none ${estiloColor} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
