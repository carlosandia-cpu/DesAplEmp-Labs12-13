
import { useState } from 'react'
import './App.css'

import { clientes, membresias, pagos, entrenadores, clases } from './datos'

import ClienteCard from './components/ClienteCard'
import EntrenadorLista from './components/EntrenadorLista'
import ClaseLista from './components/ClaseLista'
import PagoLista from './components/PagoLista'
import PanelMembresias from './components/PanelMembresias'

import Practica from './practica/Practica'
import ListaPractica from './practica/ListaPractica'
import PanelClasesAPI from './components/PanelClasesAPI'

// Lab 14: catálogo de productos
import ProductosPage from './pages/ProductosPage'

// Lab 14: adaptación educativa SmartIA
import CursosPage from './pages/CursosPage'

export default function App() {
  const [pantalla, setPantalla] = useState('panel')

  return (
    <main className="contenedor">
      <header>
        <span className="marca">GYMMANAGER</span>
        <p>Gestión del gimnasio</p>
      </header>

      <nav aria-label="Secciones">
        <button
          aria-pressed={pantalla === 'practica'}
          onClick={() => setPantalla('practica')}
        >
          Práctica: catálogo y carrito
        </button>

        <button
          aria-pressed={pantalla === 'panel'}
          onClick={() => setPantalla('panel')}
        >
          Panel de membresías
        </button>

        <button
          aria-pressed={pantalla === 'otros'}
          onClick={() => setPantalla('otros')}
        >
          Clientes, clases y pagos
        </button>

        <button
          aria-pressed={pantalla === 'ajax'}
          onClick={() => setPantalla('ajax')}
        >
          Lab 12: Membresías (API)
        </button>

        <button
          aria-pressed={pantalla === 'clases-api'}
          onClick={() => setPantalla('clases-api')}
        >
          Lab 12: Clases (API)
        </button>

        <button
          aria-pressed={pantalla === 'productos-api'}
          onClick={() => setPantalla('productos-api')}
        >
          Lab 14: Productos (API)
        </button>

        <button
          aria-pressed={pantalla === 'cursos-api'}
          onClick={() => setPantalla('cursos-api')}
        >
          SmartIA: Cursos (API)
        </button>
      </nav>

      <div className="parte">
        {pantalla === 'practica' && <Practica />}

        {pantalla === 'panel' && <PanelMembresias />}

        {pantalla === 'ajax' && <ListaPractica />}

        {pantalla === 'clases-api' && <PanelClasesAPI />}

        {pantalla === 'productos-api' && <ProductosPage />}

        {pantalla === 'cursos-api' && <CursosPage />}

        {pantalla === 'otros' && (
          <section>
            <h1>Clientes, clases y pagos</h1>

            <div className="rejilla">
              {clientes.map(cliente => (
                <ClienteCard
                  key={cliente.id}
                  nombre={cliente.nombre}
                  inscripciones={cliente.inscripciones}
                />
              ))}
            </div>

            <EntrenadorLista registros={entrenadores} />

            <ClaseLista
              registros={clases}
              entrenadores={entrenadores}
            />

            <PagoLista
              registros={pagos}
              clientes={clientes}
              membresias={membresias}
            />
          </section>
        )}
      </div>
    </main>
  )
}
