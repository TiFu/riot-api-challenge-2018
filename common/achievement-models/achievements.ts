import { PlayerAchievement, PlayerAchievementGroup, GroupAchievement, PlayerAchievementCategory, GroupAchievementCategory, AchievementId, Achievement, AchievementGroup, GroupAchievementGroup } from './models';
import { KillRule } from './rules';
import { GroupKillRule } from './group_rules';

import { MatchV4MatchDto, MatchV4MatchTimelineDto } from 'kayn/typings/dtos';


const group1Level0: PlayerAchievement = new PlayerAchievement(1, "Test unlock message", "test", "test desc", [new KillRule()]);
export const group1: PlayerAchievementGroup = {
    name: "Test",
    childAchievements: [],
    levels: [group1Level0],
}




export const playerAchievementCategories: PlayerAchievementCategory[] = [
    new PlayerAchievementCategory("", "Test", "desc", "icon", group1),
    new PlayerAchievementCategory("", "Test2", "desc", "icon", group1)
]

const group2Level0: GroupAchievement = new GroupAchievement(2, "test unlock message", "test name", "desc", [ new GroupKillRule() ]);
const group3Level0: GroupAchievement = new GroupAchievement(3, "test unlock message", "test name", "desc", [ new GroupKillRule() ]);

const group2: GroupAchievementGroup = {
    name: "Test",
    childAchievements: [],
    levels: [group2Level0, group3Level0]
}
const group3: GroupAchievementGroup = {
    name: "Test2",
    childAchievements: [],
    levels: [group3Level0]
}

export const groupAchievementCategories: GroupAchievementCategory[] = [
    new GroupAchievementCategory("", "Group Test", "Test Description", "", group2),
    new GroupAchievementCategory("", "Group Test", "Test Description", "", group3)
]

export function checkPlayerAchievementCategories(encryptedAccountId: string, obtainedAchievements: Set<AchievementId>, game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto, playerAchievementCategories: PlayerAchievementCategory[]) {
    const allObtainedIds: AchievementId[] = [];
    for (const category of playerAchievementCategories) {
        const newlyObtainedAchievements = category.checkCategory(encryptedAccountId, obtainedAchievements, game, timeline);
        newlyObtainedAchievements.forEach(a => allObtainedIds.push(a));
    }
    return allObtainedIds;
}

export function checkGroupAchievementCategories(accountIds: string[], obtainedAchievements: Set<AchievementId>, game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto, playerAchievementCategories: PlayerAchievementCategory[]) {
    const allObtainedIds: AchievementId[] = [];
    for (const category of groupAchievementCategories) {
        const newlyObtainedAchievements = category.checkCategory(accountIds, obtainedAchievements, game, timeline);
        newlyObtainedAchievements.forEach(a => allObtainedIds.push(a));
    }
    return allObtainedIds;
}