import { PlayerId, PlayerPartialInfo } from './player';
import {Achievement} from './achievement'

export type GroupId = number

export type GroupPartialInfo = {
    id: GroupId,
    name: string,
    members: GroupPlayerPartialInfo[],
    achievements: Achievement[]
}

export interface GroupPlayerPartialInfo extends PlayerPartialInfo {
    memberSince: string
}

export type GroupInviteUpdate = { 
    groupId: number, 
    player: PlayerPartialInfo, 
    newStatus: "accepted" | "canceled" | "declined" | "pending" 
}

export type GroupInviteRequestMessage = {
    group: GroupId
    invitee: PlayerPartialInfo
}

export type GroupInviteRequest = {
    groupId: number,
    groupName: string,
    inviteId: number,
    inviter: PlayerPartialInfo
    status: "pending" | "canceled" | "accepted" | "declined",
    date: Date
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
    players: GroupPlayerPartialInfo[]
    achievements: Achievement[]
    invites: DetailedGroupInvite[]
}