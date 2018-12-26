import { AchievementLocalClient } from 'achievement-sio'
import { PlayerInfo } from '../store/player/types';
import io from 'socket.io-client'
import { AchievementEventBus } from '../store/events';


export class AchievementSocketIOService {
    private socket: AchievementLocalClient
    public constructor(private url: string, private eventBus: AchievementEventBus) {
        console.log(url)
        this.registerEventListeners()
        this.reset();
    }

    public reset() {
        if (this.socket) 
            this.socket.disconnect()
        this.socket = io(this.url + "/local") as any;
        this.socket.on("connect", () => {
            console.log("CONNECTED TO SOCKET");
        })
        this.socket.on("connect_error", (err) => {
            console.log("CONNECT ERROR: ", err);
        })
    }

    private registerEventListeners() { 
        this.eventBus.player_info_update.on((playerInfo) =>{ 
            this.updatePlayerInfo(playerInfo);
        })
        this.eventBus.lcu_connection_update.on((connected) => {
            if (!connected) {
                this.reset();
            }
        })
    }
    public updatePlayerInfo(player: PlayerInfo) {
        this.reset()
        console.log("Sending hello message: ", player);
        this.socket.emit("hello", player);
    }
}