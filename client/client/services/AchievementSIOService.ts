import { AchievementLocalClient, GroupInviteRequest, GroupInviteUpdate } from 'achievement-sio'
import { PlayerInfo, GameData, GroupInviteChangeResult, ChangeInvitation, CreateGroupRequest, SearchPlayer } from '../store/player/types';
import io from 'socket.io-client'
import { AchievementEventBus } from '../store/events';
import { AchievementState } from '../store/index';
import {Store} from 'redux'
import { updateFrontendConnectedState } from '../store/lcu/actions';
import { NewGameMessage } from 'achievement-sio';
import { getPlayerRoomFromId, AchievementNotification } from 'achievement-sio';
import { PlayerData } from 'achievement-sio';
import { updatePlayerAchievements, updateGroupAchievements, updatePlayerInfo, updatePlayerData, newGroupInvite, groupInviteUpdate, groupInviteChangeResult, newGroupEvent } from '../store/player/actions';

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
        this.socket.on("error", (info) =>{ 
            console.log(info);
        })
        this.socket.on("achievementNotification", (notification) => this.handleAchievementNotification(notification))
        this.socket.on("playerData", (playerData) => this.handlePlayerData(playerData));
        this.socket.on("groupInvite", (invite) => this.handleGroupInvite(invite))
        this.socket.on("inviteUpdate", (inviteUpdate) => this.handleGroupInviteUpdate(inviteUpdate));
    }

    // TODO: fetch group data on inviteUpdate for that group
    private handleGroupInvite(invite: GroupInviteRequest) {
        this.store.dispatch(newGroupInvite(invite))
    }

    private handleGroupInviteUpdate(update: GroupInviteUpdate) {
        this.store.dispatch(groupInviteUpdate(update))
    }

    private handlePlayerData(playerData: PlayerData) {
        this.store.dispatch(updatePlayerData(playerData))
        console.log("Player Data: ", playerData);
    }
    
    private handleAchievementNotification(msg: AchievementNotification) {
        console.log("Received achievement notification!", msg)
        if (msg.acquirer_type == "PLAYER") {
            this.store.dispatch(updatePlayerAchievements(msg));   
        } else {
            this.store.dispatch(updateGroupAchievements(msg));
        }
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

        this.unsubscribes.add(this.eventBus.group_invite_change.on((change: ChangeInvitation) => {
            console.log("Updating invitation state for invite ", change);
            this.handleInviteChange(change);
        }))

        this.unsubscribes.add(this.eventBus.create_group.on(this.handleCreateGroup.bind(this)))
        this.unsubscribes.add(this.eventBus.search_player.on(this.handleSearchPlayer.bind(this)))
    }

    private handleSearchPlayer(request: SearchPlayer) {
        if (!this.socket.connected) {
            request.cb("It seems like you are not connected to our backend services. Please check your internet connection and the icon in the bottom left.", null);
            return
        }

        this.socket.emit("searchPlayer", {
            "searchString": request.searchString,
        }, (err, data) => {
            if (err) {
                request.cb(err, null);
            } else {
                request.cb(null, data);
            }
        })
    }

    private handleCreateGroup(request: CreateGroupRequest) {
        if (!this.socket.connected) {
            request.cb("It seems like you are not connected to our backend services. Please check your internet connection and the icon in the bottom left.", null);
            return
        }
        this.socket.emit("createGroup", { name: request.name}, (err, data) => {
            if (err) {
                request.cb(err, null);
            } else {
                this.store.dispatch(newGroupEvent(data))
                request.cb(null, data);
            }
        })
    }
    private handleInviteChange(change: ChangeInvitation) {
        console.log("HANDLING GROUP INVITE CHANGE");
        if (!this.socket.connected) {
            const result = {
                success: false,
                msg: "It seems like you are not connected to our backend services. Please check your internet connection and the icon in the bottom left.",
                "inviteId": change.inviteId,
                "newStatus": change.newStatus
            }
            this.store.dispatch(groupInviteChangeResult(result))
            change.cb(result.msg, false);
            return;
        }
        this.socket.emit("groupInviteRepsonse", {
            inviteId: change.inviteId,
            accept: change.newStatus == "accepted"
        }, (err, data) => {
            let result: GroupInviteChangeResult = {
                success: data,
                msg: err,
                inviteId: change.inviteId,
                newStatus: change.newStatus
            }
            change.cb(err, data);
            this.store.dispatch(groupInviteChangeResult(result))
            if (data && change.newStatus == "accepted") {
                this.fetchGroup(change.groupId)
            }
        }) 
    }

    private fetchGroup(groupId: number) {
        this.socket.emit("fetchGroup", groupId, (err, data) => {
            this.store.dispatch(newGroupEvent(data))
        })
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