import { AchievementServerWebNS, AchievementServerLocalNS, SearchPlayerMessage, CreateGroup, GroupId, Group, GroupInviteResponse, GroupInviteRequest, HelloMessage, NewGameMessage, PublicPlayerData, PlayerPartialInfo, GroupInviteRequestMessage} from 'achievement-sio'
import { AchievementService} from './services/achievement-service'
import { GroupService, GroupServiceException } from './services/group-service';
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

    public handleSearchPlayer(msg: SearchPlayerMessage, cb: (err: string | null, data?: PlayerPartialInfo[]) => void) {        
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

    private readonly NEED_AUTHENTICATE_MESSAGE = "You need to authenticate by starting the LeagueClient before you can create a group!";

    private readonly GENERIC_ERROR_MESSAGE = "Unknown error. Sorry!";

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
        this.socket.on("leaveGroup", (msg, cb) => this.handleLeaveGroup(msg, cb));
    }

    public handleDisconnect() {
    }

    public handleNewGameMessage(msg: NewGameMessage) {
        console.log("New game: " + msg, this.socketState.player)
        if (this.socketState.player) {
            this.achievementService.processNewGameMessage(msg, this.socketState.player.region, this.socketState.player.id)
        }
    }

    public handleSearchPlayer(msg: SearchPlayerMessage, cb: (err: string | null, data?: PlayerPartialInfo[]) => void) {        
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
            console.log("got player", player)
            this.socketState["player"] = player
            return this.notificationService.getPlayerData(player.id);
        }).then((data: PlayerData | null) => {
            console.log("Emitting player data!");
            if (data == null) {
                console.log("error!")
                this.socket.emit("error", "Failed to load player data!")
            } else {
                console.log("Player Data", JSON.stringify(data));
                this.socket.emit("playerData", data);
            }
        }).catch((err) => {
            // disconnect if error ocurres
            console.log(err);
            this.socket.disconnect();
        })
    }

    public async handleLeaveGroup(msg: GroupId, cb: (error: string | null, data?: boolean | undefined) => void) {
        if (!this.socketState.player) {
            cb(this.NEED_AUTHENTICATE_MESSAGE)
            return;
        }

        try {
            const left = await this.groupService.leaveGroup((this.socketState.player as Player), msg);
            if (left) {
                this.notificationService.quitGroup(msg, this.socket as any);
            }
            cb(null, left);
        } catch (err) {
            console.error(err);
            cb(this.GENERIC_ERROR_MESSAGE);
        }
    }

    public async handleFetchGroup(msg: GroupId, cb: (error: string | null, data?: Group | undefined) => void) {
        try {
            const group = await this.groupService.fetchGroup(msg);
            cb(null, group);
        } catch (err) {
            cb("Failed to load group!");
        }
    }

    public async handleGroupInviteResponse(msg: GroupInviteResponse, cb: (error: string | null, data?: boolean | undefined) => void) {
        if (!this.socketState.player) {
            cb(this.NEED_AUTHENTICATE_MESSAGE);
            return;
        }
        try {
            const groupId = await this.groupService.updateInvitation(this.socketState.player as Player, msg.inviteId, msg.accept)
            if (msg.accept) {
                this.notificationService.spectateGroup(groupId, this.socket as any)
            } else {
                this.notificationService.quitGroup(groupId, this.socket as any)
            }
            cb(null, true);
        } catch (err) {
            if (err instanceof GroupServiceException) {
                cb(err.message);
            } else {
                cb(this.GENERIC_ERROR_MESSAGE);
                console.log(err);
            }
        }

    }

    public async handleGroupInviteRequest(msg: GroupInviteRequestMessage,cb: (error: string | null, data?: boolean | undefined) => void) {
        if (!this.socketState.player) {
            cb(this.NEED_AUTHENTICATE_MESSAGE);
            return;
        }
        try {
            await this.groupService.addGroupInviteRequest((this.socketState.player as Player).id, msg.invitee, msg.group)
            cb(null, true);
        } catch (err) {
            if (err instanceof GroupServiceException) {
                cb(err.message)
            } else {
                console.log(err);
                cb(this.GENERIC_ERROR_MESSAGE);
            }
        }
    }

    public async handleCreateGroup(msg: CreateGroup, callback: (err: string | null, data?: Group) => void) {
        console.log("Create group called ", msg);
        if (!this.socketState.player) {
            callback(this.NEED_AUTHENTICATE_MESSAGE)
            return;
        }
        try {
            console.log("creating group")
            const group = await this.groupService.createGroup((this.socketState.player as Player).id, msg.name);
            if (group) {
                this.notificationService.spectateGroup(group.id, this.socket as any);
            }
            console.log("created group: ", group);
            callback(null, group);
        } catch (err) {
            console.error(err);
            callback(this.GENERIC_ERROR_MESSAGE);
        }
    }

}