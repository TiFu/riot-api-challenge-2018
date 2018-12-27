import {NewGameMessage, SearchPlayerMessage, PublicPlayerData} from 'achievement-sio'

export class AchievementService {

    public processNewGameMessage(msg: NewGameMessage): void {
        console.log("Processing new game message: "+ msg);
    }

    public searchPlayer(msg: SearchPlayerMessage): Promise<PublicPlayerData> {        
        return Promise.resolve({
            playerId: 4,
            playerName: "test",
            achievements: []
        });
    }

}