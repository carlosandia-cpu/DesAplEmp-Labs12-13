
import { useEffect, useState } from 'react'
import { api, mensajeError } from '../api'

export default function CursoDetallePage({ cursoId, onVolver }) {
  const [curso, setCurso] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function cargarDetalle() {
      setCargando(true)
      setError('')

      try {
        const respuesta = await api.get(`/cursos/${cursoId}/`, {
          signal: controller.signal,
        })

        if (!controller.signal.aborted) {
          setCurso(respuesta.data)
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

    cargarDetalle()
    return () => controller.abort()
  }, [cursoId])

  return (
    <section>
      <button type="button" onClick={onVolver}>
        ← Volver al catálogo
      </button>

      {cargando && <p>Cargando información del curso...</p>}

      {error && <p role="alert">Error: {error}</p>}

      {!cargando && !error && curso && (
        <article className="tarjeta">
          <h1>{curso.titulo}</h1>

          <p>
            {curso.descripcion || 'Curso de formación educativa de SmartIA.'}
          </p>

          <p><strong>Código:</strong> {curso.id}</p>
          <p><strong>Precio:</strong> S/ {curso.precio}</p>
          <p>
            <strong>Cupos disponibles:</strong>{' '}
            {curso.cupos_disponibles}
          </p>
          <p>
            <strong>Estado:</strong>{' '}
            {curso.activo ? 'Activo' : 'Inactivo'}
          </p>
        </article>
      )}
    </section>
  )
}
