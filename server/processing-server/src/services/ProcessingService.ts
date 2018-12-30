import {KaynClass, REGIONS} from 'kayn'
import { MatchV4MatchDto, MatchV4MatchTimelineDto } from 'kayn/typings/dtos';
import { KaynRequest} from 'kayn'
import { achievements } from 'achievement-models'
import { AchievementDB } from 'achievement-db';
import { PlayerAchievement } from 'achievement-models';
import { checkPlayerAchievement } from 'achievement-models';
import { PlayerAchievementMessage } from 'achievement-redis';
import { AchievementRedis } from 'achievement-redis';
import { Player } from 'achievement-db';

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
    public constructor(private riotApi: KaynClass, private db: AchievementDB, private redis: AchievementRedis) {

    }

    public processGame(gameId: number, platform: string): Promise<void> {
        console.log("Processing game " + gameId + " on " + platform)
        const region = this.mapPlatformToRegion(platform);
        const matchPromise = this.riotApi.MatchV4.get(gameId).region(region)
        const timelinePromise = this.riotApi.MatchV4.timeline(gameId).region(region);
        
        const promise =  new Promise<[MatchV4MatchDto, MatchV4MatchTimelineDto]>((resolve, reject) => {
            matchPromise.then((match) => {
                return timelinePromise.then((timeline) => {
                    resolve([match, timeline]);
                }).catch((err) =>{ 
                    reject(err);
                })
            }).catch((err) => {
                reject(err);
            })
        }).then(([matchData, timelineData]) => {
            // TODO foreach participant foreach team       
            console.log("processing achievements for summoners")
            return this.processAchievementsForSummoners(matchData, timelineData);
        }).then((messages: PlayerAchievementMessage[]) => {
            console.log("Publisihng: ", messages)
            return this.redis.publishAchievementMessage({
                "playerAchievements": messages
            });
        }).then((no) => {
            console.log("Published achievement message to " + no + " subscribers");
        }); 

        return promise;

    }

    private processAchievementsForSummoners(matchData: MatchV4MatchDto, timelineData: MatchV4MatchTimelineDto): Promise<PlayerAchievementMessage[]> {
        if (!matchData.participantIdentities) {
            // TODO: may want to communicate this error to frontend
            throw new Error("Match Data is missing participant identities! Can't process this match!");
        }

        const promises = []
        for (const player of matchData.participantIdentities) {
            console.log("Player in identities: ", player)
            if (player.player) {
                promises.push(this.processAchievementsForSummoner(player.player.summonerName as string, (player.player.platformId as string).toLowerCase(),
                        player.player.currentAccountId as string, matchData, timelineData))   
            }
        }
        return Promise.all(promises).then((messages) => {
            return messages.filter(m => m != null && m.achievements.length > 0) as PlayerAchievementMessage[];
        });
    }

    private processAchievementsForSummoner(summonerName: string, platform: string, encryptedAccountId: string, 
                                            matchData: MatchV4MatchDto, timelineData: MatchV4MatchTimelineDto): Promise<PlayerAchievementMessage | null> {
        return this.db.getPlayer(encryptedAccountId, platform).then((player: Player | null) => {
            if (!player) {
                console.log("Player " + encryptedAccountId + " and region " + platform + " not found!");
                return Promise.resolve(null);
            } else {
                console.log("Player " + encryptedAccountId + " and region " + platform + " found!");
                return this.processAchievementsForExistingSummoner(encryptedAccountId, matchData, timelineData, player);
            }
        });
    }

    private processAchievementsForExistingSummoner(encryptedAccountId: string, matchData: MatchV4MatchDto, timelineData: MatchV4MatchTimelineDto, player: Player) {
        console.log("Achievements: " + achievements);
        const successIds = achievements.filter(x => x.type == '@@Achievement/Player').filter((achievement) => {
            const real_achievement = achievement as PlayerAchievement;
            return checkPlayerAchievement(encryptedAccountId, real_achievement, matchData, timelineData);
        }).map((success) => success.id);
        const promises = [];
        const failedIds: number[] = [];
        for (const achievement of successIds) {
            promises.push(this.db.addAchievement(player.id, achievement).catch((err) => {
                failedIds.push(err);
            }));
        }
        return Promise.all(promises).then(() => {
            return {
                "accountId": player.accountId,
                "playerName": player.name,
                "platform": player.region,
                "achievements": successIds.filter(x => failedIds.indexOf(x) === -1)
            };
        });
    }

    private mapPlatformToRegion(platform: string): string {
        return this.region[platform.toLowerCase()] || platform;
    }
}