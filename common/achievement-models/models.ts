import { MatchV4MatchDto, MatchV4MatchTimelineDto } from 'kayn/typings/dtos';

export type AchievementId = number

export class AchievemenCategory<T extends Achievement<any>> {
    
    public constructor(public readonly trophyImages: { "completionState": number, "trophyImage": string}[], public readonly name: string, public readonly description: string, public readonly icon: string, protected readonly firstAchievement: AchievementGroup<T>) {
    }

    public getFirstGroup(): AchievementGroup<T> {
        return this.firstAchievement
    }

    protected getObtainableAchievements(obtainedAchievements: Set<AchievementId>): T[] {
        const queue = [this.firstAchievement];
        let currentAchievementGroup = queue.pop();
        const obtainableAchievements: T[] = []
        while (currentAchievementGroup) {
            addAllAchievements(currentAchievementGroup, obtainableAchievements)
            // Check if next categories were unlocked
            if (obtainedAchievements.has(currentAchievementGroup.levels[0].id)) {
                currentAchievementGroup.childAchievements.forEach(c => queue.push(c));
            }
            currentAchievementGroup = queue.pop();
        }
        console.log("Obtainable achievements: ", obtainableAchievements);
        return obtainableAchievements.filter(a => !obtainedAchievements.has(a.id))
    }
}

export class PlayerAchievementCategory extends AchievemenCategory<PlayerAchievement> {

    public checkCategory(encryptedAccountId: string, obtainedAchievements: Set<AchievementId>, game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): AchievementId[] {  
        return this.getObtainableAchievements(obtainedAchievements).filter(a => a.checkAchievement(encryptedAccountId, a, game, timeline)).map(a => a.id);
    }
}

export class GroupAchievementCategory extends AchievemenCategory<GroupAchievement> {
    
    public checkCategory(accountIds: string[], obtainedAchievements: Set<AchievementId>, game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): AchievementId[] {  
        return this.getObtainableAchievements(obtainedAchievements).filter(a => a.checkAchievement(accountIds, game, timeline)).map(a => a.id);
    }

}
export type PlayerAchievementGroup = AchievementGroup<PlayerAchievement>
export type GroupAchievementGroup = AchievementGroup<GroupAchievement>

export interface AchievementGroup<T extends Achievement<any>> {
    name: string
    childAchievements: AchievementGroup<T>[],
    levels: T[],
}

export class Achievement<T extends PlayerRule | GroupRule> {
    
    public constructor(public readonly id: AchievementId, public readonly unlockMessage: string, public readonly name: string, public readonly description: string, protected readonly rules: T[]) {

    }
}

export class PlayerAchievement extends Achievement<PlayerRule> {
    public readonly type: '@@Achievement/Player' = '@@Achievement/Player';


    public checkAchievement(encryptedAccountId: string, achievement: PlayerAchievement, game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto) {
        console.log("Checking player achievement")
        let success = true;
        for (const rule of this.rules) {
            success = success && rule.verify(encryptedAccountId, game, timeline);
        }
        return success;
    }
    
}


export class GroupAchievement extends Achievement<GroupRule> {
    public readonly type: '@@Achievement/Group' = '@@Achievement/Group'


    public checkAchievement(accountId: string[], game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto) {
        let success = true;
        for (const rule of this.rules) {
            success = success && rule.verify(accountId, game, timeline);
        }
        return success;
    }
}

// Tagged Union!
export abstract class PlayerRule {
    public readonly type: '@@Rule/Player' = "@@Rule/Player"

    public abstract verify(summonerId: string, game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): boolean;
}

export abstract class GroupRule {
    public readonly type: '@@Rule/Group' = '@@Rule/Group'
    public abstract verify(accountIds: string[], game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): boolean;
}

function addAllAchievements<T extends Achievement<any>>(achievement: AchievementGroup<T>, ids: T[]) {
    for (const child of achievement.levels) {
        ids.push(child);
    }
}
