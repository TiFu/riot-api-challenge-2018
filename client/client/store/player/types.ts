import {Action} from 'redux'
import { NewGameMessage, AchievementNotification, PlayerData, GroupPartialInfo, GroupInviteRequest, GroupInviteUpdate, PlayerPartialInfo } from 'achievement-sio';
import { Group } from 'achievement-sio';

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

export interface PlayerState {
    playerInfo?: PlayerInfo
    playerAchievements?: PlayerAchievementEntry[]
    groups?: GroupPartialInfo[],
    invites?: GroupInviteRequest[]
}

export interface GroupInviteChangeResult {
    inviteId: number,
    newStatus: 'accepted' | 'declined'
    success: boolean,
    msg: string
}

export interface CreateGroupRequest {
    name: string
    cb: (err: string, result: Group) => void;
}

export interface ChangeInvitation {
    groupId: number
    inviteId: number
    newStatus: 'declined' | 'accepted'
    cb: (err: string, success: boolean) => void
}

export interface SearchPlayer {
    searchString: string,
    region: string
    cb: (err: string, data: PlayerPartialInfo[]) => void
}
export interface UpdatePlayerDataAction extends Action {
    type: '@@player/PLAYER_DATA_UPDATED'
    payload: PlayerData
}
export interface UpdatePlayerAchievementsAction extends Action {
    type: '@@player/PLAYER_ACHIEVEMENTS_UPDATED'
    payload: AchievementNotification
}

export interface UpdateGroupAchievementsAction extends Action {
    type: '@@player/GROUP_ACHIEVEMENTS_UPDATED'
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

export interface GroupInviteChangeResultAction extends Action {
    type: '@@player/GROUP_INVITE_CHANGE_RESULT'
    payload: GroupInviteChangeResult
}

export interface ChangeInvitationStateAction extends Action {
    type: '@@player/GROUP_INVITE_CHANGE'
    payload: ChangeInvitation
}

export interface NewGroupAction extends Action {
    type: '@@player/NEW_GROUP'
    payload: Group
}

export interface PlayerStateUpdatedAction extends Action {
    type: '@@player/PLAYER_STATE_UPDATED'
    payload: PlayerInfo
}

export interface CreateGroupAction extends Action {
    type: '@@player/CREATE_GROUP_ACTION'
    payload: CreateGroupRequest
}

export interface SearchPlayerAction extends Action {
    type: '@@player/SEARCH_PLAYER'
    payload: SearchPlayer
}

export type PlayerActions = SearchPlayerAction | PlayerStateUpdatedAction | CreateGroupAction | NewGroupAction | GroupInviteChangeResultAction | EndOfGameAction | GroupInviteUpdateAction | ChangeInvitationStateAction | UpdateGroupAchievementsAction | UpdatePlayerAchievementsAction | UpdatePlayerDataAction | ReceivedGroupInviteAction; // use union type here