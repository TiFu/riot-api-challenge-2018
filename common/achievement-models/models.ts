import { MatchV4MatchDto, MatchV4MatchTimelineDto } from 'kayn/typings/dtos';

export interface Achievement {
    id: number,
    parent?: number, // parent of this achievement - for e.g. multiple achievement levels
    name: string,
    description: string,
    trophyImage: string,
}

export interface PlayerAchievement extends Achievement {
    type: '@@Achievement/Player';
    rules: PlayerRule[]
}

export interface TeamAchievement extends Achievement {
    type: '@@Achievement/Team';
    rules: TeamRule[]
}

export interface GroupAchievement extends Achievement {
    type: '@@Achievement/Group'
    rules: GroupRule[]
}

// Tagged Union!
export abstract class PlayerRule {
    public readonly type: '@@Rule/Player' = "@@Rule/Player"

    public abstract verify(summonerId: string, game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): boolean;
}

export abstract class TeamRule {
    public readonly type: '@@Rule/Team' = '@@Rule/Team';
    public abstract verify(teamId: 'blue' | 'red', game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): boolean;
}

export abstract class GroupRule {
    public readonly type: '@@Rule/Group' = '@@Rule/Group'
    public abstract verify(participants: string[], game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): boolean;
}