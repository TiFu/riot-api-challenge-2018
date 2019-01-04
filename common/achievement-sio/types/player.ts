import {Achievement} from './achievement';
import { GroupPartialInfo, GroupInvite, GroupInviteRequest } from './group';

export type SearchPlayerMessage = {
    searchString: string
}
export type OpenPlayerMessage = PlayerId

export type SearchPlayerError = string
export type PlayerId = number

export type PublicPlayerData = {
    accountId: PlayerId,
    region: string,
    playerName: string,
    achievements: Array<Achievement>
}

export type HelloMessage = {
    playerName: string,
    accountId: number,
    platformId: string
}


export type PlayerData = {
    playerName: string
    achievements: Array<Achievement>
    groups: Array<GroupPartialInfo>
    invites: Array<GroupInviteRequest>
}

export type PlayerPartialInfo = {
    accountId: PlayerId
    name: string
    region: string
}
