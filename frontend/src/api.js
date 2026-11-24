
import axios from 'axios'

// Configuración de Axios para conectar React con Django
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  timeout: 10000,
})

// Convierte la respuesta de Django en una lista
export const comoLista = (data) =>
  Array.isArray(data) ? data : (data?.results ?? [])

// Muestra los errores que devuelve Django
export function mensajeError(err) {
  if (!err.response) {
    return 'No se pudo conectar a Django. Verifica que el servidor esté encendido.'
  }

  const data = err.response.data

  if (typeof data === 'string') return data
  if (Array.isArray(data)) return data.join(' ')

  if (data && typeof data === 'object') {
    const errores = Object.entries(data).map(([campo, valor]) =>
      `${campo}: ${Array.isArray(valor) ? valor.join(' ') : String(valor)}`
    )

    if (errores.length) return errores.join(' | ')
  }

  if (err.response.status === 404) {
    return 'El registro ya no existe (404).'
  }

  return `Error HTTP ${err.response.status}.`
}
