import { PlayerStateUpdatedAction, PlayerInfo,EndOfGameAction,UpdateAchievementsAction } from './types';
import { ActionCreator } from 'redux';
import { GameData } from './types'
import { Achievement } from 'achievement-sio';
export const updatePlayerInfo: ActionCreator<PlayerStateUpdatedAction> = (playerInfo?: PlayerInfo) => {
    return {
        type: '@@player/PLAYER_STATE_UPDATED',
        payload: playerInfo
    }
}

export const endOfGameDetected: ActionCreator<EndOfGameAction> = (game: number) => {
    return {
        type: '@@player/END_OF_GAME',
        payload: game
    }
}

export const updateAchievements: ActionCreator<UpdateAchievementsAction> = (achievements: Achievement[]) => {
    return {
        type: '@@player/ACHIEVEMENTS_UPDATED',
        payload: achievements
    }
}