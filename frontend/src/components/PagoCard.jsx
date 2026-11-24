import Tarjeta from './Tarjeta'
export default function PagoCard({ cliente = 'Sin asignar', monto, fecha, metodoPago }) {
  return <Tarjeta titulo={cliente}><p className="importe">S/ {Number(monto).toFixed(2)}</p><p>{metodoPago} · {fecha}</p></Tarjeta>
}
