
export type GroupId = number

export interface GroupInvitation {
    inviteId: number
    group: {
        id: number,
        name: string
    }
    inviter: PlayerInfo
    invitee: PlayerInfo
    status: "canceled" | "pending" | "accepted" | "declined"
}

export interface GroupInfo {
    id: number
    name: string
    region: string
}

export interface PlayerInfo {
    accountId: number
    name: string
    region: string
}

export interface GroupMember {
    accountId: number
    name: string
    owner: boolean
    region: string
    memberSince: Date
}   