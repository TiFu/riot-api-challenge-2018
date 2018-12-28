import {AchievementServerLocal, AchievementServerWeb, PlayerId, GroupId, AchievementNotification, HelloMessage, Achievement } from 'achievement-sio'
import socketio from 'socket.io'
import { AchievementDB } from 'achievement-db';
import {Player, Group} from 'achievement-db';

export class NotificationService {

    public constructor(private webNS: AchievementServerWeb, private localNS: AchievementServerLocal, private database: AchievementDB) {

    }

    public deregisterUser(player: Player, socket: socketio.Socket) {
        return this.quitPlayer(player, socket);
    }

    public registerUser(msg: HelloMessage, socket: socketio.Socket): Promise<Player> {
        return this.database.retrievePlayer(msg.accountId, msg.platformId, msg.playerName).then((player) => {
            this.spectatePlayer(player, socket);
            return player;
        });
    }

    public notifyAchievement(player: Player, achievement: AchievementNotification) {
        const room = this._getPlayerRoom(player)
        // TODO: check if room exists and if not store until room is created!
        this.webNS.to(room).emit("achievementNotification", achievement);
        this.localNS.to(room).emit("achievementNotification", achievement);
    }

    public notifyGroupAchievement(group: Group, achievement: AchievementNotification) {
        const room = this._getGroupRoom(group)
        this.webNS.to(room).emit("achievementNotification", achievement)
        this.localNS.to(room).emit("achievementNotification", achievement);
    }

    public spectateGroup(group: Group, socket: socketio.Socket) {
        socket.join(this._getGroupRoom(group))
    }

    public quitGroup(group: Group, socket: socketio.Socket) {
        socket.leave(this._getGroupRoom(group))
    }
    public spectatePlayer(player: Player, socket: socketio.Socket) {
        socket.join(this._getPlayerRoom(player))
    }

    public quitPlayer(player: Player, socket: socketio.Socket) {
        socket.leave(this._getPlayerRoom(player))
    }

    private _getPlayerRoom(player: Player): string {
        return player.region + "_player_" + player.accountId
    }

    private _getGroupRoom(group: Group): string {
        return group.region + "_group_" + group.id
    }
}