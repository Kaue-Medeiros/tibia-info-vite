import type { World } from '../types'

interface WorldDetailProps {
    world: World;
    onVoltar: () => void;
}

function WorldDetail( { world, onVoltar }: WorldDetailProps ){
    return (
        <div className="world-details">
            <button className="btn-voltar" onClick={onVoltar}>← Voltar</button>
            <h1>{world.name}</h1>
            <ul className="detalhes-lista">
                <li>
                    <span>Status</span>
                    <span className={`badge ${world.status === 'online' ? 'badge-online' : 'badge-offline'}`}>
                        {world.status}
                    </span>
                </li>
                <li><span>Localização</span> <span>{world.location}</span></li>
                <li><span>Players Online</span> <span>{world.players_online}</span></li>
                <li><span>Tipo de PvP</span> <span>{world.pvp_type}</span></li>
                <li><span>BattlEye</span> <span>{world.battleye_protected ? 'Sim' : 'Não'}</span></li>
                <li><span>Data de Criação</span> <span>{world.creation_date}</span></li>
                <li><span>Tipo do Mundo</span> <span>{world.game_world_type}</span></li>
                <li><span>Tipo de Transfer</span> <span>{world.transfer_type}</span></li>
            </ul>
            <hr/>
            
            <h2>Jogadores Online ({world.online_players?.length ?? 0})</h2>
            <ul className="lista-jogadores">
                {world.online_players?.map(player => (
                    <li key={player.name}>
                        <span>{player.name}</span>
                        <span>nível {player.level} · {player.vocation}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default WorldDetail