import {Action} from 'redux'

export interface PlayerInfo {
    playerName: string
    accountId: number
    platformId: string
}

export interface PlayerState {
    playerInfo?: PlayerInfo
}

export interface PlayerStateUpdatedAction extends Action {
    type: '@@player/PLAYER_STATE_UPDATED'
    payload: PlayerInfo
}

export type PlayerActions = PlayerStateUpdatedAction; // use union type here