import { AchievementDatabase, Player } from 'achievement-db';
import { GroupId, Group } from 'achievement-sio';
import { NotificationService } from './notification-service';
import { GroupInviteRequest } from 'achievement-sio';
import { DetailedGroupInvite } from '../../../../common/achievement-sio/types/group';
export class GroupService {
    
    public constructor(private db: AchievementDatabase, private notificationService: NotificationService) {

    }

    public async fetchGroup(groupId: GroupId): Promise<Group> {
        const group = await this.db.GroupDB.getGroupInfo(groupId);
        console.log("fecthing  members")
        const members = await this.db.GroupDB.getGroupMembers(groupId);
        console.log("fetching invitations")
        const invitations = await this.db.GroupDB.getInvitesForGroup(groupId, "pending");
//        const achievements = await this.db.AchievementDB.getGroupAchievements(groupId);
        const mappedInvites: DetailedGroupInvite[] = invitations.map((i) => {
            return {
                inviter: i.inviter,
                invitee: i.invitee,
                inviteId: i.inviteId,
                status: i.status
            }
        })

        return {
            id: group.id,
            name: group.name,
            players: members,
            invites: mappedInvites,
            achievements: []// achievements
        };
    }

    public async createGroup(playerId: number, groupName: string): Promise<Group> {
        const createdGroupId = await this.db.GroupDB.createGroup(playerId, groupName);
        return this.fetchGroup(createdGroupId);
    }
    
    public async leaveGroup(player: Player, groupId: GroupId): Promise<boolean> {
        const leftGroup = await this.db.GroupDB.leaveGroup(player.id, groupId);
        return leftGroup;
    }

    public async updateInvitation(player: Player, inviteId: number, accepted: boolean): Promise<number> {
        console.log("updating invitation")
        const invite = await this.db.GroupDB.getInvite(inviteId); 
        console.log("fetched invite", invite)
        if (invite.status != "pending") {
            throw new GroupServiceException("Sorry but it seems like the invite expired.");
        }
        if (invite.invitee.accountId != player.accountId || invite.invitee.region != player.region) {
            throw new GroupServiceException("You are no authorized to accept this request. Only the invited user may accept invite requests.");
        }
        if (accepted) {
            console.log("accepting invitation")
            const success =  await this.db.GroupDB.acceptInvitation(inviteId);
            if (success) {
                await this.db.GroupDB.addPlayerToGroup(player.id, invite.group.id, false);
                console.log("sending invitation update")
                this.notificationService.notifyInvitationUpdate(player, invite.group.id, "accepted");
                return invite.group.id
            } else {
                throw new GroupServiceException("Failed to accept invitation!");
            }
        }  else {
            console.log("declining invitation")
            const success = await this.db.GroupDB.declineInvitation(inviteId);
            if (success){ 
                console.log("sending invitation update")
                this.notificationService.notifyInvitationUpdate(player, invite.group.id, "declined");
                return invite.group.id
            } else {
                throw new GroupServiceException("Failed to decline invitation!");
            }
        }
    }

    public async addGroupInviteRequest(inviterId: number, invitee: { accountId: number, region: string }, groupId: GroupId): Promise<void> {
        const isMember = await this.db.GroupDB.isMember(inviterId, groupId);
        if (!isMember) {
            throw new GroupServiceException("You are not a member of this group.");
        } else {
            const player = await this.db.PlayerDB.getPlayerByAccountId(invitee.accountId, invitee.region);
            if (player == null) {
                throw new GroupServiceException("We did not find the player you wanted to invite.");
            }
            const group = await this.db.GroupDB.getGroupInfo(groupId);
            if (group.region != player.region) {
                throw new GroupServiceException("The player and the group have to be in the same region!");
            }
            const request = await this.db.GroupDB.addInvitation(player.id, inviterId, groupId);
            const inviter = await this.db.PlayerDB.getPlayerById(inviterId) as Player;
            const notifications = this.notificationService.notifyNewInvitation(player, request, group, inviter);
        }
    }
}

export class GroupServiceException extends Error {

    public constructor(msg: string) {
        super(msg)
    }
}