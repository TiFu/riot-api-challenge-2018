import { PlayerPartialInfo } from './player';
import { GroupId } from './group';

export type NewGameMessage = {
    gameId: number
    champId: number
    skinId: number
}

export type Achievement = {
    achievementId: number,
    achievedAt: string,
    championId: number,
    skinId: number
}

export type AchievementNotification = {
    achievement_ids: number[],
    championId: number,
    skinId?: number,
    achievedAt: Date,
    acquirer: PlayerPartialInfo | GroupId,
    acquirer_type: "PLAYER" | "GROUP"
}