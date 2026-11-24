import { useEffect } from 'react'
export default function Aviso({ nombre, onCerrar }) {
  useEffect(() => {
    console.log('Efecto Aviso:', nombre)
    const temporizador = setTimeout(onCerrar, 3000)
    return () => clearTimeout(temporizador)
  }, [nombre, onCerrar])
  return <p className="aviso" role="status">Agregado: {nombre}</p>
}
