
import { useEffect, useState } from 'react'
import { api, comoLista, mensajeError } from '../api'

export default function ProductosPage() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function cargarProductos() {
      try {
        setCargando(true)
        setError('')

        const respuesta = await api.get('/productos/', {
          signal: controller.signal,
        })

        if (!controller.signal.aborted) {
          setProductos(comoLista(respuesta.data))
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(mensajeError(err))
        }
      } finally {
        if (!controller.signal.aborted) {
          setCargando(false)
        }
      }
    }

    cargarProductos()

    return () => controller.abort()
  }, [])

  if (cargando) return <p>Cargando productos...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <section>
      <h2>Catálogo de productos</h2>

      {productos.length === 0 ? (
        <p>No hay productos registrados.</p>
      ) : (
        <ul>
          {productos.map((producto) => (
            <li key={producto.id}>
              <strong>{producto.nombre}</strong>
              {' — S/ '}
              {producto.precio}
              {' — Stock: '}
              {producto.stock}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
