import { useEffect, useState } from 'react'
import { api, comoLista, mensajeError } from '../api'

const VACIO = { tipo: '', precio: '', cliente: '', fecha_inicio: '', fecha_fin: '' }

// LAB 12 - PARTE 1: conexión AJAX real con la API de membresías (Semana 8).
export default function ListaPractica() {
  const [registros, setRegistros] = useState([])
  const [buscar, setBuscar] = useState('')
  const [recarga, setRecarga] = useState(0)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [errorFormulario, setErrorFormulario] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [form, setForm] = useState(VACIO)
  const [editandoId, setEditandoId] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    // useEffect no se declara async; la función async va dentro.
    async function cargarMembresias() {
      setCargando(true)
      setError('')
      try {
        const respuesta = await api.get('/membresias/', {
          params: buscar.trim() ? { search: buscar.trim() } : {},
          signal: controller.signal,
        })
        if (!controller.signal.aborted) setRegistros(comoLista(respuesta.data))
      } catch (err) {
        if (!controller.signal.aborted) setError(mensajeError(err))
      } finally {
        if (!controller.signal.aborted) setCargando(false)
      }
    }
    cargarMembresias()
    return () => controller.abort()
  }, [buscar, recarga])

  function cambiar(campo, valor) {
    setForm(anterior => ({ ...anterior, [campo]: valor }))
  }

  function editar(registro) {
    setEditandoId(registro.id)
    setForm({
      tipo: registro.tipo,
      precio: String(registro.precio),
      cliente: registro.cliente == null ? '' : String(registro.cliente),
      fecha_inicio: registro.fecha_inicio,
      fecha_fin: registro.fecha_fin,
    })
    setErrorFormulario('')
    setMensaje('')
  }

  function cancelarEdicion() {
    setEditandoId(null)
    setForm(VACIO)
    setErrorFormulario('')
  }

  async function guardar(evento) {
    evento.preventDefault()
    setErrorFormulario('')
    setMensaje('')
    setGuardando(true)
    const datos = { ...form, cliente: form.cliente ? Number(form.cliente) : null }
    try {
      if (editandoId == null) {
        const respuesta = await api.post('/membresias/', datos)
        setRegistros(anteriores => [...anteriores, respuesta.data]) // POST 201
        setMensaje(`Membresía creada (ID ${respuesta.data.id}).`)
      } else {
        const respuesta = await api.patch(`/membresias/${editandoId}/`, datos)
        setRegistros(anteriores => anteriores.map(item => item.id === editandoId ? respuesta.data : item)) // PATCH 200
        setMensaje(`Membresía ${editandoId} actualizada.`)
      }
      setEditandoId(null)
      setForm(VACIO)
      setRecarga(actual => actual + 1) // respeta los filtros del servidor
    } catch (err) {
      setErrorFormulario(mensajeError(err)) // muestra 400 de validate_precio
    } finally {
      setGuardando(false)
    }
  }

  async function eliminar(id) {
    if (!window.confirm(`¿Eliminar la membresía ${id}?`)) return
    setErrorFormulario('')
    setMensaje('')
    try {
      await api.delete(`/membresias/${id}/`) // DELETE 204
      setRegistros(anteriores => anteriores.filter(item => item.id !== id))
      setMensaje(`Membresía ${id} eliminada.`)
    } catch (err) {
      setErrorFormulario(mensajeError(err))
    }
  }

  return <section aria-label="Lab 12 práctica de membresías">
    <h1>Lab 12 — Práctica AJAX: membresías</h1>
    <p className="resumen">Consulta GET, altas POST, ediciones PATCH, bajas DELETE y búsqueda en Django.</p>
    <label htmlFor="busqueda-ajax">Buscar en la API (?search=)</label>
    <input id="busqueda-ajax" type="search" value={buscar}
      onChange={e => setBuscar(e.target.value)} placeholder="Ejemplo: Mensual" />
    <p className="resumen">La búsqueda se envía a Django; no se filtra únicamente en React.</p>
    {cargando && <p role="status">Cargando...</p>}
    {error && <p className="error" role="alert">No se pudo cargar la lista. {error}</p>}
    {!cargando && !error && registros.length === 0 && <p className="vacio">No hay registros.</p>}
    {!cargando && !error && <div className="rejilla">
      {registros.map(item => <article className="tarjeta" key={item.id}>
        <h3>{item.tipo} — ID {item.id}</h3>
        <p>Precio: S/ {Number(item.precio).toFixed(2)}</p>
        <p>Inicio: {item.fecha_inicio} | Fin: {item.fecha_fin}</p>
        <p>Cliente ID: {item.cliente ?? 'Sin asignar'}</p>
        <div className="acciones">
          <button type="button" onClick={() => editar(item)}>Editar</button>
          <button type="button" className="secundario" onClick={() => eliminar(item.id)}>Eliminar</button>
        </div>
      </article>)}
    </div>}
    <form className="formulario" onSubmit={guardar} noValidate>
      <h2>{editandoId == null ? 'Registrar membresía' : `Editar membresía ${editandoId}`}</h2>
      <div className="campos">
        <label>Tipo<input value={form.tipo} onChange={e => cambiar('tipo', e.target.value)} maxLength={50} placeholder="Mensual" /></label>
        <label>Precio (S/)<input value={form.precio} onChange={e => cambiar('precio', e.target.value)} inputMode="decimal" placeholder="100.00 (prueba 0.00 para HTTP 400)" /></label>
        <label>Cliente (ID opcional)<input type="number" min="1" value={form.cliente} onChange={e => cambiar('cliente', e.target.value)} placeholder="Vacío = sin asignar" /></label>
        <label>Fecha de inicio<input type="date" value={form.fecha_inicio} onChange={e => cambiar('fecha_inicio', e.target.value)} /></label>
        <label>Fecha final<input type="date" value={form.fecha_fin} onChange={e => cambiar('fecha_fin', e.target.value)} /></label>
      </div>
      {errorFormulario && <p className="error" role="alert">{errorFormulario}</p>}
      {mensaje && <p className="exito" role="status">{mensaje}</p>}
      <div className="acciones"><button disabled={guardando} type="submit">{guardando ? 'Guardando...' : editandoId == null ? 'Crear (POST)' : 'Guardar cambios (PATCH)'}</button>
      {editandoId != null && <button type="button" className="secundario" onClick={cancelarEdicion}>Cancelar edición</button>}</div>
    </form>
  </section>
}
