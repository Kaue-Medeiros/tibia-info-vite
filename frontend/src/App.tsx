import { useState, useEffect, Fragment } from 'react'
import './App.css'

import type { World } from './types'
import WorldDetail from './components/WorldDetail'

function App() {
  // <World[]>([]) define que esse Estado é um array de World's, e que o Estado inicial é um array vazio []
  const [worlds, setWorlds] = useState<World[]>([])
  const [selecionado, setSelecionado] = useState<World | null>(null)

  const [loading, setLoading] = useState<boolean>(true)
  const [erro, setErro] = useState<string | null>(null)
  


  // useEffect roda o código após o componente aparecer na tela
  // Codigo para pegar a informação geral dos mundos, para criar os cards
  useEffect(() => {
    async function carregar(){
      try {
        const response = await fetch('/api/worlds')
        if(!response.ok) throw new Error(`HTTP: ${response.status}`) // trata erro do backend
        const data = await response.json()
        setWorlds(data.regular_worlds)
      } catch(error){
        console.log(`Erro ao carregar os mundos: ${error}`)
        setErro('Falha ao carregar os mundos!')
      } finally {
        setLoading(false) // Sempre 'desliga' a condição de loading
      }
    }
    carregar()

  }, [])
  // o parametro [] é o "array de dependencias", como está vazio, ele roda apenas uma vez, ao montar


  async function selecionarMundo(nome: string) {

    try {
      const response = await fetch(`/api/world/${nome}`)
      if(!response.ok) throw new Error(`HTTP: ${response.status}`)
      const data = await response.json()
      setSelecionado(data)

    }catch(error){
      console.log(`Erro ao carregar o mundo: ${error}`)
    }
  }



  return (
    <Fragment>
      {!selecionado && (
        <header className="app-header">
          <h1>Tibia — Servidores</h1>
          <p className="subtitulo">
            {loading ? 'Carregando mundos...'
              : erro != null ? erro
                : `${worlds.length} mundos disponíveis`}
          </p>
        </header>
      )}

      {/* Verifica se esta no estado de mostrar a lista de servidores ou os detalhes de um servidor especifico*/}
      <div className="cards">
        {selecionado ? (
          <WorldDetail world={selecionado} onVoltar={() => setSelecionado(null)} />
        ) : (
          worlds.map((world) => (
            <div className="card" key={world.name} onClick={() => selecionarMundo(world.name)}>
              <h3>{world.name}</h3>
              <p className="card-location">{world.location}</p>
              <p className="card-players">{world.players_online} jogadores online</p>
              <span className={`badge ${world.status === 'online' ? 'badge-online' : 'badge-offline'}`}>
                {world.status}
              </span>
            </div>
          ))
        )}
      </div>

    </Fragment>
  )
}

export default App
