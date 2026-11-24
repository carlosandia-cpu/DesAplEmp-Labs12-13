import { useEffect } from 'react'
export default function Carrito({ lineas, onQuitar, onVaciar }) {
  // Ambos valores se calculan a partir del único estado, que vive en Practica.
  const cantidad = lineas.reduce((suma, linea) => suma + linea.cantidad, 0)
  const total = lineas.reduce((suma, linea) => suma + Number(linea.precio) * linea.cantidad, 0)
  useEffect(() => {
    const tituloAnterior = document.title
    document.title = `Carrito (${cantidad}) — Cafetería`
    console.log('Efecto Carrito: unidades', cantidad)
    return () => { document.title = tituloAnterior }
  }, [cantidad])
  return <aside className="tarjeta carrito" aria-label="Carrito">
    <h2>Carrito</h2>
    {lineas.length === 0 && <p>El carrito está vacío</p>}
    <ul className="sublista">{lineas.map(linea => <li key={linea.id}>
      <strong>{linea.nombre}</strong>
      <span>{linea.cantidad} × S/ {Number(linea.precio).toFixed(2)} = S/ {(linea.cantidad * Number(linea.precio)).toFixed(2)}</span>
      <button onClick={() => onQuitar(linea.id)}>Quitar</button>
    </li>)}</ul>
    <p>Unidades: {cantidad}</p><p className="total">Total: S/ {total.toFixed(2)}</p>
    <button onClick={onVaciar} disabled={lineas.length === 0}>Vaciar carrito</button>
  </aside>
}
