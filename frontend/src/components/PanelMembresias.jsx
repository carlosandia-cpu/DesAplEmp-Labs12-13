import { useEffect, useState } from 'react'
import { membresias as iniciales, clientes } from '../datos'
import MembresiaLista from './MembresiaLista'
import MembresiaForm from './MembresiaForm'
import MembresiaResumen from './MembresiaResumen'
import MembresiaBuscador from './MembresiaBuscador'
export default function PanelMembresias() {
  const [membresias, setMembresias] = useState(iniciales)
  const [busqueda, setBusqueda] = useState('')
  useEffect(() => {
    const anterior = document.title
    document.title = `Membresías (${membresias.length}) — GymManager`
    return () => { document.title = anterior }
  }, [membresias.length])
  function guardarMembresia(registro) {
    setMembresias(actuales => [...actuales, { ...registro, id: Math.max(0, ...actuales.map(item => item.id)) + 1 }])
    setBusqueda('')
  }
  function eliminarMembresia(id) { setMembresias(actuales => actuales.filter(item => item.id !== id)) }
  function renovarMembresia(id) {
    setMembresias(actuales => actuales.map(item => {
      if (item.id !== id) return item
      // Renovar extiende 30 días la fecha final existente, sin inventar campos de API.
      const fecha = new Date(`${item.fecha_fin}T00:00:00Z`)
      fecha.setUTCDate(fecha.getUTCDate() + 30)
      return { ...item, fecha_fin: fecha.toISOString().slice(0, 10) }
    }))
  }
  const filtradas = membresias.filter(item => item.tipo.toLowerCase().includes(busqueda.trim().toLowerCase()))
  return <section aria-label="Panel de membresías">
    <h1>Gestión de membresías</h1>
    <MembresiaResumen registros={membresias} />
    <MembresiaBuscador valor={busqueda} onCambiar={setBusqueda} />
    <p className="resumen">{filtradas.length} de {membresias.length} membresías</p>
    <MembresiaLista registros={filtradas} clientes={clientes} onEliminar={eliminarMembresia} onRenovar={renovarMembresia} />
    <MembresiaForm clientes={clientes} onGuardar={guardarMembresia} />
  </section>
}
