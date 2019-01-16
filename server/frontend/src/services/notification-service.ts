import { AchievementServerLocal, AchievementServerWeb, PlayerId, GroupId, AchievementNotification, HelloMessage, Achievement, PlayerData, Group, GroupInviteRequest } from 'achievement-sio';
import socketio from 'socket.io'
import { AchievementDatabase } from 'achievement-db';
import {Player, GroupInfo} from 'achievement-db';
import { AchievementRedis } from 'achievement-redis';
import { KaynClass } from 'kayn';
import {regionMap} from '../util';
import { rejects } from 'assert';
import { SummonerV4SummonerDTO } from 'kayn/typings/dtos';
import { getPlayerRoomFromId, getGroupRoom } from 'achievement-sio';
import { GroupPartialInfo } from 'achievement-sio';
import { GroupPlayerPartialInfo } from 'achievement-sio';

export class NotificationService {

    public constructor(private webNS: AchievementServerWeb, private localNS: AchievementServerLocal, 
            private database: AchievementDatabase, private kayn: KaynClass) {
    }

    public notifyNewInvitation(player: Player, inviteId: number, group: GroupInfo, inviter: Player) {
        const room = this._getPlayerRoomFromId(player.region, player.accountId);
        console.log("Emitting message to " + room, group, inviter);
        this.localNS.to(room).emit("groupInvite", {
            inviteId: inviteId,
            groupId: group.id,
            groupName: group.name,
            status: "pending", // TODO: it's a new notification but we might want to change this in the future
            inviter: {
                name: inviter.name,
                region: inviter.region,
                accountId: inviter.accountId
            },
            date: new Date()
        });
    }

    public notifyInvitationUpdate(invited: Player, group: GroupId, status: "pending" | "canceled" | "declined" | "accepted") {
        const room = getGroupRoom(group)
        console.log("notifying update: ", room, group, invited, status)
        this.localNS.to(room).emit("inviteUpdate", {
            groupId: group,
            "player": {
                name: invited.name,
                region: invited.region,
                accountId: invited.accountId
            },
            newStatus: status
        })
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

        console.log("Fetching invites for ", playerId, " which are pending");
        const invites = await this.database.GroupDB.getInvitesForPlayer(playerId, "pending");
        console.log("Found invites: ", invites);
        const mappedInvites: GroupInviteRequest[] = invites.map((i) => {
            return {
                groupName: i.group.name,
                inviteId: i.inviteId,
                inviter: i.inviter,
                invitee: i.invitee,
                status: i.status,
                groupId: i.group.id,
                date: i.inviteDate
            }
        })

        const groups = await this.database.GroupDB.getGroupInfoForPlayer(playerId);
        console.log("groups for player: ", groups);
        const mappedGroups: GroupPartialInfo[] = []
        for (const group of groups) {
            const members = await this.database.GroupDB.getGroupMembers(group.id);  
            const mappedMembers = members.map(m => {
                return {
                    "accountId": m.accountId,
                    "name": m.name,
                    "region": m.region,
                    "memberSince": m.memberSince.toString()
                } as GroupPlayerPartialInfo;
            })             
            const achievements = await this.database.AchievementDB.getGroupAchievements(group.id);
            mappedGroups.push({
                id: group.id,
                name: group.name,
                members: mappedMembers,
                "achievements": achievements.map(a => {
                    return {
                        "achievementId": a.achievementId,
                        "achievedAt": a.achievedAt.toString(),
                        "championId": a.champId
                    }
                })
            })
        }

        return {
            "playerName": player.name,
            "achievements": mappedAchievements,
            "groups": mappedGroups,
            "invites": mappedInvites
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
                return this.database.GroupDB.getGroupsForPlayer(player.id).then((groups) => {
                    for (const group of groups) {
                        this.spectateGroup(group, socket);
                    }    
                    return player;
                });
            }
        }) 
    }

    public notifyAchievement(accountId: number, region: string, achievement: AchievementNotification) {
        const room = this._getPlayerRoomFromId(region, accountId)
        console.log("Emitting message to " + room, achievement);
        this.webNS.to(room).emit("achievementNotification", achievement);
        this.localNS.to(room).emit("achievementNotification", achievement);
    }

    public notifyGroupAchievement(groupId: number, achievement: AchievementNotification) {
        const room = getGroupRoom(groupId)
        this.webNS.to(room).emit("achievementNotification", achievement)
        this.localNS.to(room).emit("achievementNotification", achievement);
    }

    public spectateGroup(groupId: GroupId, socket: socketio.Socket) {
        console.log("spectating group ", groupId);
        socket.join(getGroupRoom(groupId))
    }

    public quitGroup(group: GroupId, socket: socketio.Socket) {
        socket.leave(getGroupRoom(group))
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