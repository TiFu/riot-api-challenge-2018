import {NewGameMessage, SearchPlayerMessage, PublicPlayerData} from 'achievement-sio'
import { AchievementRedis } from '../../../achievement-redis/index';

export class AchievementService {

    public constructor(private achievementRedis: AchievementRedis) {

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