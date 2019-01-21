import { PlayerAchievement, PlayerAchievementGroup, GroupAchievement, PlayerAchievementCategory, GroupAchievementCategory, AchievementId, Achievement, AchievementGroup, GroupAchievementGroup, AchievemenCategory } from './models';
import { KillRule } from './rules';
import { GroupKillRule } from './group_rules';

import { MatchV4MatchDto, MatchV4MatchTimelineDto } from 'kayn/typings/dtos';

/*
const group1Level0: PlayerAchievement = new PlayerAchievement(1, 0, "", "Test unlock message", "test", "test desc", [new KillRule()]);
const group5Level0: PlayerAchievement = new PlayerAchievement(6, 1, "", "Test unlock message", "test 6", "test desc", [new KillRule()]);

export const group5: PlayerAchievementGroup = {
    name: "Test3",
    childAchievements: [],
    levels: [group5Level0]
}
export const group1: PlayerAchievementGroup = {
    name: "Test1",
    childAchievements: [group5],
    levels: [group1Level0]
} */

// [0], [1, 2], [3, 4, 5]
//ADC
const group50Level0: PlayerAchievement = new PlayerAchievement(500, 0, "", "Test unlock message", "Farmerama", "You rise and fall by your farming skill. Proof that you are a good farmer, have 65/75/90 CS at 10 minutes.", [new KillRule()]);
const group50Level1: PlayerAchievement = new PlayerAchievement(501, 1, "", "Test unlock message", "Farmerama", "You rise and fall by your farming skill. Have 75/90 CS at 10 minutes.", [new KillRule()]);
const group50Level2: PlayerAchievement = new PlayerAchievement(502, 2, "", "Test unlock message", "Farmerama", "You farm well indeed. Can you manage 90 CS at 10 minutes?", [new KillRule()]);

const group51Level0: PlayerAchievement = new PlayerAchievement(510, 0, "", "Test unlock message", "I will carry you", "It's called carry for a reason. Win a game with more than 25k/35k/50k damage dealt to champions.", [new KillRule()]);
const group51Level1: PlayerAchievement = new PlayerAchievement(511, 1, "", "Test unlock message", "I will carry you", "It's called carry for a reason. Win a game with more than 35k/50k damage dealt to champions.", [new KillRule()]);
const group51Level2: PlayerAchievement = new PlayerAchievement(512, 2, "", "Test unlock message", "I will carry you", "GG no bot my a**. Win a game with more than 50k damage dealt to champions.", [new KillRule()]);

const group52Level0: PlayerAchievement = new PlayerAchievement(520, 0, "", "Test unlock message", "Hi I'm support", "Report my team for ks! Finish a game while having less than 2/1/0 kills and at least 5/7/10 assists.", [new KillRule()]);
const group52Level1: PlayerAchievement = new PlayerAchievement(521, 1, "", "Test unlock message", "Hi I'm support", "Report my team for ks! Finish a game while having less than 1/0 kills and at least 7/10 assists.", [new KillRule()]);
const group52Level2: PlayerAchievement = new PlayerAchievement(522, 2, "", "Test unlock message", "Hi I'm support", "Maybe I should find another job. Finish a game while having 0 kills and at least 10 assists.", [new KillRule()]);

const group53Level0: PlayerAchievement = new PlayerAchievement(530, 0, "", "Test unlock message", "I will hunt you down", "Passive laning is boring. Score a double kill before 15/10/5 minutes into the game.", [new KillRule()]);
const group53Level1: PlayerAchievement = new PlayerAchievement(531, 1, "", "Test unlock message", "I will hunt you down", "Passive laning is boring. Score a double kill before 10/5 minutes into the game.", [new KillRule()]);
const group53Level2: PlayerAchievement = new PlayerAchievement(532, 2, "", "Test unlock message", "I will hunt you down", "Channel your inner Draven. Score a double kill before 5 minutes into the game.", [new KillRule()]);

const group54Level0: PlayerAchievement = new PlayerAchievement(540, 0, "", "Test unlock message", "Strong and independent", "I don't need protection. Get 2/4/7 solo kills in one game.", [new KillRule()]);
const group54Level1: PlayerAchievement = new PlayerAchievement(541, 1, "", "Test unlock message", "Strong and independent", "I don't need protection. Get 4/7 solo kills in one game.", [new KillRule()]);
const group54Level2: PlayerAchievement = new PlayerAchievement(542, 2, "", "Test unlock message", "Strong and independent", "Support, you are fired! Get 7 solo kills in one game.", [new KillRule()]);

const group55Level0: PlayerAchievement = new PlayerAchievement(550, 0, "", "Test unlock message", "Squishy?", "Tired of being one-shot? Build a Bramble Vest before 20/15/10 minutes and keep it until the end of the game. Oh, and winning is important as well.", [new KillRule()]);
const group55Level1: PlayerAchievement = new PlayerAchievement(551, 1, "", "Test unlock message", "Squishy?", "Tired of being one-shot? Build a Bramble Vest before 15/10 minutes and keep it until the end of the game. Oh, and winning is important as well.", [new KillRule()]);
const group55Level2: PlayerAchievement = new PlayerAchievement(552, 2, "", "Test unlock message", "Squishy?", "Better than Executioner's Calling, trust me. Build a Bramble Vest before 10 minutes and keep it until the end of the game. Oh, and winning is important as well.", [new KillRule()]);

export const group55: PlayerAchievementGroup = {
    name: "Squishy?",
    childAchievements: [],
    levels: [group55Level0, group55Level1, group55Level2],
}
export const group54: PlayerAchievementGroup = {
    name: "Strong and independent",
    childAchievements: [],
    levels: [group54Level0, group54Level1, group54Level2],
}
export const group53: PlayerAchievementGroup = {
    name: "I will hunt you down",
    childAchievements: [],
    levels: [group53Level0, group53Level1, group53Level2]
}
export const group52: PlayerAchievementGroup = {
    name: "Hi I'm support",
    childAchievements: [group55],
    levels: [group52Level0, group52Level1, group52Level2],
}
export const group51: PlayerAchievementGroup = {
    name: "I will carry you",
    childAchievements: [group53, group54],
    levels: [group51Level0, group51Level1, group51Level2],
}
export const group50: PlayerAchievementGroup = {
    name: "Farmerama",
    childAchievements: [group51, group52],
    levels: [group50Level0, group50Level1, group50Level2]
}


// Clown ID 1xx
const clownCategory = new PlayerAchievementCategory([{ completionState: 0.0, trophyImage: "trophies.png"}], "Test", "desc", "./assets/lanes/top.png", group50);

//Top ID 2xx
const topCategory = new PlayerAchievementCategory([{ completionState: 0.0, trophyImage: "1x1.png"}], "Test", "desc", "./assets/lanes/top.png", group50);

// Jungle ID 3xx
const jungleCategory = new PlayerAchievementCategory([{ completionState: 0.0, trophyImage: "trophies.png"}], "Test", "desc", "./assets/lanes/jungle.png", group50);

// Mid ID 4xx
const midCategory = new PlayerAchievementCategory([{ completionState: 0.0, trophyImage: "trophies.png"}], "Test", "desc", "./assets/lanes/middle.png", group50);

// ADC ID 5xx
const adcCategory = new PlayerAchievementCategory([{ completionState: 0.0, trophyImage: "1x1.png"}, { completionState: 0.15, trophyImage: "adc_1.png"}, { completionState: 0.44, trophyImage: "adc_2.png"}, { completionState: 0.71, trophyImage: "adc_3.png"}, { completionState: 0.99, trophyImage: "adc_4.png"}], "Test", "desc", "./assets/lanes/bottom.png", group50);

// Support ID 6xx
const supportCategory = new PlayerAchievementCategory([{ completionState: 0.0, trophyImage: "trophies.png"}], "Test", "desc", "./assets/lanes/support.png", group50);


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
const group2Level0: GroupAchievement = new GroupAchievement(2, 0,  "", "test unlock message", "achievement2 test name", "desc", [ new GroupKillRule() ]);
const group3Level0: GroupAchievement = new GroupAchievement(3, 0, "", "test unlock message", "achievement3 test name", "desc", [ new GroupKillRule() ]);

const group3: GroupAchievementGroup = {
    name: "Test2",
    childAchievements: [],
    levels: [group3Level0]
}
const group2: GroupAchievementGroup = {
    name: "Test",
    childAchievements: [group3],
    levels: [group2Level0]
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

export function filterForLowestObtainableId(obtainableIds: Set<number>, group: AchievementGroup<any>) {

    const ids = group.levels.map(l => l.id);
    let remove = false;
    let log = false;
    for (let i = 0; i < ids.length; i++) {
        if (ids[i] == 530 || ids[i] == 531 || ids[i] == 532) {
            log = true
        }
        if (remove) {
            if (log) {
                console.log("[filter] Removing " + ids[i])
            }
            obtainableIds.delete(ids[i])
        } else if (obtainableIds.has(ids[i])) {
            if (log) {
                console.log("[filter] Lowest ID: " + ids[i] + " was in obtainable id set.")
            }
            remove = true;
        }
    }
    for (let child of group.childAchievements) {
        filterForLowestObtainableId(obtainableIds, child);
    }
    return obtainableIds;
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