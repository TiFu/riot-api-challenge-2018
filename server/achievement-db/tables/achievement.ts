import { IDatabase, ColumnSet,  } from "pg-promise";
import { PlayerAchievement, GroupAchievement } from '../models/achievement';
import { handleMappingSingleRow } from '../util';
import * as pgPromise from 'pg-promise';

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
    
    public constructor(private db: IDatabase<any>, private psql: pgPromise.IMain) {

    }

    public async getGroupAchievements(groupId: number): Promise<GroupAchievement[]> {
        const result = await this.db.query("SELECT achievement_id, champ_id, achieved_at FROM player_achievements WHERE player_id = $1", [groupId])
        return result.map((a: { "achievement_id": number, "champ_id": number, "achieved_at": Date}) => {
            return {
                "achievementId": a["achievement_id"],
                "champId": a["champ_id"],
                "achievedAt": a["achieved_at"]
            }
        })
    }

    public addGameToProcessedGroupGames(groupId: number, region: string, gameId: number): Promise<void> {
        const vals = {
            "game_id": gameId,
            "group_id": groupId,
            "region": region
        }
        return this.db.query("INSERT INTO processed_group_games (group_id, game_id, region) VALUES (${group_id}, ${game_id}, ${region})", vals).then((result) => {
        })
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

    public async addGroupAchievement(groupId: number, achievementId: number, champId: number, participantPlayerIds: number[]): Promise<void> {
        const vals = {
            "achievement_id": achievementId,
            "group_id": groupId,
            "champ_id": champId
        }
        console.log("Using vals: ", vals);
        return this.db.task(async (conn) => {
            const addedAchievement = await conn.query("INSERT INTO group_achievements (achievement_id, group_id, champ_id) VALUES (${achievement_id}, ${group_id}, ${champ_id}) RETURNING id", vals)
            console.log("ADding achievement", vals)
            const groupAchievementId = addedAchievement[0].id;
            const memberIds = await this.getMemberNumbers(participantPlayerIds, groupId);
            console.log("Adding member ids: ", memberIds) 
            const cs = new this.psql.helpers.ColumnSet([ "group_achievement_id", "member_id"], { table: "group_achievement_participants"});
            const values = memberIds.map(v => { 
                return { "group_achievement_id": groupAchievementId, "member_id":  v }
            });
            console.log("Inserting: ", values)          
            const query = this.psql.helpers.insert(values, cs);
            console.log(query);
            return conn.none(query).then(() => achievementId);
        }).catch((err) => {
            console.log(err);
            throw(achievementId)
        })
    }

    private async getMemberNumbers(playerIds: number[], groupId: number): Promise<number[]> {
        return this.db.query("SELECT id FROM group_members WHERE player_id in ($1:csv) and group_id = $2", [playerIds, groupId]).then((result) => {
            return result.map((r: { "id": number}) => r["id"]);
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