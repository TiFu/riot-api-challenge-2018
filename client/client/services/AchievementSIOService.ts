import { AchievementLocalClient } from 'achievement-sio'
import { PlayerInfo, GameData } from '../store/player/types';
import io from 'socket.io-client'
import { AchievementEventBus } from '../store/events';
import { AchievementState } from '../store/index';
import {Store} from 'redux'
import { updateFrontendConnectedState } from '../store/lcu/actions';

export class AchievementSocketIOService {
    private socket: AchievementLocalClient
    public constructor(private store: Store<AchievementState>, private url: string, private eventBus: AchievementEventBus) {
        console.log(url)
        this.reset();
    }

    public reset() {
        if (this.socket) 
            this.socket.disconnect()
        this.socket = io(this.url + "/local") as any;
        this.socket.on("connect", () => {
            this.registerEventListeners()
            // If player info is available send it to the server
            if (this.store.getState().player.playerInfo) {
                this.emitHelloMessage(this.store.getState().player.playerInfo)
            }
            this.store.dispatch(updateFrontendConnectedState(true))
            console.log("Connected to frontend server!");
        })
        this.socket.on("disconnect", () => {
            this.store.dispatch(updateFrontendConnectedState(false))
        });
        
        this.socket.on("connect_error", (err) => {
            this.store.dispatch(updateFrontendConnectedState(false))
            if (err["description"] == 503) {
                console.log("Failed to connect to frontend server!");
            } else {
                console.log(err)
            }
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

        this.eventBus.end_of_game.on((gameId: GameData) => {
            this.handleEndOfGame(gameId);
        });
    }
    
    private handleEndOfGame(game: GameData): void {
        // TODO: handle end of game
        this.socket.emit("newGame", game);
    }

    private updatePlayerInfo(player: PlayerInfo) {
        this.reset()
        console.log("Sending hello message: ", player);
        if (this.socket.connected) {
            this.emitHelloMessage(player)
        }
    }

    private emitHelloMessage(player: PlayerInfo) {
        this.socket.emit("hello", player);
    }
}