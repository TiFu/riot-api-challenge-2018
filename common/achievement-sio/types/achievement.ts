import { PlayerPartialInfo } from './player';
import { GroupId } from './group';

export type NewGameMessage = number

export type Achievement = {
    achievementId: number,
    achievedAt: string
}

export type AchievementNotification = {
    achievement_ids: number[],
    acquirer: PlayerPartialInfo | GroupId,
    acquirer_type: "PLAYER" | "GROUP"
}