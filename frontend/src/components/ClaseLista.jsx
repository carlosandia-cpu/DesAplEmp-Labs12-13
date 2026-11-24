import { useState } from 'react'
import ClaseCard from './ClaseCard'

export default function ClaseLista({ registros, entrenadores }) {
  const [busqueda, setBusqueda] = useState('')
  const filtradas = registros.filter(clase => clase.nombre.toLowerCase().includes(busqueda.trim().toLowerCase()))
  return <section aria-label="Clases">
    <h2>Clases e inscripciones</h2>
    <label htmlFor="buscar-clase">Buscar clase</label>
    <input id="buscar-clase" type="search" value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Por ejemplo: yoga" />
    <p className="resumen">{filtradas.length} de {registros.length} clases</p>
    {filtradas.length === 0 ? <p className="vacio">No hay clases que coincidan con la búsqueda.</p> :
      <div className="rejilla">{filtradas.map(clase => <ClaseCard key={clase.id} nombre={clase.nombre} horario={clase.horario} cuposDisponibles={clase.cupos_disponibles} entrenador={entrenadores.find(e => e.id === clase.entrenador)?.nombre} inscripciones={clase.inscripciones} />)}</div>}
  </section>
}
