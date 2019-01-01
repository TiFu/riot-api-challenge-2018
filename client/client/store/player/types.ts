import {Action} from 'redux'
import { NewGameMessage, Achievement } from 'achievement-sio';

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

export interface UpdateAchievementsAction extends Action {
    type: '@@player/ACHIEVEMENTS_UPDATED'
    payload: Achievement[]
}

export interface EndOfGameAction extends Action {
    type: '@@player/END_OF_GAME',
    payload: NewGameMessage
}

export interface PlayerState {
    playerInfo?: PlayerInfo
    playerAchievements?: PlayerAchievementEntry[]
}

export interface PlayerStateUpdatedAction extends Action {
    type: '@@player/PLAYER_STATE_UPDATED'
    payload: PlayerInfo
}

export type PlayerActions = PlayerStateUpdatedAction | EndOfGameAction | UpdateAchievementsAction; // use union type here