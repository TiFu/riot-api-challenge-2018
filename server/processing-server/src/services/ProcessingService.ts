import {KaynClass, REGIONS} from 'kayn'
import { MatchV4MatchDto, MatchV4MatchTimelineDto } from 'kayn/typings/dtos';
import { KaynRequest} from 'kayn'

import { AchievementDatabase } from 'achievement-db';
import { PlayerAchievement } from 'achievement-models';

import { PlayerAchievementMessage } from 'achievement-redis';
import { AchievementRedis } from 'achievement-redis';
import { Player } from 'achievement-db';
import { Game } from 'achievement-redis';
import { checkPlayerAchievementCategories } from 'achievement-models';
import { playerAchievementCategories } from 'achievement-models';

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

        const region = this.mapPlatformToRegion(game.platform);
        const matchData = await this.riotApi.MatchV4.get(game.gameId).region(region)
        const timelineData = await this.riotApi.MatchV4.timeline(game.gameId).region(region);

        console.log("processing achievements for summoners")
        const playerAchievementMessages = await this.processAchievementsForSummoner(game, player, matchData, timelineData);
        const noSubscribers = await this.redis.publishAchievementMessage({
                                        "playerAchievements": [playerAchievementMessages]
                                });
        console.log("Published achievement message to " + noSubscribers + " subscribers");
    }

    private async processAchievementsForSummoner(game: Game, player: Player, 
                                            matchData: MatchV4MatchDto, timelineData: MatchV4MatchTimelineDto): Promise<PlayerAchievementMessage | null> {
        const alreadyChecked = await this.db.AchievementDB.checkIfPlayerAndGameWereAlreadyProcessed(player.id, player.region, matchData.gameId as number);
        if (alreadyChecked) {
            console.log("Already checked game " + matchData.gameId + " for player " + player);
            return null;
        }        
        
        await this.db.AchievementDB.addGameToProcessedGames(player.id, player.region, matchData.gameId);
        return this.processAchievementsForExistingSummoner(game, player, player.encryptedAccountId, matchData, timelineData)
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
            "playerName": player.name,
            "platform": player.region,
            "achievements": successIds.filter(x => failedIds.indexOf(x) === -1)
        };
    }


    private mapPlatformToRegion(platform: string): string {
        return this.region[platform.toLowerCase()] || platform;
    }
}