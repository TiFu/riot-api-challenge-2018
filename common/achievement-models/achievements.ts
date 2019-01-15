import { PlayerAchievement, PlayerAchievementGroup, GroupAchievement, PlayerAchievementCategory, GroupAchievementCategory, AchievementId, Achievement, AchievementGroup, GroupAchievementGroup, AchievemenCategory } from './models';
import { KillRule } from './rules';
import { GroupKillRule } from './group_rules';

import { MatchV4MatchDto, MatchV4MatchTimelineDto } from 'kayn/typings/dtos';



// TOP LANE
const group1Level0: PlayerAchievement = new PlayerAchievement(1, "", "Test unlock message", "test", "test desc", [new KillRule()]);
export const group1: PlayerAchievementGroup = {
    name: "Test",
    childAchievements: [],
    levels: [group1Level0],
}

const topCategory = new PlayerAchievementCategory([{ completionState: 0.0, trophyImage: "trophies.png"}], "Test", "desc", "icon", group1);

// Jungle
const jungleCategory = new PlayerAchievementCategory([{ completionState: 0.0, trophyImage: "trophies.png"}], "Test", "desc", "icon", group1);


// Mid
const midCategory = new PlayerAchievementCategory([{ completionState: 0.0, trophyImage: "trophies.png"}], "Test", "desc", "icon", group1);


// Support
const supportCategory = new PlayerAchievementCategory([{ completionState: 0.0, trophyImage: "trophies.png"}], "Test", "desc", "icon", group1);

// ADC
const adcCategory = new PlayerAchievementCategory([{ completionState: 0.0, trophyImage: "trophies.png"}], "Test", "desc", "icon", group1);


// Clown
const clownCategory = new PlayerAchievementCategory([{ completionState: 0.0, trophyImage: "trophies.png"}], "Test", "desc", "icon", group1);

type PlayerAchievementCategories = {
    "top": PlayerAchievementCategory,
    "jungle": PlayerAchievementCategory,
    "mid": PlayerAchievementCategory,
    "support": PlayerAchievementCategory,
    "adc": PlayerAchievementCategory,
    "clownfiesta": PlayerAchievementCategory
}


export const playerAchievementCategories: PlayerAchievementCategories = {
    "top": topCategory,
    "jungle": jungleCategory,
    "mid": midCategory,
    "support": supportCategory,
    "adc": adcCategory,
    "clownfiesta": clownCategory
}



// Group Achievement Category
const group2Level0: GroupAchievement = new GroupAchievement(2, "", "test unlock message", "achievement2 test name", "desc", [ new GroupKillRule() ]);
const group3Level0: GroupAchievement = new GroupAchievement(3, "", "test unlock message", "achievement3 test name", "desc", [ new GroupKillRule() ]);

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
    new GroupAchievementCategory([{ completionState: 0.0, trophyImage: "trophies.png"}], "Group Test", "Test Description", "", group2)
]

export const achievementMap = new Map<number, Achievement<any>>()

for (const categoryName in playerAchievementCategories) {
    const category = (playerAchievementCategories as any)[categoryName];
    iterateAndFillMap(category, achievementMap);
}
for (const category of groupAchievementCategories) {
    iterateAndFillMap(category, achievementMap);
}

function iterateAndFillMap(category: AchievemenCategory<any>, map: Map<number, Achievement<any>>) {
    const groups = [category.getFirstGroup()]
    while (groups.length > 0) {
        const group = groups.pop() as AchievementGroup<any>;
        if (group.levels)
            group.levels.forEach(a => map.set(a.id, a));
        if (group.childAchievements)
            group.childAchievements.forEach(a => groups.push(a));
    }
}




export function checkPlayerAchievementCategories(encryptedAccountId: string, obtainedAchievements: Set<AchievementId>, game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto, playerAchievementCategories: { [key: string]: PlayerAchievementCategory}) {
    const allObtainedIds: AchievementId[] = [];
    for (const categoryName in playerAchievementCategories) {
        const category = playerAchievementCategories[categoryName];
        const newlyObtainedAchievements = category.checkCategory(encryptedAccountId, obtainedAchievements, game, timeline);
        newlyObtainedAchievements.forEach(a => allObtainedIds.push(a));
    }
    return allObtainedIds;
}

export function checkGroupAchievementCategories(accountIds: string[], obtainedAchievements: Set<AchievementId>, game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto, groupAchievementCategories: GroupAchievementCategory[]) {
    const allObtainedIds: AchievementId[] = [];
    for (const category of groupAchievementCategories) {
        const newlyObtainedAchievements = category.checkCategory(accountIds, obtainedAchievements, game, timeline);
        newlyObtainedAchievements.forEach(a => allObtainedIds.push(a));
    }
    return allObtainedIds;
}

export function getCategoryCompletionState(category: AchievemenCategory<any>, obtainedAchievements: Set<number>) {
    const [achieved, total ]= groupCompletionState(category.getFirstGroup(), obtainedAchievements);
    return achieved / total;
}

export function getObtainableIds(category: AchievemenCategory<any>, obtainedAchievements: Set<number>) {
    return obtainableIdsByGroup(category.getFirstGroup(), obtainedAchievements)
}

function obtainableIdsByGroup(group: AchievementGroup<PlayerAchievement | GroupAchievement>, obtainedAchievements: Set<number>): number[] {
    const success = group.levels.some(l => obtainedAchievements.has(l.id));
    const obtainable: number[] = []
    if (success) {
        for (const childGroup of group.childAchievements) {
            obtainableIdsByGroup(childGroup, obtainedAchievements).forEach(a => obtainable.push(a));
        }
    }
    group.levels.filter(l => !obtainedAchievements.has(l.id)).forEach(l => obtainable.push(l.id));
    return obtainable;
}

function groupCompletionState(group: AchievementGroup<PlayerAchievement | GroupAchievement>, obtainedAchievements: Set<number>): [number, number] {
    let total = 0
    let achieved = 0;
    for (const level of group.levels) {
        if (obtainedAchievements.has(level.id)) {
            achieved++;
        } 
        total++;
    }
    for (const child of group.childAchievements) {
        const [childAchieved, childTotal] = groupCompletionState(child, obtainedAchievements)
        total += childTotal
        achieved += childAchieved
    }
    return [achieved, total];
}