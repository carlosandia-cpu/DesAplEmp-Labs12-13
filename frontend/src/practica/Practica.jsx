import { useCallback, useRef, useState } from 'react'
import { productos } from './datos'
import Catalogo from './Catalogo'
import Carrito from './Carrito'
import Buscador from './Buscador'
import Aviso from './Aviso'
export default function Practica() {
  const [carrito, setCarrito] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [aviso, setAviso] = useState(null)
  const secuencia = useRef(0)
  const cerrarAviso = useCallback(() => setAviso(null), [])
  function agregarAlCarrito(producto) {
    if (producto.stock === 0) return
    console.log('Agregar:', producto.nombre)
    setCarrito(actual => actual.some(linea => linea.id === producto.id)
      ? actual.map(linea => linea.id === producto.id ? { ...linea, cantidad: linea.cantidad + 1 } : linea)
      : [...actual, { id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: 1 }])
    secuencia.current += 1
    setAviso({ id: secuencia.current, nombre: producto.nombre })
  }
  function quitarDelCarrito(id) { setCarrito(actual => actual.filter(linea => linea.id !== id)) }
  function vaciarCarrito() { setCarrito([]) }
  const filtrados = productos.filter(producto => producto.nombre.toLowerCase().includes(busqueda.trim().toLowerCase()))
  return <section>
    <h1>Mini catálogo con carrito</h1>
    <Buscador valor={busqueda} onCambiar={setBusqueda} />
    {aviso && <Aviso key={aviso.id} nombre={aviso.nombre} onCerrar={cerrarAviso} />}
    <div className="catalogo-carrito">
      <Catalogo productos={filtrados} onAgregar={agregarAlCarrito} />
      <Carrito lineas={carrito} onQuitar={quitarDelCarrito} onVaciar={vaciarCarrito} />
    </div>
  </section>
}
