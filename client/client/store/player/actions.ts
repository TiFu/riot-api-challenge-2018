import { PlayerStateUpdatedAction, PlayerInfo, EndOfGameAction, UpdatePlayerAchievementsAction, UpdateGroupAchievementsAction, UpdatePlayerDataAction, ReceivedGroupInviteAction, GroupInviteUpdateAction, ChangeInvitationStateAction, GroupInviteChangeResult, GroupInviteChangeResultAction, NewGroupAction, ChangeInvitation } from './types';
import { ActionCreator } from 'redux';
import { GameData } from './types'
import { Achievement, AchievementNotification, PlayerData, GroupInviteRequest, GroupInviteUpdate, Group } from 'achievement-sio';
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

export const acceptInvite = (inviteId: number, groupId: number, cb: (err: string, success: boolean) => void) => {
    return {
        type: '@@player/GROUP_INVITE_CHANGE',
        payload: {
            inviteId: inviteId,
            newStatus: 'accepted',
            "groupId": groupId,
            cb: cb
        } as ChangeInvitation
    } as ChangeInvitationStateAction
}

export const declineInvite = (inviteId: number, groupId: number, cb: (err: string, success: boolean) => void) => {
    return {
        type: '@@player/GROUP_INVITE_CHANGE',
        payload: {
            inviteId: inviteId,
            newStatus: 'declined',
            "groupId": groupId,
            cb: cb
        } as ChangeInvitation
    } as ChangeInvitationStateAction
}

export const groupInviteChangeResult = (result: GroupInviteChangeResult) => {
    return {
        type: '@@player/GROUP_INVITE_CHANGE_RESULT',
        payload: result
    } as GroupInviteChangeResultAction
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

export const newGroupEvent = (data: Group) => {
    return {
        type: '@@player/NEW_GROUP',
        payload: data
    } as NewGroupAction
}
export const updatePlayerData = (data: PlayerData) => {
    return { 
        type: '@@player/PLAYER_DATA_UPDATED',
        payload: data
    } as UpdatePlayerDataAction
}