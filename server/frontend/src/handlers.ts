import { AchievementServerWebNS, AchievementServerLocalNS, SearchPlayerMessage, CreateGroup, GroupId, Group, GroupInviteResponse, GroupInviteRequest, HelloMessage, NewGameMessage, PublicPlayerData, PlayerPartialInfo} from 'achievement-sio'
import { AchievementService} from './services/achievement-service'
import { GroupService } from './services/group-service'
import { NotificationService } from './services/notification-service';
import socketio from 'socket.io';
import {Player} from 'achievement-db';
import { PlayerData } from 'achievement-sio';

interface SocketState {
    player?: Player
}



export class WebAchievementSocketHandler {

    public constructor(private socket: AchievementServerWebNS, private achievementService: AchievementService, private groupService: GroupService, 
        private notificationService: NotificationService) {
        this.handleConnect();
    }

    private handleConnect() {
        this.socket.on("searchPlayer", (msg, cb) => this.handleSearchPlayer(msg, cb))
    }

    public handleSearchPlayer(msg: SearchPlayerMessage, cb: (err: string | null, data?: PublicPlayerData) => void) {        
        this.achievementService.searchPlayer(msg).then((data) => {
            cb(null, data)
        }).catch((err) =>{ 
            console.log(err)
            cb("Something went wrong!")
        })
    }
}

export class LocalAchievementSocketHandler {
    private socketState: SocketState

    public constructor(private socket: AchievementServerLocalNS, private achievementService: AchievementService, private groupService: GroupService, private notificationService: NotificationService) {
        this.socketState = {}
        this.handleConnect()
    }

    private handleConnect() {
        // Messages
        this.socket.on("hello", (msg) => this.handleHelloMessage(msg))
        this.socket.on("newGame", (msg) => this.handleNewGameMessage(msg));
        
        // RPCs
        this.socket.on("searchPlayer", (msg, cb) => this.handleSearchPlayer(msg, cb))
        this.socket.on("createGroup", (msg, cb) => this.handleCreateGroup(msg, cb))
        this.socket.on("fetchGroup", (msg, cb) => this.handleFetchGroup(msg, cb))
        this.socket.on("groupInviteRepsonse", (msg, cb) => this.handleGroupInviteResponse(msg, cb))
        this.socket.on("groupInviteRequest", (msg, cb) => this.handleGroupInviteRequest(msg, cb))
    }

    public handleDisconnect() {
    }

    public handleNewGameMessage(msg: NewGameMessage) {
        console.log("New game: " + msg, this.socketState.player)
        if (this.socketState.player) {
            this.achievementService.processNewGameMessage(msg, this.socketState.player.region)
        }
    }

    public handleSearchPlayer(msg: SearchPlayerMessage, cb: (err: string | null, data?: PublicPlayerData) => void) {        
        this.achievementService.searchPlayer(msg).then((data) => {
            cb(null, data)
        }).catch((err) =>{ 
            console.log(err)
            cb("Something went wrong!")
        })
    }

    public handleHelloMessage(msg: HelloMessage) {
        console.log("RECEIVED LOCAL HELLO MESSAGE", msg)
        // TODO: only allow one hello message?
        let deregisterPromise = Promise.resolve();
        if (this.socketState.player) {
            this.notificationService.deregisterUser(this.socketState.player, this.socket as any);
        }
        
        return this.notificationService.registerUser(msg, this.socket as any)
        .then((player) => {
            console.log(player)
            this.socketState["player"] = player
            return this.notificationService.getPlayerData(player.id);
        }).then((data: PlayerData | null) => {
            console.log("Emitting player data!");
            if (data == null) {
                console.log("error!")
                this.socket.emit("error", "Failed to load player data!")
            } else {
                console.log("Player Data", data);
                this.socket.emit("playerData", data);
            }
        }).catch((err) => {
            // disconnect if error ocurres
            console.log(err);
            this.socket.disconnect();
        })
    }

    public handleFetchGroup(msg: GroupId, cb: (error: string | null, data?: Group | undefined) => void) {

    }

    public handleGoupInviteResponse(msg: GroupInviteResponse) {

    }

    public handleGroupInviteResponse(msg: GroupInviteResponse, cb: (error: string | null, data?: boolean | undefined) => void) {

    }

    public handleGroupInviteRequest(msg: GroupInviteRequest,cb: (error: string | null, data?: boolean | undefined) => void) {

    }

    public handleCreateGroup(msg: CreateGroup, callback: (err: string | null, data?: Group) => void) {

    }

}

interface Handler {
    
}

class AchievementHandler {

}

class GroupHandler {

}