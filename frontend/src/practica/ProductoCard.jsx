export default function ProductoCard({ producto, onAgregar }) {
  return <article className="tarjeta">
    <h3>{producto.nombre}</h3>
    <p className="importe">S/ {Number(producto.precio).toFixed(2)}</p>
    <p>Stock: {producto.stock}</p>
    {producto.stock === 0 && <p className="badge agotado">Agotado</p>}
    <div><button disabled={producto.stock === 0} onClick={() => onAgregar(producto)}>Agregar</button></div>
  </article>
}
