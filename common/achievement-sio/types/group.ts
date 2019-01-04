import { PlayerId, PlayerPartialInfo } from './player';
import {Achievement} from './achievement'

export type GroupId = number

export type GroupPartialInfo = {
    id: GroupId,
    name: string,
    members: PlayerPartialInfo[]
}

export type GroupInvite = {
    inviteId: number,
    groupId: number,
    inviter: PlayerPartialInfo
}

export type GroupInvitationNotification = {
    inviteId: number
    groupName: string
    inviter: PlayerPartialInfo
}

export type GroupInviteRequestMessage = {
    group: GroupId
    invitee: PlayerPartialInfo
}

export type GroupInviteRequest = {
    groupId: number,
    inviteId: number,
    inviter: PlayerPartialInfo
    invitee: PlayerPartialInfo
    status: "pending" | "canceled" | "accepted" | "declined"
}

export type GroupInviteResponse = {
    inviteId: number
    accept: boolean
}

export type CreateGroup = {
    name: string
}

export type DetailedGroupInvite = {
    inviteId: number,
    inviter: PlayerPartialInfo
    invitee: PlayerPartialInfo
    status: "pending" | "canceled" | "accepted" | "declined"
}
export type Group = {
    id: number
    name: string
    players: PlayerPartialInfo[]
    achievements: Achievement[]
    invites: DetailedGroupInvite[]
}