import {AchievementServerLocal, AchievementServerWeb, PlayerId, GroupId, AchievementNotification, HelloMessage, Achievement, PlayerData } from 'achievement-sio'
import socketio from 'socket.io'
import { AchievementDatabase } from 'achievement-db';
import {Player, GroupInfo} from 'achievement-db';
import { AchievementRedis } from 'achievement-redis';
import { KaynClass } from 'kayn';
import {regionMap} from '../util';
import { rejects } from 'assert';
import { SummonerV4SummonerDTO } from 'kayn/typings/dtos';
import { getPlayerRoomFromId, getGroupRoom } from 'achievement-sio';

export class NotificationService {

    public constructor(private webNS: AchievementServerWeb, private localNS: AchievementServerLocal, 
            private database: AchievementDatabase, private kayn: KaynClass) {
    }

    public deregisterUser(player: Player, socket: socketio.Socket) {
        return this.quitPlayer(player, socket);
    }

    public async getPlayerData(playerId: number): Promise<PlayerData | null> {
        const player = await this.database.PlayerDB.getPlayerById(playerId);
        if (!player) {
            return null;
        }
        const playerAchievements = await this.database.AchievementDB.getPlayerAchievements(playerId);
        const mappedAchievements = playerAchievements.map((a) => { 
            return {
                achievedAt: a.achievedAt.toString(),
                achievementId: a.achievementId,
                championId: a.champId,
                skinId: a.skinId
            }
        })

        return {
            "playerName": player.name,
            "achievements": mappedAchievements,
            "groups": [],
            "invites": []
        }
    }

    public registerUser(msg: HelloMessage, socket: socketio.Socket): Promise<Player> {
        return this.database.PlayerDB.getPlayerByAccountId(msg.accountId, msg.platformId).then((player) => {
            if (player == null) {
                return new Promise<SummonerV4SummonerDTO>((resolve, reject) => {
                    this.kayn.SummonerV4.by.name(msg.playerName).region(regionMap[msg.platformId]).then((player) => {
                        resolve(player);
                    }).catch((err) =>{ 
                        reject(err);
                    })
                }).then((player: SummonerV4SummonerDTO) => {
                    console.log("Saving summoner in database: ", player);
                    return this.database.PlayerDB.createPlayer(msg.accountId, msg.platformId, msg.playerName, player.accountId as string);
                }).then((player) => {
                    console.log("Set player to ", player);
                    if (player == null) {
                        throw new Error("Failed to register player!");
                    }
                    this.spectatePlayer(player, socket);
                    return player;
                })
            } else {
                this.spectatePlayer(player, socket);
                return player;
            }
        }) 
    }

    public notifyAchievement(accountId: number, region: string, achievement: AchievementNotification) {
        const room = this._getPlayerRoomFromId(region, accountId)
        console.log("Emitting message to " + room, achievement);
        this.webNS.to(room).emit("achievementNotification", achievement);
        this.localNS.to(room).emit("achievementNotification", achievement);
    }

    public notifyGroupAchievement(group: GroupInfo, achievement: AchievementNotification) {
        const room = this._getGroupRoom(group)
        this.webNS.to(room).emit("achievementNotification", achievement)
        this.localNS.to(room).emit("achievementNotification", achievement);
    }

    public spectateGroup(group: GroupInfo, socket: socketio.Socket) {
        socket.join(this._getGroupRoom(group))
    }

    public quitGroup(group: GroupInfo, socket: socketio.Socket) {
        socket.leave(this._getGroupRoom(group))
    }
    public spectatePlayer(player: Player, socket: socketio.Socket) {
        console.log("Joining room: " + this._getPlayerRoom(player));
        socket.join(this._getPlayerRoom(player))
    }

    public quitPlayer(player: Player, socket: socketio.Socket) {
        socket.leave(this._getPlayerRoom(player))
    }

    private _getPlayerRoomFromId(region: string, accountId: number): string {
        return getPlayerRoomFromId(region, accountId);
    }
    private _getPlayerRoom(player: Player): string {
        return this._getPlayerRoomFromId(player.region, player.accountId)
    }

    private _getGroupRoom(group: GroupInfo): string {
        return getGroupRoom(group.id);
    }
}