import { AchievementServerWebNS, AchievementServerLocalNS, SearchPlayerMessage, CreateGroup, GroupId, Group, GroupInviteResponse, GroupInviteRequest, HelloMessage, NewGameMessage, PublicPlayerData, PlayerPartialInfo} from 'achievement-sio'
import { AchievementService} from './services/achievement-service'
import { GroupService } from './services/group-service'
import { NotificationService } from './services/notification-service';
import socketio from 'socket.io';
import {Player} from 'achievement-db';

interface SocketState {
    player?: Player
}



export class WebAchievementSocketHandler {

    public constructor(private socket: AchievementServerWebNS, private achievementService: AchievementService, private groupService: GroupService, private notificationService: NotificationService) {
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
        if (this.socketState.player && this.socketState.player.id) {
            this.achievementService.processNewGameMessage(msg, this.socketState.player.id)
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
            deregisterPromise = this.notificationService.deregisterUser(this.socketState.player, this.socket as any);
        }
        
        deregisterPromise.then(() => {
            return this.notificationService.registerUser(msg, this.socket as any)
        }).then((player) => {
            this.socketState["player"] = player
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