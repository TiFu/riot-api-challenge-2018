import { PlayerStateUpdatedAction, PlayerInfo,EndOfGameAction,UpdatePlayerAchievementsAction, UpdateGroupAchievementsAction, UpdatePlayerDataAction, ReceivedGroupInviteAction, GroupInviteUpdateAction } from './types';
import { ActionCreator } from 'redux';
import { GameData } from './types'
import { Achievement, AchievementNotification, PlayerData, GroupInviteRequest, GroupInviteUpdate } from 'achievement-sio';
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
export const newGroupInvite = (groupInvite: GroupInviteRequest) => {
    return {
        type: '@@player/GROUP_INVITE_RECEIVED',
        payload: groupInvite
    } as ReceivedGroupInviteAction
}

export const groupInviteUpdate = (groupInviteUpdate: GroupInviteUpdate) => {
    return {
        type: '@@player/GROUP_INVITE_UPDATE',
        payload: groupInviteUpdate
    } as GroupInviteUpdateAction
}

export const updatePlayerAchievements = (achievements: AchievementNotification) => {
    return {
        type: '@@player/PLAYER_ACHIEVEMENTS_UPDATED',
        payload: achievements
    } as UpdatePlayerAchievementsAction
}

export const updateGroupAchievements = (achievements: AchievementNotification) => {
    return {
        type: '@@player/GROUP_ACHIEVEMENTS_UPDATED',
        payload: achievements
    } as UpdateGroupAchievementsAction
}

export const updatePlayerData = (data: PlayerData) => {
    return { 
        type: '@@player/PLAYER_DATA_UPDATED',
        payload: data
    } as UpdatePlayerDataAction
}