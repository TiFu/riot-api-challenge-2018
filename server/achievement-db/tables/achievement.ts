import { IDatabase } from "pg-promise";
import { PlayerAchievement } from '../models/achievement';
import { handleMappingSingleRow } from '../util';


interface PlayerAchievementEntry {
    player_id: number
    champ_id: number
    skin_id: number
    achievement_id: number
    achieved_at: Date
}
export class AchievementDB {
    private static PlayerAchievementTableMap: { [k in keyof PlayerAchievementEntry]: keyof PlayerAchievement | null } = {
        "champ_id": "champId",
        "skin_id": "skinId",
        "achievement_id": "achievementId",
        "achieved_at": "achievedAt",
        "player_id": null
    }
    
    public constructor(private db: IDatabase<any>) {

    }

    public addGameToProcessedGames(playerId: number, region: string, gameId: number): Promise<void> {
        const vals = {
            "game_id": gameId,
            "player_id": playerId,
            "region": region
        }
        return this.db.query("INSERT INTO processed_games (player_id, game_id, region) VALUES (${player_id}, ${game_id}, ${region})", vals).then((result) => {
        })
    }
    
    public checkIfPlayerAndGameWereAlreadyProcessed(playerId: number, region: string, gameId: number): Promise<boolean> {
        const vals = {
            "game_id": gameId,
            "player_id": playerId,
            "region": region
        }
        return this.db.query("SELECT 1 FROM processed_games WHERE player_id = ${player_id} AND game_id = ${game_id} AND region = ${region}", vals).then((result) => {
            return result.length > 0
        })
    }

    public addAchievement(playerId: number, achievementId: number, champId: number, skinId: number): Promise<number> {
        const vals = {
            "achievement_id": achievementId,
            "player_id": playerId,
            "skin_id": skinId,
            "champ_id": champId
        }
        console.log("Using vals: ", vals);
        return this.db.query("INSERT INTO player_achievements (achievement_id, player_id, champ_id, skin_id) VALUES (${achievement_id}, ${player_id}, ${champ_id}, ${skin_id})", vals).catch((err) => {
            throw achievementId
        }).then(() => {
            return achievementId;
        });
    }

 

    public getPlayerAchievements(playerId: number): Promise<PlayerAchievement[]> {
        const vals = {
            "id": playerId
        }
        return this.db.query("SELECT achievement_id, achieved_at, champ_id, skin_id FROM player_achievements WHERE player_id = ${id}", vals).then((entries) => {
            console.log("Achievement Entries", entries);
            return entries.map((e: PlayerAchievementEntry) => handleMappingSingleRow<PlayerAchievementEntry, PlayerAchievement>([e], AchievementDB.PlayerAchievementTableMap));
        })
    }

}