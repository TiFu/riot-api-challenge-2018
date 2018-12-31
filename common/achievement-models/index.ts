import { Achievement, PlayerAchievement, TeamAchievement, GroupAchievement } from './models';
import { KillRule } from './rules';
import { MatchV4MatchDto, MatchV4MatchTimelineDto } from 'kayn/typings/dtos';
export { PlayerAchievement, TeamAchievement, GroupAchievement } from './models'

const testAchievement: PlayerAchievement = {
    id: 1,
    name: "Test",
    description: "Test Description",
    trophyImage: "",
    type: '@@Achievement/Player',
    rules: [
        new KillRule()
    ]
}

export const achievements: (PlayerAchievement | TeamAchievement | GroupAchievement)[] = [
    testAchievement
]

export let achievementMap: { [key: number]: (PlayerAchievement | TeamAchievement | GroupAchievement)} = {

}
for (const achv of achievements) {
    achievementMap[achv.id] = achv;
}


export function checkPlayerAchievement(encryptedAccountId: string, achievement: PlayerAchievement, game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto) {
    console.log("Checking player achievement")
    let success = true;
    for (const rule of achievement.rules) {
        success = success && rule.verify(encryptedAccountId, game, timeline);
    }
    return success;
}

export function checkGroupAchievement(encryptedAccountIds: string[], achievement: GroupAchievement, game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto) {
    let success = true;
    for (const rule of achievement.rules) {
        success = success && rule.verify(encryptedAccountIds, game, timeline);
    }
    return success;
}

export function checkTeamAchievement(teamId: 'blue' | 'red', achievement: TeamAchievement, game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto) {
    let success = true;
    for (const rule of achievement.rules) {
        success = success && rule.verify(teamId, game, timeline);
    }
    return success;
}