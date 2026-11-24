export default function MembresiaBuscador({ valor, onCambiar }) {
  return <label>Buscar membresía por tipo
    <input type="search" value={valor} onChange={evento => onCambiar(evento.target.value)} placeholder="Por ejemplo: mensual" />
  </label>
}
