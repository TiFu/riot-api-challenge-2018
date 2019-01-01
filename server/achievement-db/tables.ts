export interface PlayerTableEntry {
    id: number
    account_id: number
    encrypted_account_id: string
    region: string
    player_name: string   
}

export interface PlayerAchievementEntry {
    player_id: number
    champ_id: number
    skin_id: number
    achievement_id: number
    achieved_at: Date
}