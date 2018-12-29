import { MatchV4MatchDto, MatchV4MatchTimelineDto } from 'kayn/typings/dtos';

export interface Achievement {
    id: number,
    name: string,
    description: string,
    trophyImage: string,
    type: AchievementType
    rules: Rule[],
}

export enum AchievementType {
    PLAYER,
    GROUP,
    TEAM
}

// Tagged Union!
export type Rule = PlayerRule | TeamRule

export abstract class PlayerRule {
    public readonly type: '@@Rule/Player' = "@@Rule/Player"

    public abstract verify(summonerId: number, game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): boolean;
}

export abstract class TeamRule {
    public readonly type: '@@Rule/Team' = '@@Rule/Team';
    public abstract verify(teamId: number, game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): boolean;
}