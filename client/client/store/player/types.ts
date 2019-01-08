import {Action} from 'redux'
import { NewGameMessage, Achievement, AchievementNotification, PlayerData, GroupPartialInfo, GroupInviteRequest, GroupInviteUpdate } from 'achievement-sio';

export interface PlayerAchievementEntry {
    achievementId: number,
    achievedAt: Date
    champId: number,
    skinId: number
}


export interface PlayerInfo {
    playerName: string
    accountId: number
    platformId: string,
}

export interface GameData {
    game: any
    timeline: any
}

export interface UpdatePlayerDataAction extends Action {
    type: '@@player/PLAYER_DATA_UPDATED'
    payload: PlayerData
}
export interface UpdateAchievementsAction extends Action {
    type: '@@player/ACHIEVEMENTS_UPDATED'
    payload: AchievementNotification
}

export interface ReceivedGroupInviteAction extends Action {
    type: '@@player/GROUP_INVITE_RECEIVED'
    payload: GroupInviteRequest
}

export interface EndOfGameAction extends Action {
    type: '@@player/END_OF_GAME',
    payload: NewGameMessage
}
export interface GroupInviteUpdateAction extends Action {
    type: '@@player/GROUP_INVITE_UPDATE'
    payload: GroupInviteUpdate
}
export interface PlayerState {
    playerInfo?: PlayerInfo
    playerAchievements?: PlayerAchievementEntry[]
    groups?: GroupPartialInfo[],
    invites?: GroupInviteRequest[]
}

export interface PlayerStateUpdatedAction extends Action {
    type: '@@player/PLAYER_STATE_UPDATED'
    payload: PlayerInfo
}

export type PlayerActions = PlayerStateUpdatedAction | EndOfGameAction | GroupInviteUpdateAction | UpdateAchievementsAction | UpdatePlayerDataAction | ReceivedGroupInviteAction; // use union type here