import {NewGameMessage, SearchPlayerMessage, PublicPlayerData} from 'achievement-sio'
import { AchievementRedis } from 'achievement-redis';
import { NotificationService } from './notification-service';
import { PlayerPartialInfo } from 'achievement-sio';
import { Game } from 'achievement-redis';

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
    
    public processNewGameMessage(msg: NewGameMessage, platform: string, playerId: number): void {
        console.log("Processing new game message: "+ msg);
        const game: Game ={ 
            playerId: playerId,
            platform: platform,
            gameId: msg.gameId,
            champId: msg.champId,
            skinId: msg.skinId
        }
        this.achievementRedis.addGameToProcessingQueue(game).then(() => {
            console.log("Added game ", game, " to the processing queue!")
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