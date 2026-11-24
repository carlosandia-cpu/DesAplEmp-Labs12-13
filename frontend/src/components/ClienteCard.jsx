import Tarjeta from './Tarjeta'
import InscripcionItem from './InscripcionItem'

// Ejercicio 5: Cliente 1:N InscripcionClase. Las props solo se consultan.
// Para la evidencia temporal, en desarrollo se puede recibir `props` e intentar
// props.nombre = 'Otro nombre': React congela el objeto de props y lanza TypeError.
// Retirar ese intento antes de verificar lint, build y la consola sin advertencias.
export default function ClienteCard({ nombre, inscripciones = [] }) {
  const total = inscripciones.reduce((suma, item) => suma + item.sesiones * Number(item.precio_sesion), 0)
  return <Tarjeta titulo={nombre}>
    <h4>Inscripciones</h4>
    {inscripciones.length === 0 ? <p className="vacio">Sin inscripciones</p> :
      <ul className="sublista">{inscripciones.map(item => <InscripcionItem key={item.id} nombre={item.clase} estado={item.estado} sesiones={item.sesiones} precioSesion={item.precio_sesion} />)}</ul>}
    <p className="total">Total: S/ {total.toFixed(2)}</p>
  </Tarjeta>
}
