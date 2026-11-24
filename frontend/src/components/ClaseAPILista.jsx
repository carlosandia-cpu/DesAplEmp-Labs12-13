import ClaseAPIItem from './ClaseAPIItem'

// Lab 12: recibe el estado del padre mediante props, recorre con map y key.
export default function ClaseAPILista({ registros, nombreEntrenador, nombreSala, mostrarFecha, onEditar, onEliminar }) {
  if (registros.length === 0) return <p className="vacio">No hay clases para estos filtros.</p>
  return <div className="rejilla">
    {registros.map(item => <ClaseAPIItem key={item.id} item={item}
      nombreEntrenador={nombreEntrenador} nombreSala={nombreSala} mostrarFecha={mostrarFecha}
      onEditar={onEditar} onEliminar={onEliminar} />)}
  </div>
}
