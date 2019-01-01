export interface Player {
    id: number
    region: string
    accountId: number
    encryptedAccountId: string
    name: string
}

export interface PlayerAchievement {
    achievementId: number
    skinId: number
    champId: number
    achievedAt: Date
}

export interface Group {
    id: number
    region: string
}

