# DesAplEmp — Labs 12 y 13

Proyecto académico de **Desarrollo de Aplicaciones Empresariales**, realizado con **Django REST Framework** y **React + Vite**. Conserva los ejercicios anteriores de GymManager y prepara una **plataforma educativa de venta de cursos** como temática para los siguientes laboratorios.

> **Estado del proyecto:** el módulo GymManager y sus consultas AJAX corresponden a prácticas previas. Las apps `catalogo` y `pedidos` se han creado como estructura inicial. El catálogo de cursos, el carrito, los pedidos y la integración de pagos descritos abajo son **diseño previsto**, no funcionalidades terminadas.

## 1. Tipo de comercio y canales

- **Modelo propuesto:** B2C (una plataforma ofrece cursos directamente a estudiantes).
- **Canales previstos:** aplicación web, acceso desde navegador móvil y posibles enlaces desde redes sociales. Todos pueden consumir una API REST común.

## 2. Roles

| Rol | Permisos previstos | Pantalla prevista |
| --- | --- | --- |
| Visitante | Explorar y buscar cursos | Catálogo |
| Estudiante | Agregar cursos al carrito, crear pedidos y consultar matrículas | Catálogo, carrito, mis pedidos |
| Administrador | Crear, actualizar y eliminar cursos; gestionar pedidos | Panel administrativo propio |

## 3. Mapa de módulos

| Módulo | Responsabilidad | Estado |
| --- | --- | --- |
| Catálogo | Mostrar y administrar cursos | App Django `catalogo` creada; lógica por implementar |
| Carrito | Mantener selección temporal de cursos | Planificado |
| Usuarios | Gestionar estudiantes, administradores y permisos | Planificado |
| Pedidos | Registrar compras y detalles | App Django `pedidos` creada; lógica por implementar |
| Pagos | Registrar confirmaciones de un proveedor externo | Planificado; sin pagos reales |
| Cupos | Validar disponibilidad antes de matricular | Planificado |
| Administración | Administrar cursos y pedidos desde React | Planificado |
| Seguridad | Autenticación, autorización y validaciones | Planificado |
| Notificaciones | Avisar sobre el estado de pedidos y matrículas | Planificado |

## 4. Requisitos funcionales

| ID | Descripción | Criterio de aceptación |
| --- | --- | --- |
| RF01 | Consultar los cursos disponibles | Se muestran registros consultados a la API de Django |
| RF02 | Buscar cursos por nombre | El listado presenta los registros coincidentes |
| RF03 | Agregar cursos al carrito | Los cursos elegidos y el subtotal aparecen en el carrito |
| RF04 | Registrar pedidos con su detalle | Django guarda el pedido y sus cursos asociados |
| RF05 | Administrar cursos | Un administrador autorizado puede crear, editar y eliminar cursos |

## 5. Requisitos no funcionales

| ID | Descripción | Criterio de aceptación verificable |
| --- | --- | --- |
| RNF01 | Rendimiento | El catálogo carga en menos de 3 segundos bajo condiciones de prueba definidas |
| RNF02 | Adaptabilidad | La interfaz funciona en pantallas de 360 px y en escritorio sin desbordamiento horizontal en sus vistas principales |
| RNF03 | Seguridad | Las operaciones administrativas sin autorización reciben HTTP 401 o 403 |

Los criterios anteriores son **objetivos de diseño**, no resultados de pruebas ya realizadas.

## 6. Reglas de negocio

| Regla | Validación prevista | Problema que evita |
| --- | --- | --- |
| RN01 | Django obtiene el precio desde la base de datos | Manipulación del precio desde el navegador |
| RN02 | Django comprueba los cupos antes de confirmar el pedido | Sobreventa de cupos |
| RN03 | Django usa `Decimal` para importes monetarios | Errores de precisión |
| RN04 | El proveedor externo procesa los datos de tarjeta; no se almacenan en la app | Exposición de datos bancarios |
| RN05 | Django valida el pedido y la confirmación de pago antes de habilitar el curso | Matrículas sin compra confirmada |

## 7. Arquitectura propuesta

```text
Usuario (estudiante o administrador)
    ↓
React (páginas y componentes)
    ↕ HTTP/JSON mediante Axios (frontend/src/api.js)
Django REST Framework (URL / Router / ViewSet)
    ↕
Serializer (validación) → Django ORM → Base de datos SQLite
    ↕
Respuesta JSON + código HTTP → React actualiza el estado

Django ↔ Pasarela externa de pago (integración futura)
```

**Operación principal prevista:** explorar cursos → agregarlos al carrito → confirmar compra → Django valida precios y cupos → crear pedido pendiente → verificar pago → registrar matrícula y habilitar acceso.

**Entidades previstas para la siguiente semana:** `Curso`, `Estudiante`, `Pedido` (**principal**), `DetallePedido` (**detalle**) y `Pago`.

## 8. Estructura del repositorio

```text
DesAplEmp-Lab12/
├── config/             # Configuración y URLs principales de Django
├── core/               # App base del proyecto
├── store/              # App de prácticas anteriores
├── gimnasio/           # API y funcionalidades de GymManager (Labs anteriores)
├── catalogo/           # Estructura inicial del catálogo educativo
├── pedidos/            # Estructura inicial de pedidos
├── frontend/
│   ├── src/
│   │   ├── components/ # Componentes reutilizables
│   │   ├── pages/      # Pantallas nuevas (estructura Lab 13)
│   │   ├── practica/   # Prácticas de laboratorios anteriores
│   │   ├── api.js      # Instancia Axios
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── manage.py
├── requirements.txt
└── README.md
```

## 9. Mapa de rutas propuesto

| Recurso | API de Django prevista | Ruta React prevista |
| --- | --- | --- |
| Cursos | `/api/cursos/` | `/cursos` |
| Detalle de curso | `/api/cursos/{id}/` | `/cursos/:id` |
| Carrito | Sin API por ahora | `/carrito` |
| Pedidos | `/api/pedidos/` | `/pedidos` |
| Detalle de pedido | `/api/pedidos/{id}/` | `/pedidos/:id` |
| Administración de cursos | `/api/cursos/` | `/admin/cursos` |

**Importante:** estas rutas son parte del diseño del Lab 13. Crear `catalogo` y `pedidos` no activa automáticamente esos endpoints ni configura la navegación por URL de React. La API ya existente de GymManager tiene recursos como `/api/membresias/` y `/api/clases/`.

## 10. Ejecución local

Requisitos: Python 3.13 (para este entorno), Node.js y npm.

**Backend:**

```powershell
py -3.13 -m pip install -r requirements.txt
py -3.13 manage.py migrate
py -3.13 manage.py check
py -3.13 manage.py runserver
```

Django se inicia normalmente en `http://127.0.0.1:8000/`.

**Frontend** (otra terminal):

```powershell
cd frontend
npm install
npm run dev
```

Vite se inicia normalmente en `http://localhost:5173/`. La API base se configura en `frontend/src/api.js` y puede personalizarse mediante `VITE_API_URL`.

**Verificaciones:**

```powershell
py -3.13 manage.py check
cd frontend
npm run lint
npm run build
```

Las carpetas generadas `node_modules/` y `dist/`, la base local `db.sqlite3` y los archivos `.env` no deben publicarse. No almacenar credenciales ni datos de tarjeta en el repositorio.

## 11. Estado y próximos pasos

- [x] Crear y registrar las apps `catalogo` y `pedidos`.
- [x] Preparar la estructura React y la instancia compartida de Axios.
- [x] Documentar diseño, requisitos, reglas, arquitectura y rutas del Lab 13.
- [ ] Crear modelos, serializers y endpoints del catálogo educativo.
- [ ] Implementar navegación, carrito y pedidos.
- [ ] Incorporar autenticación y autorización.
- [ ] Probar las funcionalidades educativas con API real.

Este repositorio es material académico; cualquier código compartido por terceros debe publicarse con su autorización.
