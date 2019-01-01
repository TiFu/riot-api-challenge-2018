import {NewGameMessage, SearchPlayerMessage, PublicPlayerData} from 'achievement-sio'
import { AchievementRedis } from 'achievement-redis';
import { NotificationService } from './notification-service';
import { PlayerPartialInfo } from '../../../../common/achievement-sio/types/player';

export class AchievementService {

    public constructor(private achievementRedis: AchievementRedis, private subscribeRedis: AchievementRedis, private notificationservice: NotificationService) {
        this.subscribeRedis.subscribeToAchievementEvents((msg) => {
            console.log("notifying users of new achievements!");
            for (const player of msg.playerAchievements) {
                this.notificationservice.notifyAchievement(player.accountId, player.platform, {
                    "achievement_ids": player.achievements,
                    "championId": player.champId,
                    "skinId": player.skinId,
                    "acquirer": { 
                        "id": player.accountId,
                        "region": player.platform,
                        "name": player.playerName 
                    },
                    "acquirer_type": "PLAYER"
                })
            }
        })
    }
    
    public processNewGameMessage(msg: NewGameMessage, platform: string): void {
        console.log("Processing new game message: "+ msg);
        this.achievementRedis.addGameToProcessingQueue(msg.gameId, platform, msg.champId, msg.skinId).then(() => {
            console.log("Added game ", msg, " on platform " + platform + " to the processing queue!")
        }).catch((err) => {
            console.error("Failed to add game to processing queue: ", err)
        });
    }

    public searchPlayer(msg: SearchPlayerMessage): Promise<PlayerPartialInfo[]> {        
        return Promise.resolve([{
            id: 4,
            name: "Test",
            region: "euw1"
        }]);
    }

}