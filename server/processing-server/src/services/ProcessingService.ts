import {KaynClass, REGIONS} from 'kayn'
import { MatchV4MatchDto, MatchV4MatchTimelineDto } from 'kayn/typings/dtos';
import { KaynRequest} from 'kayn'

import { AchievementDatabase } from 'achievement-db';
import { PlayerAchievement } from 'achievement-models';

import { PlayerAchievementMessage, GroupAchievementMessage } from 'achievement-redis';
import { AchievementRedis } from 'achievement-redis';
import { Player } from 'achievement-db';
import { Game } from 'achievement-redis';
import { checkPlayerAchievementCategories } from 'achievement-models';
import { playerAchievementCategories } from 'achievement-models';
import { promises } from 'fs';
import { checkGroupAchievementCategories } from 'achievement-models';
import { groupAchievementCategories } from '../../../../common/achievement-models/achievements';

export class ProcessingService {
    private region: { [key: string]: string} = {
        "br1": "br",
        "br": "br",
        "eun1": "eune",
        "eune": "eune",
        "euw1": "euw",
        "euw": "euw",
        "jp1": "jp",
        "jp": "jp",
        "kr": "kr",
        "la1": "lan",
        "lan": "lan",
        "la2": "las",
        "las": "las",
        "na1": "na",
        "na": "na",
        "oce": "oce",
        "oc1": "oce",
        "tr1": "tr",
        "tr": "tr",
        "ru": "ru",
        "pbe": "pbe1",
        "pbe1": "pbe"
    }
    public constructor(private riotApi: KaynClass, private db: AchievementDatabase, private redis: AchievementRedis) {

    }

    public async processGame(game: Game): Promise<void> {
        console.log("Processing game " + game)
        const player = await this.db.PlayerDB.getPlayerById(game.playerId);
        if (!player) {
            console.log("Player " + game.playerId + " not found!");
            return null;
        }

        console.log("Platoform: ", game.platform)
        const region = this.mapPlatformToRegion(game.platform);
        const matchData = await this.riotApi.MatchV4.get(game.gameId).region(region)
        const timelineData = await this.riotApi.MatchV4.timeline(game.gameId).region(region);

        console.log("processing achievements for summoners")
        const playerAchievementMessages = await this.processAchievementsForSummoner(game, player, matchData, timelineData);
        console.log("Player Achievement Messages: " + playerAchievementMessages);
        // process game for groups
        console.log("Fetching groups!")
        const groups = await this.db.GroupDB.getGroupsForPlayer(game.playerId);
        console.log("Groups: ", groups);
        const [team1, team2] = await this.fetchPlayersForGame(matchData, game.platform);
        console.log("Player IDS: ", team1, team2);        
        let groupAchievements = []
        if (team1.every(a => a != null)) {        
            const groupAchievementsTeam1 = await this.processGroups(matchData, timelineData, groups, team1, game.platform);
            groupAchievements = groupAchievements.concat(groupAchievementsTeam1)
        }
        if (team2.every(a => a != null)) {        
            const groupAchievementsTeam2 = await this.processGroups(matchData, timelineData, groups, team2, game.platform);
            groupAchievements = groupAchievements.concat(groupAchievementsTeam2)
        }

        console.log("Group Achievements: ", groupAchievements);
        const noSubscribers = await this.redis.publishAchievementMessage({
            "playerAchievements": [playerAchievementMessages],
            "groupAchievements": groupAchievements
    });
    console.log("Published achievement message to " + noSubscribers + " subscribers");


    }

    private async processGroups(matchData: MatchV4MatchDto, timelineData: MatchV4MatchTimelineDto, groups: number[], playerIds: Player[], region: string): Promise<GroupAchievementMessage[]> {
        const result = await Promise.all(groups.map(g => this.checkAndProcessGroup(matchData, timelineData, g, playerIds, region)))
        return result.filter(f => f != null);        
    }

    private async checkAndProcessGroup(matchData: MatchV4MatchDto, timelineData: MatchV4MatchTimelineDto, group: number, playerIds: Player[], region: string) {
        const shouldProcess = this.checkGroup(group, playerIds);
        if (!shouldProcess) {
            return null;
        }

        const result = await this.processGroup(matchData, timelineData, group, playerIds, region);
        return result;
    }

    private async processGroup(matchData: MatchV4MatchDto, timelineData: MatchV4MatchTimelineDto, group: number, players: Player[], region: string) {
        const obtainedAchievementsArray = await this.db.AchievementDB.getGroupAchievements(group).then((a) => a.map(e => e.achievementId)) as ReadonlyArray<number>;
        const obtainedAchievementsSet = new Set<number>(obtainedAchievementsArray);
        const successIds = checkGroupAchievementCategories(players.map(p => p.encryptedAccountId), obtainedAchievementsSet, matchData, timelineData, groupAchievementCategories)
        console.log("Group: " +group + " obtained the following achievements: "  + successIds);

        const promises = [];
        const failedIds: number[] = [];
        const bestKdaChamp = this.findBestKdaChamp(matchData, players);
        for (const achievement of successIds) {
            promises.push(this.db.AchievementDB.addGroupAchievement(group, achievement, bestKdaChamp, players.map(p => p.id)).catch((err) => {
                console.log("Failed ids: ", err);
                failedIds.push(err);
            }));
        }

        const done = await Promise.all(promises);
        await this.db.AchievementDB.addGameToProcessedGroupGames(group, region, matchData.gameId);

        return {
            "groupId": group,
            "champId": bestKdaChamp,
            "participants": players,
            "achievedAt": new Date(),
            "platform": region,
            "achievements": successIds.filter(x => failedIds.indexOf(x) === -1)
        };

    }

    private findBestKdaChamp(matchData: MatchV4MatchDto, players: Player[]) {
        const accountIds = new Set<string>(players.map(p => p.encryptedAccountId));
        const participantIds = new Set<number>(matchData.participantIdentities.filter(pi => accountIds.has(pi.player.accountId)).map(pi => pi.participantId));

        return matchData.participants.filter(p => participantIds.has(p.participantId)).reduce((prev, p) => {
            const kda = (p.stats.kills + p.stats.assists) / (Math.max(p.stats.deaths, 1));
            if (prev["kda"] < kda) {
                return { "kda": kda, "champId": p.championId }
            } else {
                return prev;
            }
        }, { "kda": -1, "champId": 0})["champId"]
    }
    private async checkGroup(group: number, playerIds: Player[]) {
        const promises: Promise<boolean>[] = []
        playerIds.forEach(p => promises.push(this.db.GroupDB.isMember(p.id, group)));

        const result = await Promise.all(promises);
        const allMembers = result.every((r) => r);
        return allMembers;
    }

    private async fetchPlayersForGame(matchData: MatchV4MatchDto, region: string): Promise<[Player[], Player[]]> {
        const promises: Promise<{ "team": number, "player": Player}>[] = [];
        for (const i in matchData.participantIdentities) {
            const player = this.db.PlayerDB.getPlayerByEncryptedAccountId(matchData.participantIdentities[i].player.accountId, region).then((p) => {
                return {
                    "team": matchData.participants[i].teamId,
                    "player": p
                }
            });
            promises.push(player);
        }

        const players = await Promise.all(promises);
        const team1 = players.filter(p => p["team"] == 100).map(p => p.player);
        const team2 = players.filter(p => p["team"] == 200).map(p => p.player);
        return [team1, team2]
    }

    private async processAchievementsForSummoner(game: Game, player: Player, 
                                            matchData: MatchV4MatchDto, timelineData: MatchV4MatchTimelineDto): Promise<PlayerAchievementMessage | null> {
        const alreadyChecked = await this.db.AchievementDB.checkIfPlayerAndGameWereAlreadyProcessed(player.id, player.region, matchData.gameId as number);
        if (alreadyChecked) {
            console.log("Already checked game " + matchData.gameId + " for player " + player);
            return null;
        }        

        await this.db.AchievementDB.addGameToProcessedGames(player.id, player.region, matchData.gameId);
        const result = await this.processAchievementsForExistingSummoner(game, player, player.encryptedAccountId, matchData, timelineData)
        return result;
    }

    private async processAchievementsForExistingSummoner(game: Game, player: Player, encryptedAccountId: string, matchData: MatchV4MatchDto, timelineData: MatchV4MatchTimelineDto) {      
        const obtainedAchievementsArray = await this.db.AchievementDB.getPlayerAchievements(player.id).then((a) => a.map(e => e.achievementId)) as ReadonlyArray<number>;
        const obtainedAchievementsSet = new Set<number>(obtainedAchievementsArray);
        const successIds = checkPlayerAchievementCategories(encryptedAccountId, obtainedAchievementsSet, matchData, timelineData, playerAchievementCategories)
        console.log(player, " obtained " + successIds.length + " new achievements for his perfomance in ", game);
        const promises = [];
        const failedIds: number[] = [];
        for (const achievement of successIds) {
            promises.push(this.db.AchievementDB.addAchievement(player.id, achievement, game.champId, game.skinId).catch((err) => {
                failedIds.push(err);
            }));
        }

        const done = await Promise.all(promises);
        return {
            "champId": game.champId,
            "skinId": game.skinId,
            "accountId": player.accountId,
            achievedAt: new Date(),
            "playerName": player.name,
            "platform": player.region,
            "achievements": successIds.filter(x => failedIds.indexOf(x) === -1)
        };
    }


    private mapPlatformToRegion(platform: string): string {
        return this.region[platform.toLowerCase()] || platform;
    }
}