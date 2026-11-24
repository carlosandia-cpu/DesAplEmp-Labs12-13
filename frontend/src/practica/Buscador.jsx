export default function Buscador({ valor, onCambiar }) {
  return <label>Buscar producto
    <input type="search" value={valor} onChange={evento => onCambiar(evento.target.value)} placeholder="Por ejemplo: ca" />
  </label>
}
