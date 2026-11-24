export default function MembresiaFila({ membresia, cliente, onEliminar, onRenovar }) {
  return <article className="tarjeta">
    <h3>{membresia.tipo}</h3><p>{cliente || 'Sin asignar'}</p>
    <p className="importe">S/ {Number(membresia.precio).toFixed(2)}</p>
    <p>{membresia.fecha_inicio} al {membresia.fecha_fin}</p>
    <div className="acciones">
      <button onClick={() => onRenovar(membresia.id)}>Renovar 30 días</button>
      <button className="secundario" onClick={() => onEliminar(membresia.id)}>Eliminar</button>
    </div>
  </article>
}
