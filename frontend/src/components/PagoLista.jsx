import { useState } from 'react'
import PagoCard from './PagoCard'

// Ejercicios 10 y 12: el estado y los eventos permanecen en este componente.
export default function PagoLista({ registros, clientes, membresias }) {
  const [pagos, setPagos] = useState(registros)
  const [cliente, setCliente] = useState('')
  const [membresia, setMembresia] = useState('')
  const [monto, setMonto] = useState('')
  const [fecha, setFecha] = useState('')
  const [metodo, setMetodo] = useState('')
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  function agregarPago(event) {
    event.preventDefault()
    setMensaje('')
    if (!monto.trim() || !fecha || !metodo.trim()) { setError('Completa el monto, la fecha y el método de pago.'); return }
    // Misma regla que PagoSerializer.validate_monto (Semana 8).
    if (!Number.isFinite(Number(monto)) || Number(monto) <= 0) { setError('El monto debe ser mayor que cero.'); return }
    if (Number(monto) > 999999.99 || !/^\d+(\.\d{1,2})?$/.test(monto)) { setError('Ingresa un importe de hasta 999999.99 con máximo dos decimales.'); return }
    const nuevo = { id: Math.max(0, ...pagos.map(item => item.id)) + 1, cliente: cliente ? Number(cliente) : null, membresia: membresia ? Number(membresia) : null, monto: Number(monto).toFixed(2), fecha, metodo_pago: metodo.trim() }
    setPagos(actuales => [...actuales, nuevo])
    setCliente(''); setMembresia(''); setMonto(''); setFecha(''); setMetodo(''); setError('')
    setMensaje('Pago agregado a la lista.')
  }

  return <section aria-label="Pagos"><h2>Pagos</h2>
    <p className="resumen">{pagos.length} pagos · Total: S/ {pagos.reduce((suma, pago) => suma + Number(pago.monto), 0).toFixed(2)}</p>
    {pagos.length === 0 ? <p className="vacio">No hay pagos</p> : <div className="rejilla">{pagos.map(pago => <PagoCard key={pago.id} cliente={clientes.find(persona => persona.id === pago.cliente)?.nombre} monto={pago.monto} fecha={pago.fecha} metodoPago={pago.metodo_pago} />)}</div>}
    <form onSubmit={agregarPago} noValidate className="formulario"><h3>Nuevo pago</h3><div className="campos">
      <label>Cliente<select value={cliente} onChange={e => setCliente(e.target.value)}><option value="">Sin asignar</option>{clientes.map(persona => <option key={persona.id} value={persona.id}>{persona.nombre}</option>)}</select></label>
      <label>Membresía<select value={membresia} onChange={e => setMembresia(e.target.value)}><option value="">Sin asignar</option>{membresias.map(item => <option key={item.id} value={item.id}>{item.tipo}</option>)}</select></label>
      <label>Monto (S/)<input type="number" step="0.01" value={monto} onChange={e => setMonto(e.target.value)} required /></label>
      <label>Fecha<input type="date" value={fecha} onChange={e => setFecha(e.target.value)} required /></label>
      <label>Método de pago<input maxLength={50} value={metodo} onChange={e => setMetodo(e.target.value)} required /></label>
    </div>{error && <p className="error" role="alert">{error}</p>}{mensaje && <p className="exito" role="status">{mensaje}</p>}<button type="submit">Agregar pago</button></form>
  </section>
}
