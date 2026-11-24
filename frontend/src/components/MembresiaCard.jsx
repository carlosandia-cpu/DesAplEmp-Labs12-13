import { useState } from 'react'
import Tarjeta from './Tarjeta'

// Ejercicios 2, 3 y 6: props desestructuradas, valor por defecto y contador local.
export default function MembresiaCard({ nombre, precio, fechaInicio, fechaFin, cliente = 'Sin asignar' }) {
  const [selecciones, setSelecciones] = useState(0)
  // Se usa el periodo del registro para permitir solo membresías vigentes.
  const [hoy] = useState(() => {
    const fecha = new Date()
    return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`
  })
  const vigente = hoy >= fechaInicio && hoy <= fechaFin
  return (
    <Tarjeta titulo={nombre}>
      <p>{cliente}</p>
      <p className="importe">S/ {Number(precio).toFixed(2)}</p>
      <p>{fechaInicio} al {fechaFin}</p>
      <span className={`badge ${vigente ? 'ok' : 'agotado'}`}>{vigente ? 'Vigente' : 'Fuera de vigencia'}</span>
      <div className="acciones">
        <button disabled={!vigente} onClick={() => setSelecciones(actual => actual + 1)}>Seleccionar membresía</button>
        {selecciones > 0 && <span role="status">Selecciones: {selecciones}</span>}
      </div>
    </Tarjeta>
  )
}
