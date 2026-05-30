// Interfaces para cada Player Online e Mundo

export interface OnlinePlayer {
    name: string;
    level: number;
    vocation: string;
}

export interface World {
    name: string;
    status: string;
    players_online: number;
    location: string;
    pvp_type: string;
    premium_only: boolean;
    transfer_type: string;
    battleye_protected: boolean;
    battleye_date: string;
    game_world_type: string;
    creation_date?: string;
    record_players?: number;
    online_players?: OnlinePlayer[];
}
