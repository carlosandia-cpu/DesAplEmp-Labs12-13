import ProductoCard from './ProductoCard'
export default function Catalogo({ productos, onAgregar }) {
  return <section aria-label="Catálogo">
    <h2>Catálogo</h2>
    {productos.length === 0 && <p className="vacio">No hay productos que coincidan</p>}
    <div className="rejilla">{productos.map(producto =>
      <ProductoCard key={producto.id} producto={producto} onAgregar={onAgregar} />
    )}</div>
  </section>
}
