
import { useEffect, useState } from 'react'
import { api, comoLista, mensajeError } from '../api'
import CursoDetallePage from './CursoDetallePage'

export default function CursosPage() {
  const [cursos, setCursos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [matriculando, setMatriculando] = useState(null)
  const [recarga, setRecarga] = useState(0)
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function cargarCursos() {
      setCargando(true)
      setError('')

      try {
        const respuesta = await api.get('/cursos/', {
          params: { search: busqueda },
          signal: controller.signal,
        })

        if (!controller.signal.aborted) {
          setCursos(comoLista(respuesta.data))
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

    cargarCursos()
    return () => controller.abort()
  }, [busqueda, recarga])

  async function matricular(curso) {
    setMatriculando(curso.id)
    setMensaje('')

    try {
      const respuesta = await api.post('/matriculas/', {
        estudiante_id: 1,
        curso_id: curso.id,
        cantidad: 1,
      })

      setMensaje(
        `Matrícula exitosa en ${curso.titulo}. ` +
        `Pedido #${respuesta.data.pedido_id}. ` +
        `Total: S/ ${respuesta.data.total}. Pago simulado.`
      )

      setRecarga(actual => actual + 1)
    } catch (err) {
      setMensaje(
        err.response?.data?.error || mensajeError(err)
      )
    } finally {
      setMatriculando(null)
    }
  }

  if (cursoSeleccionado !== null) {
    return (
      <CursoDetallePage
        cursoId={cursoSeleccionado}
        onVolver={() => {
          setCursoSeleccionado(null)
          setRecarga(actual => actual + 1)
        }}
      />
    )
  }

  return (
    <section>
      <h1>SmartIA — Catálogo de cursos</h1>
      <p>Explora los cursos disponibles en nuestra plataforma educativa.</p>

      <input
        type="search"
        placeholder="Buscar cursos..."
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
        aria-label="Buscar cursos"
      />

      {mensaje && <p role="status">{mensaje}</p>}

      {cargando && <p>Cargando cursos...</p>}
      {error && <p role="alert">Error: {error}</p>}

      {!cargando && !error && cursos.length === 0 && (
        <p>No se encontraron cursos.</p>
      )}

      {!cargando && !error && (
        <div className="rejilla">
          {cursos.map(curso => (
            <article key={curso.id} className="tarjeta">
              <h3>{curso.titulo}</h3>

              <p>
                {curso.descripcion || 'Curso de formación educativa.'}
              </p>

              <p><strong>Precio:</strong> S/ {curso.precio}</p>

              <p>
                <strong>Cupos disponibles:</strong>{' '}
                {curso.cupos_disponibles}
              </p>

              <p>
                {curso.activo && curso.cupos_disponibles > 0
                  ? 'Disponible'
                  : 'No disponible'}
              </p>

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
              }}>
                <button
                  type="button"
                  onClick={() => setCursoSeleccionado(curso.id)}
                >
                  Ver detalle
                </button>

                <button
                  type="button"
                  disabled={
                    !curso.activo ||
                    curso.cupos_disponibles === 0 ||
                    matriculando !== null
                  }
                  onClick={() => matricular(curso)}
                >
                  {matriculando === curso.id
                    ? 'Procesando...'
                    : 'Matricularme'}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
