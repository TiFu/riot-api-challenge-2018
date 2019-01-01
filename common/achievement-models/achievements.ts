import { PlayerAchievement, PlayerAchievementGroup, GroupAchievement, PlayerAchievementCategory, GroupAchievementCategory, AchievementId, Achievement, AchievementGroup } from './models';
import { KillRule } from './rules';
import { MatchV4MatchDto, MatchV4MatchTimelineDto } from 'kayn/typings/dtos';


const group1Level0: PlayerAchievement = new PlayerAchievement(1, "Test unlock message", "test", "test desc", [new KillRule()]);
export const group1: PlayerAchievementGroup = {
    name: "Test",
    childAchievements: [],
    levels: [group1Level0],
}




export const playerAchievementCategories: PlayerAchievementCategory[] = [
    new PlayerAchievementCategory("", "Test", "desc", "icon", group1)
]

export const groupAchievementCategories: GroupAchievementCategory[] = [

]

export function checkPlayerAchievementCategories(encryptedAccountId: string, obtainedAchievements: Set<AchievementId>, game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto, playerAchievementCategories: PlayerAchievementCategory[]) {
    const allObtainedIds: AchievementId[] = [];
    for (const category of playerAchievementCategories) {
        const newlyObtainedAchievements = category.checkCategory(encryptedAccountId, obtainedAchievements, game, timeline);
        newlyObtainedAchievements.forEach(a => allObtainedIds.push(a));
    }
    return allObtainedIds;
}
