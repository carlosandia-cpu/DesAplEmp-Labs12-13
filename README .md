# Desarrollo de Aplicaciones Empresariales — Labs 12, 13 y 14

## 1. Descripción del proyecto

Este repositorio contiene las prácticas desarrolladas en los laboratorios 12, 13 y 14 del curso Desarrollo de Aplicaciones Empresariales.

Se utiliza Django REST Framework como backend y React con Vite como frontend, estableciendo la comunicación mediante Axios y peticiones AJAX.

En el Laboratorio 14 se adaptó el ejemplo de comercio electrónico al contexto del proyecto integrador **SmartIA**, una plataforma educativa que permite consultar cursos, verificar cupos disponibles y registrar matrículas con pagos simulados.

**Importante:** esta implementación es una demostración académica independiente del proyecto integrador principal.

## 2. Tecnologías utilizadas

| Tecnología | Función |
|---|---|
| Python 3.13 | Lenguaje utilizado en el backend |
| Django | Framework del servidor |
| Django REST Framework | Desarrollo de API REST |
| SQLite | Base de datos local |
| React | Interfaz de usuario |
| Vite | Herramienta de desarrollo del frontend |
| Axios | Peticiones HTTP entre React y Django |
| JavaScript y JSX | Componentes del frontend |
| Git y GitHub | Control de versiones |

## 3. Laboratorios desarrollados

### Laboratorio 12 — AJAX y Axios

Se implementó la comunicación entre React y Django mediante peticiones HTTP, utilizando Axios para realizar consultas y operaciones CRUD.

Principales funcionalidades:

- Configuración de Axios en `frontend/src/api.js`.
- Consultas GET mediante `useEffect`.
- Operaciones POST, PATCH y DELETE.
- Búsquedas, filtros y ordenamiento.
- Manejo de errores y estados de carga.
- Configuración de CORS.

### Laboratorio 13 — Arquitectura del comercio electrónico

Se analizaron los componentes de una aplicación de comercio electrónico y se diseñó una arquitectura basada en Django REST Framework y React.

Se crearon las aplicaciones `catalogo` y `pedidos`, reutilizadas posteriormente para el Laboratorio 14.

### Laboratorio 14 — Componentes de comercio electrónico adaptados a SmartIA

Se desarrolló un catálogo educativo con cursos y matrículas, adaptando los componentes de comercio electrónico al contexto de SmartIA.

Funcionalidades implementadas:

- Modelos de categorías y cursos.
- Registro y consulta de cursos mediante Django ORM.
- API REST con serializers y ViewSets.
- Operaciones CRUD sobre cursos.
- Búsqueda por título y descripción.
- Validación de precios mayores que cero.
- Catálogo de cursos en React.
- Consulta del detalle de cada curso.
- Registro de matrículas.
- Validación y descuento de cupos.
- Registro de pedidos de matrícula.
- Pago simulado.
- Actualización de los cupos en la interfaz sin recargar la página.

## 4. Modelos de SmartIA

| Modelo | Responsabilidad |
|---|---|
| CategoriaCurso | Clasificar los cursos educativos |
| Curso | Guardar título, descripción, precio, cupos, estado y categoría |
| Cliente | Representar al estudiante en la demostración |
| PedidoCurso | Registrar los pedidos de matrícula |
| DetallePedidoCurso | Relacionar cursos con pedidos |
| PagoCurso | Registrar el pago simulado y su estado |

Se utiliza `ForeignKey` para establecer relaciones entre modelos.

`PROTECT` evita la eliminación de registros que tienen información relacionada, mientras que `CASCADE` permite eliminar detalles cuando se elimina su pedido correspondiente.

## 5. Estructura del proyecto

```text
DesAplEmp-Lab12/
├── catalogo/
│   ├── models.py
│   ├── serializers.py
│   ├── api_views.py
│   └── migrations/
├── pedidos/
│   ├── models.py
│   ├── serializers.py
│   ├── api_views.py
│   └── migrations/
├── gimnasio/
├── core/
├── store/
├── config/
│   ├── settings.py
│   └── urls.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── practica/
│   │   ├── pages/
│   │   │   ├── ProductosPage.jsx
│   │   │   ├── CursosPage.jsx
│   │   │   └── CursoDetallePage.jsx
│   │   ├── api.js
│   │   └── App.jsx
│   └── package.json
├── manage.py
├── requirements.txt
└── README.md
```

## 6. Rutas principales de la API

| Método | Ruta | Función |
|---|---|---|
| GET | `/api/cursos/` | Listar cursos |
| GET | `/api/cursos/{id}/` | Consultar un curso |
| GET | `/api/cursos/?search=Python` | Buscar cursos |
| POST | `/api/cursos/` | Registrar un curso |
| PATCH | `/api/cursos/{id}/` | Modificar un curso |
| DELETE | `/api/cursos/{id}/` | Eliminar un curso |
| POST | `/api/matriculas/` | Registrar una matrícula con pago simulado |
| GET | `/api/productos/` | Consultar productos del ejemplo original |
| GET | `/api/clases/` | Consultar clases del laboratorio anterior |

## 7. Proceso de matrícula

1. El estudiante consulta los cursos desde React.
2. Selecciona un curso y presiona **Matricularme**.
3. React envía una petición POST a `/api/matriculas/` mediante Axios.
4. Django verifica que el estudiante y el curso existan.
5. Se comprueba que el curso esté activo y tenga cupos suficientes.
6. Se calcula el importe utilizando el precio registrado en la base de datos.
7. Se descuentan los cupos disponibles.
8. Se registra el pedido y su detalle.
9. Se registra un pago simulado aprobado.
10. El pedido cambia a estado `PAGADO` y React actualiza el catálogo.

Se utiliza `transaction.atomic()` para agrupar las operaciones y `F()` para actualizar los cupos en la base de datos.

## 8. Reglas de negocio

- No se permiten precios menores o iguales a cero.
- No se permiten matrículas con cantidades menores que uno.
- No se permiten matrículas si el curso está inactivo.
- No se permiten matrículas cuando los cupos son insuficientes.
- El importe se calcula utilizando el precio del servidor.
- Las operaciones de matrícula se ejecutan dentro de una transacción de base de datos.
- Los pagos son simulados y no procesan dinero real.

## 9. Módulo de pago simulado

La aplicación cuenta con el modelo `PagoCurso`, que permite registrar el monto y el estado de un pago asociado a una matrícula.

Estados definidos:

- `PENDIENTE`: pago todavía no aprobado.
- `APROBADO`: pago aceptado.
- `RECHAZADO`: pago no aceptado.

En esta versión académica, cuando una matrícula se registra correctamente, el sistema crea automáticamente un pago con estado `APROBADO` y cambia el pedido a `PAGADO`.

No existe integración con una pasarela bancaria real, almacenamiento de tarjetas ni verificación externa de pagos.

**Limitación:** este flujo únicamente demuestra el registro de una transacción simulada. En un sistema real, la aprobación del pago debe depender de una confirmación verificable de la pasarela correspondiente.

## 10. Instalación y ejecución

### Requisitos

- Python 3.13
- Node.js y npm
- Git
- Dependencias de `requirements.txt`
- Dependencias de `frontend/package.json`

### Backend — Django

Desde la raíz del proyecto:

```powershell
py -3.13 -m pip install -r requirements.txt
py -3.13 manage.py migrate
py -3.13 manage.py check
py -3.13 manage.py runserver
```

Servidor Django:

`http://127.0.0.1:8000/`

API de cursos:

`http://127.0.0.1:8000/api/cursos/`

### Frontend — React

En otra terminal:

```powershell
cd frontend
npm install
npm run dev
```

Interfaz web:

`http://localhost:5173/`

Ingresar a la sección **SmartIA: Cursos (API)**.

## 11. Pruebas realizadas

| Prueba | Resultado esperado |
|---|---|
| Consultar cursos | HTTP 200 |
| Buscar cursos | HTTP 200 con resultados filtrados |
| Consultar detalle | HTTP 200 |
| Crear curso | HTTP 201 |
| Actualizar curso | HTTP 200 |
| Eliminar curso temporal | HTTP 204 |
| Crear curso con precio cero | HTTP 400 |
| Registrar matrícula válida | HTTP 201 |
| Solicitar matrícula sin cupos suficientes | HTTP 400 |
| Consultar cursos desde React | Visualización de datos mediante Axios |
| Ejecutar lint | Sin errores ni advertencias |
| Ejecutar build | Compilación exitosa |

### Comandos de verificación

Backend:

```powershell
py -3.13 manage.py check
```

Frontend:

```powershell
cd frontend
npm run lint
npm run build
```

## 12. Cuenta de demostración

Para las pruebas locales se utiliza un estudiante de ejemplo:

- Nombre: Estudiante Demo
- Correo: `estudiante.lab14@ejemplo.local`
- Identificador utilizado: `1`

**Importante:** el identificador corresponde únicamente a la base de datos local de prueba. La implementación actual no incluye un sistema de autenticación del estudiante para esta operación.

## 13. Consideraciones y limitaciones

El proyecto fue desarrollado con fines académicos y no está preparado para producción.

Entre las mejoras necesarias para un despliegue real se encuentran la autenticación y autorización de estudiantes, la verificación externa de pagos, la prevención de matrículas duplicadas, el endurecimiento de los permisos de las operaciones CRUD y una gestión más completa del ciclo de vida de las matrículas.

El módulo de cursos implementado para estos laboratorios es independiente de las