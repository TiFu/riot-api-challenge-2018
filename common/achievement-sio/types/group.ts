import { PlayerId, PlayerPartialInfo } from './player';
import {Achievement} from './achievement'

export type GroupId = number

export type GroupPartialInfo = {
    id: GroupId,
    name: string,
    members: PlayerPartialInfo[]
}

export type GroupInvite = {
    groupId: GroupId
    inviter: PlayerPartialInfo
}

export type GroupInviteRequest = {
    group: GroupPartialInfo,
    inviter: PlayerPartialInfo
    state: "PENDING" | "CANCELLED" | "ACCEPTED"
}

export type GroupInviteResponse = {
    groupId: GroupId
    accept: boolean
}

export type CreateGroup = {
    name: string
}

export type Group = {
    name: string
    players: PlayerId[]
    achievements: Achievement[]
    invites: GroupInviteRequest
}