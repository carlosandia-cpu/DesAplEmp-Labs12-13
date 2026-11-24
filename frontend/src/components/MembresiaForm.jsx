import { useState } from 'react'
export default function MembresiaForm({ clientes, onGuardar }) {
  const [tipo, setTipo] = useState('')
  const [precio, setPrecio] = useState('')
  const [cliente, setCliente] = useState('')
  const [inicio, setInicio] = useState('')
  const [fin, setFin] = useState('')
  const [error, setError] = useState('')
  function guardar(evento) {
    evento.preventDefault()
    if (!tipo.trim() || !precio.trim() || !inicio || !fin) {
      setError('Completa el tipo, el precio y las fechas.'); return
    }
    // Reglas de MembresiaSerializer y de los campos de Membresia.
    if (!Number.isFinite(Number(precio)) || Number(precio) <= 0) {
      setError('El precio debe ser mayor que cero.'); return
    }
    if (tipo.trim().length > 50) { setError('El tipo admite hasta 50 caracteres.'); return }
    if (Number(precio) > 999999.99 || !/^\d+(\.\d{1,2})?$/.test(precio)) {
      setError('Ingresa un importe de hasta 999999.99 con máximo dos decimales.'); return
    }
    // Conserva también la validación de fechas del formulario de Semana 10.
    if (fin < inicio) { setError('La fecha final debe ser igual o posterior a la inicial.'); return }
    onGuardar({ tipo: tipo.trim(), precio: Number(precio).toFixed(2), cliente: cliente ? Number(cliente) : null, fecha_inicio: inicio, fecha_fin: fin })
    setTipo(''); setPrecio(''); setCliente(''); setInicio(''); setFin(''); setError('')
  }
  return <form onSubmit={guardar} noValidate className="formulario">
    <h2>Nueva membresía</h2><div className="campos">
      <label>Tipo<input value={tipo} maxLength={50} onChange={e => setTipo(e.target.value)} required /></label>
      <label>Precio (S/)<input type="number" step="0.01" value={precio} onChange={e => setPrecio(e.target.value)} required /></label>
      <label>Cliente<select value={cliente} onChange={e => setCliente(e.target.value)}><option value="">Sin asignar</option>{clientes.map(persona => <option key={persona.id} value={persona.id}>{persona.nombre}</option>)}</select></label>
      <label>Fecha de inicio<input type="date" value={inicio} onChange={e => setInicio(e.target.value)} required /></label>
      <label>Fecha de fin<input type="date" value={fin} onChange={e => setFin(e.target.value)} required /></label>
    </div>
    {error && <p className="error" role="alert">{error}</p>}
    <button type="submit">Agregar membresía</button>
  </form>
}
