import {NewGameMessage, SearchPlayerMessage, PublicPlayerData} from 'achievement-sio'
import { AchievementRedis } from 'achievement-redis';
import { NotificationService } from './notification-service';

export class AchievementService {

    public constructor(private achievementRedis: AchievementRedis, private subscribeRedis: AchievementRedis, private notificationservice: NotificationService) {
        this.subscribeRedis.subscribeToAchievementEvents((msg) => {
            console.log("notifying users of new achievements!");
            for (const player of msg.playerAchievements) {
                this.notificationservice.notifyAchievement(player.accountId, player.platform, {
                    "achievement_ids": player.achievements,
                    "acquirer": { 
                        "name": player.playerName 
                    },
                    "acquirer_type": "PLAYER"
                })
            }
        })
    }
    
    public processNewGameMessage(msg: NewGameMessage, platform: string): void {
        console.log("Processing new game message: "+ msg);
        this.achievementRedis.addGameToProcessingQueue(msg, platform).then(() => {
            console.log("Added game ", msg, " on platform " + platform + " to the processing queue!")
        }).catch((err) => {
            console.error("Failed to add game to processing queue: ", err)
        });
    }

    public searchPlayer(msg: SearchPlayerMessage): Promise<PublicPlayerData> {        
        return Promise.resolve({
            playerId: 4,
            playerName: "test",
            achievements: []
        });
    }

}