import MembresiaFila from './MembresiaFila'
export default function MembresiaLista({ registros, clientes, onEliminar, onRenovar }) {
  return <section aria-label="Listado de membresías">
    <h2>Membresías</h2>
    {registros.length === 0 && <p className="vacio">No hay membresías que coincidan con la búsqueda.</p>}
    <div className="rejilla">{registros.map(membresia =>
      <MembresiaFila key={membresia.id} membresia={membresia}
        cliente={clientes.find(cliente => cliente.id === membresia.cliente)?.nombre}
        onEliminar={onEliminar} onRenovar={onRenovar} />
    )}</div>
  </section>
}
