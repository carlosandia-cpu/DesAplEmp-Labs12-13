export default function MembresiaResumen({ registros }) {
  const total = registros.reduce((suma, registro) => suma + Number(registro.precio), 0)
  const promedio = registros.length ? total / registros.length : 0
  return <section className="resumen-panel" aria-label="Resumen de membresías">
    <p>Membresías registradas <strong>{registros.length}</strong></p>
    <p>Importe total <strong>S/ {total.toFixed(2)}</strong></p>
    <p>Precio promedio <strong>S/ {promedio.toFixed(2)}</strong></p>
  </section>
}
