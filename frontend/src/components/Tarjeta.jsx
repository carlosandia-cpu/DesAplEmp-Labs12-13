// Ejercicio 4: children es el contenido colocado entre las etiquetas del componente.
export default function Tarjeta({ titulo, children }) {
  return <section className="tarjeta"><h3>{titulo}</h3>{children}</section>
}
