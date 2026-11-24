export default function EntrenadorCard({ nombre, especialidad, telefono }) {
  return <li className="entrenador"><strong>{nombre}</strong><span>{especialidad}</span><span>{telefono}</span></li>
}
