import { useEffect, useState } from 'react'
import { api, comoLista, mensajeError } from '../api'
import ClaseAPILista from './ClaseAPILista'

const FORM_VACIO = { nombre: '', horario: '', cupos_disponibles: '20', entrenador: '', sala: '' }
function paraCampoFecha(valor) {
  if (!valor) return ''
  const fecha = new Date(valor)
  if (Number.isNaN(fecha.getTime())) return String(valor).slice(0, 16)
  const local = new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 16)
}
function mostrarFecha(valor) {
  if (!valor) return ''
  return new Date(valor).toLocaleString('es-PE')
}

// LAB 12 - PARTE 2: panel propio de GymManager, con datos reales de Django.
export default function PanelClasesAPI() {
  const [registros, setRegistros] = useState([])
  const [entrenadores, setEntrenadores] = useState([])
  const [salas, setSalas] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [salaFiltro, setSalaFiltro] = useState('')
  const [orden, setOrden] = useState('nombre')
  const [recarga, setRecarga] = useState(0)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [errorOpciones, setErrorOpciones] = useState('')
  const [errorFormulario, setErrorFormulario] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [form, setForm] = useState(FORM_VACIO)
  const [editandoId, setEditandoId] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    async function cargarOpciones() {
      try {
        const [respEntrenadores, respSalas] = await Promise.all([
          api.get('/entrenadores/', { signal: controller.signal }),
          api.get('/salas/', { signal: controller.signal }),
        ])
        if (!controller.signal.aborted) {
          setEntrenadores(comoLista(respEntrenadores.data))
          setSalas(comoLista(respSalas.data))
        }
      } catch (err) {
        if (!controller.signal.aborted) setErrorOpciones(mensajeError(err))
      }
    }
    cargarOpciones()
    return () => controller.abort()
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    async function cargarClases() {
      setCargando(true)
      setError('')
      try {
        const params = { ordering: orden }
        if (busqueda.trim()) params.search = busqueda.trim()
        if (salaFiltro) params.sala = salaFiltro
        const respuesta = await api.get('/clases/', { params, signal: controller.signal })
        if (!controller.signal.aborted) setRegistros(comoLista(respuesta.data))
      } catch (err) {
        if (!controller.signal.aborted) setError(mensajeError(err))
      } finally {
        if (!controller.signal.aborted) setCargando(false)
      }
    }
    cargarClases()
    return () => controller.abort()
  }, [busqueda, salaFiltro, orden, recarga])

  function cambiar(campo, valor) {
    setForm(actual => ({ ...actual, [campo]: valor }))
  }
  function editar(item) {
    setEditandoId(item.id)
    setForm({
      nombre: item.nombre,
      horario: paraCampoFecha(item.horario),
      cupos_disponibles: String(item.cupos_disponibles),
      entrenador: String(item.entrenador),
      sala: item.sala == null ? '' : String(item.sala),
    })
    setErrorFormulario('')
    setMensaje('')
  }
  function cancelar() {
    setForm(FORM_VACIO)
    setEditandoId(null)
    setErrorFormulario('')
  }
  async function guardar(evento) {
    evento.preventDefault()
    setErrorFormulario('')
    setMensaje('')
    setGuardando(true)
    const datos = {
      nombre: form.nombre,
      horario: form.horario ? new Date(form.horario).toISOString() : '',
      cupos_disponibles: Number(form.cupos_disponibles),
      entrenador: form.entrenador ? Number(form.entrenador) : null,
      sala: form.sala ? Number(form.sala) : null,
    }
    try {
      if (editandoId == null) {
        const respuesta = await api.post('/clases/', datos) // POST -> 201
        setRegistros(actuales => [...actuales, respuesta.data])
        setMensaje(`Clase creada: ${respuesta.data.nombre} (ID ${respuesta.data.id}).`)
      } else {
        const respuesta = await api.patch(`/clases/${editandoId}/`, datos) // PATCH -> 200
        setRegistros(actuales => actuales.map(item => item.id === editandoId ? respuesta.data : item))
        setMensaje(`Clase ${editandoId} actualizada.`)
      }
      setForm(FORM_VACIO)
      setEditandoId(null)
      setRecarga(actual => actual + 1)
    } catch (err) {
      setErrorFormulario(mensajeError(err)) // DRF: errores 400 de validate_nombre
    } finally {
      setGuardando(false)
    }
  }
  async function eliminar(id) {
    if (!window.confirm(`¿Seguro que deseas eliminar la clase ${id}?`)) return
    setErrorFormulario('')
    setMensaje('')
    try {
      await api.delete(`/clases/${id}/`) // DELETE -> 204
      setRegistros(actuales => actuales.filter(item => item.id !== id))
      setMensaje(`Clase ${id} eliminada.`)
    } catch (err) {
      setErrorFormulario(mensajeError(err)) // incluye 404
    }
  }
  const cuposTotales = registros.reduce((suma, item) => suma + Number(item.cupos_disponibles), 0)
  const nombreEntrenador = id => entrenadores.find(e => e.id === id)?.nombre || `ID ${id}`
  const nombreSala = id => salas.find(s => s.id === id)?.nombre || (id ? `Sala ${id}` : 'Sin sala')

  return <section aria-label="Lab 12 panel de clases conectado a Django">
    <h1>Lab 12 — Panel de clases (API Django)</h1>
    <p className="resumen">Los registros provienen de /api/clases/. GET, POST, PATCH y DELETE mediante Axios.</p>
    <div className="resumen-panel">
      <p>Clases recibidas <strong>{registros.length}</strong></p>
      <p>Cupos disponibles <strong>{cuposTotales}</strong></p>
      <p>Promedio de cupos <strong>{registros.length ? (cuposTotales / registros.length).toFixed(1) : '0'}</strong></p>
    </div>
    <div className="formulario">
      <h2>Buscar y filtrar desde Django</h2>
      <div className="campos">
        <label>Buscar (?search=)<input value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Yoga" type="search" /></label>
        <label>Sala (?sala=)<select value={salaFiltro} onChange={e => setSalaFiltro(e.target.value)}>
          <option value="">Todas las salas</option>{salas.map(item => <option key={item.id} value={item.id}>{item.nombre}</option>)}
        </select></label>
        <label>Ordenar (?ordering=)<select value={orden} onChange={e => setOrden(e.target.value)}>
          <option value="nombre">Nombre A-Z</option><option value="-nombre">Nombre Z-A</option>
          <option value="horario">Horario ascendente</option><option value="-horario">Horario descendente</option>
          <option value="cupos_disponibles">Cupos ascendentes</option><option value="-cupos_disponibles">Cupos descendentes</option>
        </select></label>
      </div>
      <p className="resumen">El cambio de búsqueda o filtro ejecuta otro GET con parámetros a Django.</p>
    </div>
    {cargando && <p role="status">Cargando...</p>}
    {error && <p className="error" role="alert">No se pudo cargar la lista. {error}</p>}
    {errorOpciones && <p className="error" role="alert">No se pudieron cargar entrenadores o salas: {errorOpciones}</p>}
    {!cargando && !error && <ClaseAPILista registros={registros}
      nombreEntrenador={nombreEntrenador} nombreSala={nombreSala} mostrarFecha={mostrarFecha}
      onEditar={editar} onEliminar={eliminar} />}
    <form className="formulario" onSubmit={guardar} noValidate>
      <h2>{editandoId == null ? 'Registrar clase' : `Editar clase ${editandoId}`}</h2>
      <p className="resumen">Prueba nombre «AB» para ver el error HTTP 400 del serializer.</p>
      <div className="campos">
        <label>Nombre<input value={form.nombre} onChange={e => cambiar('nombre', e.target.value)} placeholder="Pilates" /></label>
        <label>Horario<input type="datetime-local" value={form.horario} onChange={e => cambiar('horario', e.target.value)} /></label>
        <label>Cupos<input type="number" min="0" value={form.cupos_disponibles} onChange={e => cambiar('cupos_disponibles', e.target.value)} /></label>
        <label>Entrenador<select value={form.entrenador} onChange={e => cambiar('entrenador', e.target.value)}>
          <option value="">Seleccionar entrenador</option>{entrenadores.map(e => <option value={e.id} key={e.id}>{e.nombre}</option>)}
        </select></label>
        <label>Sala<select value={form.sala} onChange={e => cambiar('sala', e.target.value)}>
          <option value="">Sin sala</option>{salas.map(s => <option value={s.id} key={s.id}>{s.nombre}</option>)}
        </select></label>
      </div>
      {entrenadores.length === 0 && !errorOpciones && <p className="resumen">No hay entrenadores. Puedes crear uno en Django Admin o usar el comando cargar_demo_lab12 del README.</p>}
      {errorFormulario && <p className="error" role="alert">{errorFormulario}</p>}
      {mensaje && <p className="exito" role="status">{mensaje}</p>}
      <div className="acciones"><button disabled={guardando} type="submit">{guardando ? 'Guardando...' : editandoId == null ? 'Crear (POST)' : 'Guardar cambios (PATCH)'}</button>
      {editandoId != null && <button type="button" className="secundario" onClick={cancelar}>Cancelar edición</button>}</div>
    </form>
  </section>
}
