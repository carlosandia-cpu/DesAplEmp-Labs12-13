# GymManager — Laboratorio 12 (integrado sobre Labs 9, 10 y 11)

El ZIP mantiene **las tres pantallas anteriores** y añade dos pestañas nuevas en React:

- **Lab 12: Membresías (API)**: práctica de GET, POST, PATCH, DELETE, búsqueda `?search=`, manejo de carga/error y respuesta 400 de `validate_precio`.
- **Lab 12: Clases (API)**: panel administrativo React con GET, POST, PATCH, DELETE, confirmación de eliminación, búsqueda, filtro por sala, ordenamiento, resumen con los datos reales y error 400 de `validate_nombre`.

## Requisitos

- Python compatible con la versión de Django especificada en `requirements.txt`.
- Node.js y npm (versiones compatibles con Vite 8).
- Ejecutar Django y React en **dos terminales a la vez**.
- Internet la primera vez para instalar dependencias, como `axios` y `django-cors-headers`.

## Terminal 1 — Django, en la raíz del proyecto

En PowerShell:

```powershell
py -m pip install -r requirements.txt
py manage.py migrate
py manage.py cargar_demo_lab12
py manage.py runserver 8000
```

`cargar_demo_lab12` es opcional: crea un entrenador, una sala, una clase y una membresía **solo si no existen registros**. Sirve para probar desde una base de datos nueva (el ZIP no trae `db.sqlite3`).

Verifica en el navegador:

- `http://127.0.0.1:8000/api/membresias/`
- `http://127.0.0.1:8000/api/clases/`
- `http://127.0.0.1:8000/api/entrenadores/`
- `http://127.0.0.1:8000/api/salas/`

## Terminal 2 — React, dentro de `frontend`

```powershell
cd frontend
npm install
npm run dev
```

Abre **http://localhost:5173/** y entra a las pestañas del Lab 12. Si una API responde error, revisa que Django esté encendido y que exista la base de datos migrada.

Para comprobar el proyecto:

```powershell
npm run lint
npm run build
```

## ¿Dónde está cada implementación?

| Archivo | Propósito |
|---|---|
| `config/settings.py` | CORS permite React en localhost:5173 |
| `gimnasio/api_urls.py` | Endpoints y rutas |
| `gimnasio/api_views.py` | ViewSets, filtro por sala, búsquedas y ordenamiento |
| `gimnasio/serializers.py` | JSON y validaciones (`validate_precio`, `validate_nombre`) |
| `frontend/src/api.js` | Instancia Axios con `baseURL`, `timeout` y lectura de errores DRF |
| `frontend/src/practica/ListaPractica.jsx` | CRUD AJAX de membresías: Parte 1 |
| `frontend/src/components/PanelClasesAPI.jsx` | Estado y solicitudes a la API de clases: Parte 2 |
| `frontend/src/components/ClaseAPILista.jsx` | Listado que recibe `registros` mediante props |
| `frontend/src/components/ClaseAPIItem.jsx` | Fila con botones Editar y Eliminar; callbacks al padre |
| `frontend/src/App.jsx` | Navegación, incluyendo las dos nuevas pestañas |

## Comprobaciones recomendadas para la guía

1. **GET 200:** abrir pestañas nuevas; en F12 → Network → Fetch/XHR buscar `/membresias/` o `/clases/`.
2. **Error de conexión:** detener Django y recargar una pestaña nueva: aparece aviso en vez de pantalla vacía.
3. **POST 201:** crear una membresía y una clase; se muestran sin recargar toda la página.
4. **Error 400:** en membresías usar precio `0.00`; en clases nombre `AB`. Se muestra el error devuelto por Django.
5. **PATCH 200:** usar botón «Editar», cambiar campos y guardar.
6. **DELETE 204:** usar botón «Eliminar» y confirmar el diálogo.
7. **Búsqueda y filtros:** en clases buscar `Yoga`, elegir Sala, cambiar orden; en Network se verán URLs con `?search=...&sala=...&ordering=...`.
8. **Lint/build:** ejecutar ambos comandos en `frontend`.

**Importante:** las nuevas pantallas consumen **datos reales de Django**. Las pestañas originales de los Labs 9–11 siguen utilizando los datos locales para conservar los ejercicios anteriores. La API del laboratorio todavía no exige autenticación: usar solo como desarrollo local; no publicar abierta en producción.
