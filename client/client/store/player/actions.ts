import { PlayerStateUpdatedAction, PlayerInfo,EndOfGameAction,UpdateAchievementsAction } from './types';
import { ActionCreator } from 'redux';
import { GameData } from './types'
import { Achievement } from 'achievement-sio';
export const updatePlayerInfo = (playerInfo?: PlayerInfo) => {
    return {
        type: '@@player/PLAYER_STATE_UPDATED',
        payload: playerInfo
    } as PlayerStateUpdatedAction
}

export const endOfGameDetected = (gameId: number, champId: number, skinId: number) => {
    return {
        type: '@@player/END_OF_GAME',
        payload: {
            gameId: gameId,
            champId: champId,
            skinId: skinId
        }
    } as EndOfGameAction
}

export const updateAchievements = (achievements: Achievement[]) => {
    return {
        type: '@@player/ACHIEVEMENTS_UPDATED',
        payload: achievements
    } as UpdateAchievementsAction
}