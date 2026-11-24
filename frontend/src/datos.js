// Forma de la respuesta de la API (decimales como texto)
export const entrenadores = [
  { id: 1, nombre: 'Luis Ramos', especialidad: 'Crossfit', telefono: '987654321' },
  { id: 2, nombre: 'Ana Torres', especialidad: 'Yoga', telefono: '912345678' },
  { id: 3, nombre: 'Marco Díaz', especialidad: 'Spinning', telefono: '955443322' },
  { id: 4, nombre: 'Sofía Paredes', especialidad: 'Funcional', telefono: '944112233' },
]

export const clases = [
  {
    id: 1, nombre: 'Yoga matutino', horario: '20/10/2026 07:00',
    cupos_disponibles: 12, entrenador: 2,
    inscripciones: [
      { id: 1, cliente: 'Carlos Andia', fecha_inscripcion: '2026-10-15', estado: 'Activa', sesiones: 4, precio_sesion: '25.00' },
      { id: 2, cliente: 'Noe Quispe', fecha_inscripcion: '2026-10-16', estado: 'Activa', sesiones: 8, precio_sesion: '20.00' },
    ],
  },
  {
    id: 2, nombre: 'Crossfit avanzado', horario: '20/10/2026 18:00',
    cupos_disponibles: 2, entrenador: 1,
    inscripciones: [
      { id: 3, cliente: 'Carlos Andia', fecha_inscripcion: '2026-10-14', estado: 'Completada', sesiones: 10, precio_sesion: '30.50' },
    ],
  },
  {
    id: 3, nombre: 'Spinning', horario: '21/10/2026 19:00',
    cupos_disponibles: 0, entrenador: 3,
    inscripciones: [
      { id: 4, cliente: 'Lucía Rojas', fecha_inscripcion: '2026-10-10', estado: 'Cancelada', sesiones: 2, precio_sesion: '18.00' },
    ],
  },
  {
    id: 4, nombre: 'Funcional', horario: '22/10/2026 08:00',
    cupos_disponibles: 15, entrenador: 4,
    inscripciones: [],
  },
  {
    id: 5, nombre: 'Yoga nocturno', horario: '22/10/2026 20:00',
    cupos_disponibles: 3, entrenador: 2,
    inscripciones: [
      { id: 5, cliente: 'Noe Quispe', fecha_inscripcion: '2026-10-17', estado: 'Activa', sesiones: 5, precio_sesion: '22.00' },
    ],
  },
]


// Datos locales de la Parte 1 con los campos de los serializers de Semana 8.
// El Lab 09 adjunto solo incluía entrenadores y clases; se completa esta base.
export const clientes = ['Carlos Andia', 'Noe Quispe', 'Lucía Rojas'].map((nombre, index) => ({
  id: index + 1, nombre,
  inscripciones: clases.flatMap(clase => clase.inscripciones
    .filter(inscripcion => inscripcion.cliente === nombre)
    .map(inscripcion => ({ ...inscripcion, clase: clase.nombre }))),
}))

// Cinco registros locales con los campos exactos de MembresiaSerializer.
export const membresias = [
  { id: 1, cliente: 1, tipo: 'Mensual', precio: '100.00', fecha_inicio: '2026-11-01', fecha_fin: '2026-11-30' },
  { id: 2, cliente: 2, tipo: 'Trimestral', precio: '270.00', fecha_inicio: '2026-10-01', fecha_fin: '2026-12-31' },
  { id: 3, cliente: 3, tipo: 'Mensual estudiante', precio: '80.00', fecha_inicio: '2026-11-01', fecha_fin: '2026-11-30' },
  { id: 4, cliente: null, tipo: 'Semestral', precio: '500.00', fecha_inicio: '2026-10-01', fecha_fin: '2027-03-31' },
  { id: 5, cliente: 1, tipo: 'Anual', precio: '900.00', fecha_inicio: '2026-01-01', fecha_fin: '2026-12-31' },
]
export const pagos = [
  { id: 1, cliente: 1, membresia: 1, monto: '100.00', fecha: '2026-10-01', metodo_pago: 'Efectivo' },
  { id: 2, cliente: 2, membresia: 2, monto: '270.00', fecha: '2026-10-01', metodo_pago: 'Transferencia' },
]
