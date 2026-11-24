// Lab 12: un componente hijo muestra cada clase que llegó desde Django.
export default function ClaseAPIItem({ item, nombreEntrenador, nombreSala, mostrarFecha, onEditar, onEliminar }) {
  return <article className="tarjeta">
    <h3>{item.nombre} — ID {item.id}</h3>
    <p>Horario: {mostrarFecha(item.horario)}</p>
    <p>Entrenador: {nombreEntrenador(item.entrenador)}</p>
    <p>Sala: {nombreSala(item.sala)}</p>
    <p>Cupos disponibles: {item.cupos_disponibles}</p>
    <div className="acciones">
      <button type="button" onClick={() => onEditar(item)}>Editar</button>
      <button type="button" className="secundario" onClick={() => onEliminar(item.id)}>Eliminar</button>
    </div>
  </article>
}
