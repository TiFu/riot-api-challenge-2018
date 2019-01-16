import { IDatabase } from "pg-promise";
import { GroupId, GroupInvitation, GroupInfo, GroupMember} from '../models/groups'
import { mapFields } from '../util';

interface GroupMemberEntry {
    member_since: Date
    owner: boolean
    player_id: number
    player_name: string
    region: string
}

const GroupMemberTableMap: { [k in keyof GroupMemberEntry]: keyof GroupMember | null } = {
    "member_since": "memberSince",
    "owner": "owner",
    "player_id": "accountId",
    "player_name": "name",
    "region": "region"
}
export class  GroupDB {

    public constructor(private db: IDatabase<any>) {

    }

    public async getGroupInfo(groupId: number): Promise<GroupInfo> {
        const group = await this.db.one("SELECT id, name, region FROM groups where id = $1", [groupId]);
        return group
    }

    public async isMember(playerId: number, groupId: number): Promise<boolean> {
        const member = await this.db.oneOrNone("SELECT 1 FROM group_members WHERE group_id = $1 and player_id = $2", [groupId, playerId])
        if (member == null) {
            return false;
        } else { 
            return true;
        }
    }

    public async getGroupMembers(groupId: number): Promise<GroupMember[]> {
        const members = await this.db.query("SELECT g.region as region, member_since, owner, p.account_id as player_id, p.player_name as player_name FROM group_members gm, players p, groups g where g.id = gm.group_id and p.id = gm.player_id and gm.group_id = $1", [groupId]);
        return members.map( (m: GroupMemberEntry) => mapFields<GroupMemberEntry, GroupMember>(GroupMemberTableMap, m));
    }

    public async createGroup(playerId: number, name: string): Promise<GroupId> {
        const region: string = (await this.db.one("SELECT region from players where id = ${playerId}", { "playerId": playerId}))["region"];

        const group = (await this.db.query("INSERT INTO groups (name, region) values (${name}, ${region}) RETURNING id", { "name": name, "region": region}))[0].id;
        console.log("Group Id: ", group);
        await this.db.query("INSERT INTO group_members (group_id, player_id, owner) values ($1, $2, TRUE)", [group, playerId]);
        return group;
    }

    public async addPlayerToGroup(playerId: number, groupId: number, owner: boolean ): Promise<void> {
        await this.db.query("INSERT INTO group_members (group_id, player_id, owner) values ($1, $2, $3)", [groupId, playerId, owner]);
    }

    public async getGroupsForPlayer(playerId: number): Promise<number[]> {
        const done = await this.db.query("SELECT group_id FROM group_members WHERE player_id = $1", [playerId]);
        return done.map((d: { "group_id": number}) => d["group_id"] as number);
    }

    public async addInvitation(inviteePlayerId: number, inviterPlayerId: number, groupId: number): Promise<number> {
        return (await this.db.query("INSERT INTO group_invites (group_id, invitee, inviter) values ($1, $2, $3) RETURNING id", [groupId, inviteePlayerId, inviterPlayerId]))[0].id;
    }
 
    public async getInvitesForGroup(groupId: number, status: 'pending' | 'accepted' | 'declined' | 'canceled'): Promise<GroupInvitation[]> {
        const done = await this.db.query("SELECT gi.invite_date as invite_date, gi.id as invite_id, gi.status as status, p1.account_id as inviter_id, p1.region as inviter_region, p1.player_name as inviter_name, p2.account_id as invitee_id, p2.region as invitee_region, p2.player_name as invitee_name FROM groups g, group_invites gi, players p1, players p2 WHERE p2.id = gi.invitee and gi.group_id = g.id and p1.id = gi.inviter and gi.status = $2 and gi.group_id = $1", [groupId, status]);
        return done.map((d: any) => {
            return {
                status: d["status"],
                inviteId: d["invite_id"],
                inviter: {
                    accountId: d["inviter_id"],
                    name: d["inviter_name"]
                },
                invitee: {
                    accountId: d["invitee_id"],
                    name: d["invitee_name"]
                },
                inviteDate: new Date(Date.parse(d["invite_date"]))
            } as GroupInvitation
        });

    }

    public async getInvite(inviteId: number): Promise<GroupInvitation> {
        const d = await this.db.one("SELECT  gi.group_id as group_id, gi.id as invite_id, gi.status as status, p1.account_id as inviter_id, p1.region as inviter_region, p1.player_name as inviter_name, p2.account_id as invitee_id, p2.region as invitee_region, p2.player_name as invitee_name FROM groups g, group_invites gi, players p1, players p2 WHERE p2.id = gi.invitee and gi.group_id = g.id and p1.id = gi.inviter and gi.id = $1", [inviteId]);        
        return {
            inviteId: d["invite_id"],
            status: d["status"],
            group: {
                id: d["group_id"],
                name: d["group_name"]
            },
            inviter: {
                accountId: d["inviter_id"],
                name: d["inviter_name"],
                region: d["inviter_region"]
            },
            invitee: {
                accountId: d["invitee_id"],
                name: d["invitee_name"],
                region: d["invitee_region"]
            }
        } as GroupInvitation 
    }

    public async getGroupInfoForPlayer(playerId: number): Promise<{id: number, name: string}[]> {
        const groups = await this.db.query("SELECT g.name as name, g.id as id FROM groups g, players p, group_members gp WHERE gp.group_id = g.id and gp.player_id = p.id and p.id = $1", [playerId]);

        return groups;
    }
    
    public async getInvitesForPlayer(playerId: number, status: 'pending' | 'accepted' | 'declined' | 'canceled'): Promise<GroupInvitation[]> {
        const done = await this.db.query("SELECT  gi.invite_date as invite_date, g.id as group_id, g.name as group_name, gi.id as invite_id, gi.status as status, p1.account_id as inviter_id, p1.region as inviter_region, p1.player_name as inviter_name, p2.account_id as invitee_id, p2.region as invitee_region, p2.player_name as invitee_name FROM groups g, group_invites gi, players p1, players p2 WHERE p2.id = gi.invitee and gi.group_id = g.id and p1.id = gi.inviter and gi.status = $2 and gi.invitee = $1", [playerId, status]);
        return done.map((d: any) => {
            return {
                inviteId: d["invite_id"],
                status: d["status"],
                group: {
                    id: d["group_id"],
                    name: d["group_name"]
                },
                inviter: {
                    accountId: d["inviter_id"],
                    name: d["inviter_name"],
                    region: d["inviter_region"]
                },
                invitee: {
                    accountId: d["invitee_id"],
                    name: d["invitee_name"],
                    region: d["invitee_region"]
                },
                inviteDate: new Date(Date.parse(d["invite_date"]))
            } as GroupInvitation
        });
    }

    public async leaveGroup(playerId: number, groupId: number): Promise<boolean> {
        const rowCount = await this.db.result("DELETE FROM group_members WHERE group_id = $1 and player_id = $2", [groupId, playerId], (r) => r.rowCount)
        return rowCount == 1;

    }

    public async acceptInvitation(inviteId: number): Promise<boolean> {
        return this.updateInvitation(inviteId, "accepted")
    }

    public async declineInvitation(inviteId: number): Promise<boolean> {
        return this.updateInvitation(inviteId, "declined");
        
    }
    private async updateInvitation(inviteId: number, newStatus: 'accepted' | 'declined' | 'pending' | 'canceled') {
        const rowCount = await this.db.result("UPDATE group_invites SET status = $1 WHERE id = $2 and status = $3", [newStatus, inviteId, "pending"], (r) => r.rowCount)
        return rowCount == 1;
    }
}

export class GroupException extends Error {

    public constructor(msg: string) {
        super(msg);
    }
}