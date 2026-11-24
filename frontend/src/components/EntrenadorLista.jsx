import EntrenadorCard from './EntrenadorCard'
export default function EntrenadorLista({ registros }) {
  return <section><h2>Entrenadores</h2>{registros.length === 0 ? <p className="vacio">No hay entrenadores</p> : <ul className="lista entrenadores">{registros.map(entrenador => <EntrenadorCard key={entrenador.id} {...entrenador} />)}</ul>}</section>
}
