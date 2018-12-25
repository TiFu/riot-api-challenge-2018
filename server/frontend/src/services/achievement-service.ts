import {NewGameMessage, SearchPlayerMessage, PublicPlayerData} from 'achievement-sio'

export class AchievementService {

    public processNewGameMessage(msg: NewGameMessage, player_id: number): void {

    }

    public searchPlayer(msg: SearchPlayerMessage): Promise<PublicPlayerData> {        
        return Promise.resolve({
            playerId: 4,
            playerName: "test",
            achievements: []
        });
    }

}