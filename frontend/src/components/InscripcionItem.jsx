// Conversión de precio_sesion a precioSesion realizada por el componente padre.
export default function InscripcionItem({ nombre, estado, sesiones, precioSesion }) {
  return <li><strong>{nombre}</strong><span>{estado} · {sesiones} sesiones × S/ {Number(precioSesion).toFixed(2)}</span><b>S/ {(sesiones * Number(precioSesion)).toFixed(2)}</b></li>
}
