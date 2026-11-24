import { useState } from 'react'
import Tarjeta from './Tarjeta'
import InscripcionItem from './InscripcionItem'

// Ejercicios 10, 11 y 12: cada clase conserva su propio estado.
export default function ClaseCard({ nombre, horario, cuposDisponibles, entrenador = 'Sin asignar', inscripciones = [] }) {
  const [reservas, setReservas] = useState(0)
  const disponibles = cuposDisponibles - reservas
  const total = inscripciones.reduce((suma, item) => suma + item.sesiones * Number(item.precio_sesion), 0)
  return <Tarjeta titulo={nombre}>
    <p>{horario} · {entrenador}</p>
    <span className={`badge ${disponibles > 0 ? 'ok' : 'agotado'}`}>{disponibles > 0 ? `Cupos: ${disponibles}` : 'Sin cupos'}</span>
    {disponibles > 0 && disponibles <= 3 && <span className="badge alerta">¡Últimos cupos!</span>}
    <div className="acciones"><button disabled={disponibles === 0} onClick={() => setReservas(actual => actual + 1)}>Reservar cupo</button>
      {reservas > 0 && <span role="status">Reservas: {reservas}</span>}</div>
    <h4>Inscripciones</h4>
    {inscripciones.length === 0 ? <p className="vacio">Sin inscripciones</p> :
      <ul className="sublista">{inscripciones.map(item => <InscripcionItem key={item.id} nombre={item.cliente} estado={item.estado} sesiones={item.sesiones} precioSesion={item.precio_sesion} />)}</ul>}
    <p className="total">Total de la clase: S/ {total.toFixed(2)}</p>
  </Tarjeta>
}
