import { IDatabase } from "pg-promise";
import { GroupId, GroupInvitation, GroupInfo, GroupMember} from '../models/groups'
import { mapFields } from '../util';

interface GroupMemberEntry {
    member_since: Date
    owner: boolean
    player_id: number
    player_name: string
}

const GroupMemberTableMap: { [k in keyof GroupMemberEntry]: keyof GroupMember | null } = {
    "member_since": "memberSince",
    "owner": "owner",
    "player_id": "id",
    "player_name": "name"
}
export class  GroupDB {

    public constructor(private db: IDatabase<any>) {

    }

    public async getGroupInfo(groupId: number): Promise<GroupInfo> {
        const group = await this.db.one("SELECT id, name, region FROM groups where id = $1", [groupId]);
        return group
    }

    public async getGroupMembers(groupId: number): Promise<GroupMember[]> {
        const members = await this.db.query("SELECT member_since, owner, player_id, p.name as player_name FROM group_members gm, players p where p.id = gm.player_id and gm.group_id = $1", [groupId]);
        return members.map( (m: GroupMemberEntry) => mapFields<GroupMemberEntry, GroupMember>(GroupMemberTableMap, m));
    }

    public async createGroup(playerId: number, name: string): Promise<GroupId> {
        const region: string = (await this.db.one("SELECT region from players where id = ${playerId}", { "playerId": playerId}))["region"];

        const group = (await this.db.one("INSERT INTO groups (name, region) values (${name}, ${region}) RETURNING id", { "name": name, "region": region})).id;

        await this.db.one("INSERT INTO group_members (group_id, player_id, owner) values ($1, $2, TRUE)", [group, playerId]);
        return group;
    }

    public async addPlayerToGroup(playerId: number, groupId: number, owner: boolean ): Promise<void> {
        const done = await this.db.one("INSERT INTO group_members (group_id, player_id, owner) values ($1, $2, $3)", [groupId, playerId, owner]);
    }


    public async addInvitation(inviteePlayerId: number, inviterPlayerId: number, groupId: number): Promise<void> {
        await this.db.one("INSERT INTO group_invites (group_id, invitee, inviter) values ($1, $2, $3)", [groupId, inviteePlayerId, inviterPlayerId]);
    }

    public async getInvitesForGroup(groupId: number, status: 'pending' | 'accepted' | 'declined' | 'canceled'): Promise<GroupInvitation[]> {
        const done = await this.db.query("SELECT p1.id as inviter_id, p1.name as inviter_name, p2.id as invitee_id, p2.name as invitee_name FROM groups g, group_invites gi, players p1, players p2 WHERE p2.id = gi.invitee and gi.group_id = g.id and p.id == gi.inviter and gi.status = $2 and gi.group_id = $1", [groupId, status]);
        return done.map((d: any) => {
            return {
                inviter: {
                    id: d["inviter_id"],
                    name: d["inviter_name"]
                },
                invitee: {
                    id: d["invitee_id"],
                    name: d["invitee_name"]
                }
            }
        });

    }

    public async getInvitesForPlayer(playerId: number, status: 'pending' | 'accepted' | 'declined' | 'canceled'): Promise<GroupInvitation[]> {
        const done = await this.db.query("SELECT g.id as group_id, g.name as group_name, p1.id as inviter_id, p1.name as inviter_name, p2.id as invitee_id, p2.name as invitee_name FROM groups g, group_invites gi, players p1, players p2 WHERE p2.id = gi.invitee and gi.group_id = g.id and p.id == gi.inviter and gi.status = $2 and gi.invitee = $1", [playerId, status]);
        return done.map((d: any) => {
            return {
                group: {
                    id: d["group_id"],
                    name: d["group_name"]
                },
                inviter: {
                    id: d["inviter_id"],
                    name: d["inviter_name"]
                },
                invitee: {
                    id: d["invitee_id"],
                    name: d["invitee_name"]
                }
            }
        });
    }


    public async acceptInvitation(playerId: number, groupId: number): Promise<boolean> {
        return this.updateInvitation(playerId, groupId, "accepted")
    }

    public async declineInvitation(playerId: number, groupId: number): Promise<boolean> {
        return this.updateInvitation(playerId, groupId, "declined");
        
    }
    private async updateInvitation(inviteePlayerId: number, groupId: number, newStatus: 'accepted' | 'declined' | 'pending' | 'canceled') {
        const rowCount = await this.db.result("UPDATE group_members SET status = $1 WHERE inivitee = $2 and group_id = $3 and status = $4", [newStatus, inviteePlayerId, groupId, "pending"], (r) => r.rowCount)
        return rowCount == 1;
    }
}

export class GroupException extends Error {

    public constructor(msg: string) {
        super(msg);
    }
}