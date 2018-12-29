import {KaynClass, REGIONS} from 'kayn'
import { MatchV4MatchDto, MatchV4MatchTimelineDto } from 'kayn/typings/dtos';
import { KaynRequest} from 'kayn'
import { achievements } from 'achievement-models'
import { Achievement } from '../../../../common/achievement-models/models';

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
    public constructor(private riotApi: KaynClass) {

    }

    public processGame(gameId: number, platform: string): Promise<void> {
        console.log("Processing game " + gameId + " on " + platform)
        const region = this.mapPlatformToRegion(platform);
        const matchPromise = this.riotApi.MatchV4.get(gameId).region(region)
        const timelinePromise = this.riotApi.MatchV4.timeline(gameId).region(region);
        
        let matchData = null;
        let timelineData = null;
        matchPromise.then((data) => {
            matchData = data
            return timelinePromise;
        }).then((timeline) => {
            timelineData = timeline
        }).then(() => {
            // TODO foreach participant foreach team
            return achievements.map((achievement) => this.checkAchievement(achievement));
        })
        return Promise.resolve();
    }

    private checkAchievement(achievement: Achievement): boolean {
        for (let rule of achievement.rules) {
            switch (rule.type) {
                case "@@Rule/Player": 
                break;
                case "@@Rule/Team":
                break;
            }
        }
    }

    private mapPlatformToRegion(platform: string): string {
        return this.region[platform.toLowerCase()] || platform;
    }
}