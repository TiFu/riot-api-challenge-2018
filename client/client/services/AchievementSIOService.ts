import { AchievementLocalClient } from 'achievement-sio'
import { PlayerInfo, GameData } from '../store/player/types';
import io from 'socket.io-client'
import { AchievementEventBus } from '../store/events';
import { AchievementState } from '../store/index';
import {Store} from 'redux'
import { updateFrontendConnectedState } from '../store/lcu/actions';
import { NewGameMessage } from 'achievement-sio';
import { getPlayerRoomFromId, AchievementNotification } from 'achievement-sio';
import { PlayerData } from 'achievement-sio';
import { updateAchievements } from '../store/player/actions';

export class AchievementSocketIOService {
    private socket: AchievementLocalClient
    private unrecordedEndOfGames = new Set<NewGameMessage>();
    private unsubscribes = new Set();

    public constructor(private store: Store<AchievementState>, private url: string, private eventBus: AchievementEventBus) {
        console.log(url)
        this.reset();
        this.registerEventListeners();
    }

    public _getSocket() {
        return this.socket;
    }
    public reset() {
        if (this.socket) 
            this.socket.disconnect()
        this.socket = io(this.url + "/local") as any;
        this.socket.on("connect", () => {
            // If player info is available send it to the server
            if (this.store.getState().player.playerInfo) {
                this.emitHelloMessage(this.store.getState().player.playerInfo)
            }
            this.store.dispatch(updateFrontendConnectedState(true))
            this.sendStoredEndOfGames()
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
        this.socket.on("achievementNotification", (notification) => this.handleAchievementNotification(notification))
        this.socket.on("playerData", (playerData) => this.handlePlayerData(playerData));
    }

    private handlePlayerData(playerData: PlayerData) {
        this.store.dispatch(updateAchievements(playerData.achievements))
        console.log("Player Data: ", playerData);
    }
    
    private handleAchievementNotification(msg: AchievementNotification) {
        console.log("Received achievement notification!", msg)
    }

    private deregisterEvents() {
        for (const unsub of this.unsubscribes) {
            unsub()
            this.unsubscribes.delete(unsub)
        }
    }

    private registerEventListeners() { 
        this.unsubscribes.add(this.eventBus.player_info_update.on((playerInfo) =>{ 
            this.updatePlayerInfo(playerInfo);
        }));
        this.unsubscribes.add(this.eventBus.lcu_connection_update.on((connected) => {
            if (!connected) {
                this.reset();
            }
        }))

        this.unsubscribes.add(this.eventBus.end_of_game.on((gameId: NewGameMessage) => {
            console.log("Handling end of game in achievementSioService");
            this.handleEndOfGame(gameId);
        }));
    }

    private sendStoredEndOfGames() {
        console.log("sending stored end of games!");
        for (const gameId of this.unrecordedEndOfGames) {
            this.socket.emit("newGame", gameId);
            this.unrecordedEndOfGames.delete(gameId);
        }
    }
    
    private handleEndOfGame(game: NewGameMessage): void {
        console.log("emitting eog")
        // TODO: handle end of game
        if (this.socket.connected) {
            console.log("emitting end of game because we are connected");
            this.socket.emit("newGame", game);
        } else {
            console.log("storing for unrecorded end of game!");
            this.unrecordedEndOfGames.add(game)
        }
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
        console.log("Joining room for player!");
    }
}