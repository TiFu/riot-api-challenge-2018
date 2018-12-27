import {Action} from 'redux'

export interface PlayerInfo {
    playerName: string
    accountId: number
    platformId: string
}

export interface GameData {
    game: any
    timeline: any
}

export interface EndOfGameAction extends Action {
    type: '@@player/END_OF_GAME',
    payload: GameData
}

export interface PlayerState {
    playerInfo?: PlayerInfo
}

export interface PlayerStateUpdatedAction extends Action {
    type: '@@player/PLAYER_STATE_UPDATED'
    payload: PlayerInfo
}

export type PlayerActions = PlayerStateUpdatedAction | EndOfGameAction; // use union type here