
export type GroupId = number

export interface GroupInvitation {
    group: GroupInfo
    inviter: InviterInfo
    invitee: InviterInfo
}

export interface GroupInfo {
    id: number
    name: string
}

export interface InviterInfo {
    id: number
    name: string
}