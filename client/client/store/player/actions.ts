import { PlayerStateUpdatedAction, PlayerInfo,EndOfGameAction } from './types';
import { ActionCreator } from 'redux';
import { GameData } from './types'
export const updatePlayerInfo: ActionCreator<PlayerStateUpdatedAction> = (playerInfo?: PlayerInfo) => {
    return {
        type: '@@player/PLAYER_STATE_UPDATED',
        payload: playerInfo
    }
}

export const endOfGameDetected: ActionCreator<EndOfGameAction> = (game: GameData) => {
    return {
        type: '@@player/END_OF_GAME',
        payload: game
    }
}