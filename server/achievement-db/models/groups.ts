
export type GroupId = number

export interface GroupInvitation {
    group: GroupInfo
    inviter: PlayerInfo
    invitee: PlayerInfo
}

export interface GroupInfo {
    id: number
    name: string
    region: string
}

export interface PlayerInfo {
    id: number
    name: string
}

export interface GroupMember {
    id: number
    name: string
    owner: boolean
    memberSince: Date
}   