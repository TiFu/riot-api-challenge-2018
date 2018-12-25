import {AchievementServerLocal, AchievementServerWeb, PlayerId, GroupId, AchievementNotification, HelloMessage, Achievement } from 'achievement-sio'
import socketio from 'socket.io'
import { AchievementDB } from 'achievement-db';
import {Player} from 'achievement-db';

export class NotificationService {

    public constructor(private webNS: AchievementServerWeb, private localNS: AchievementServerLocal, private serverPlatform: string, private database: AchievementDB) {

    }

    public registerUser(msg: HelloMessage, socket: socketio.Socket): Promise<Player> {
        return this.database.retrievePlayer(msg.account_id, msg.region).then((player) => {
            this.spectatePlayer(player.id, socket);
            return player;
        });
    }

    public notifyAchievement(playerId: PlayerId, achievement: AchievementNotification) {
        const room = this._getPlayerRoom(playerId)
        // TODO: check if room exists and if not store until room is created!
        this.webNS.to(room).emit("achievementNotification", achievement);
        this.localNS.to(room).emit("achievementNotification", achievement);
    }

    public notifyGroupAchievement(groupId: GroupId, achievement: AchievementNotification) {
        const room = this._getGroupRoom(groupId)
        this.webNS.to(room).emit("achievementNotification", achievement)
        this.localNS.to(room).emit("achievementNotification", achievement);
    }

    public spectateGroup(groupId: GroupId, socket: socketio.Socket) {
        socket.join(this._getGroupRoom(groupId))
    }

    public quitGroup(groupId: GroupId, socket: socketio.Socket) {
        socket.leave(this._getGroupRoom(groupId))
    }
    public spectatePlayer(playerId: PlayerId, socket: socketio.Socket) {
        socket.join(this._getPlayerRoom(playerId))
    }

    public quitPlayer(playerId: PlayerId, socket: socketio.Socket) {
        socket.leave(this._getPlayerRoom(playerId))
    }

    private _getPlayerRoom(playerId: PlayerId): string {
        return this.serverPlatform + "_player_" + playerId
    }

    private _getGroupRoom(groupId: GroupId): string {
        return this.serverPlatform + "_group_" + groupId
    }
}