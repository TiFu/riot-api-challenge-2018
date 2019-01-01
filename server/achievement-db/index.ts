// Test DB
import {DBConfig} from 'achievement-config'

import {IMain, IDatabase, IConnected} from 'pg-promise';
import { Player, PlayerAchievement } from './models';

import pgPromise from 'pg-promise';
import { PlayerTableEntry, PlayerAchievementEntry } from './tables';
import { loadConfigFromEnvironment } from 'achievement-config';

export * from './models';

export class AchievementDB {
    private db: IDatabase<any>;
    private static PlayerTableMap: { [k in keyof PlayerTableEntry]: keyof Player | null} = {
        "account_id": "accountId",
        "encrypted_account_id": "encryptedAccountId",
        "id": "id",
        "player_name": "name",
        "region": "region"
    }
    private static PlayerAchievementTableMap: { [k in keyof PlayerAchievementEntry]: keyof PlayerAchievement | null } = {
        "champ_id": "champId",
        "skin_id": "skinId",
        "achievement_id": "achievementId",
        "achieved_at": "achievedAt",
        "player_id": null
    }

    constructor(config: DBConfig) {
        const psql: IMain = pgPromise();
        this.db = psql({
            "user": config.user,
            "password": config.password,
            "database": config.db,
            "port": config.port
        });
        
    }

    public connect(): Promise<IConnected<any>> {
        return this.db.connect()
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
        return this.db.query("INSERT INTO player_achievements (achievement_id, player_id, champ_id, skin_id) VALUES (${achievement_id}, ${player_id}, ${champ_id}, ${skin_id})", vals).catch((err) => {
            throw achievementId
        }).then(() => {
            return achievementId;
        });
    }

    public getPlayerByAccountId(accountId: number, region: string): Promise<Player | null> {
        const vals = {
            "account_id": accountId,
            "region": region.toLowerCase()
        }
        return this.db.query("SELECT * from players WHERE account_id = ${account_id} and region = ${region} LIMIT 1", vals)
        .then((response: PlayerTableEntry[]) => {
            return this.handleMappingSingleRow<PlayerTableEntry, Player>(response, AchievementDB.PlayerTableMap);
        })
    }

    public getPlayerById(playerId: number) {
        const vals = {
            "id": playerId
        }
        return this.db.query("SELECT * from players WHERE id = ${id} LIMIT 1", vals).then((response) =>{ 
            return this.handleMappingSingleRow<PlayerTableEntry, Player>(response, AchievementDB.PlayerTableMap);
        });
    }

    public getPlayerAchievements(playerId: number): Promise<PlayerAchievement[]> {
        const vals = {
            "id": playerId
        }
        return this.db.query("SELECT achievement_id, achieved_at FROM player_achievements WHERE player_id = ${id}", vals).then((entries) => {
            console.log("Achievement Entries", entries);
            return entries.map((e: PlayerAchievementEntry) => this.handleMappingSingleRow<PlayerAchievementEntry, PlayerAchievement>([e], AchievementDB.PlayerAchievementTableMap));
        })
    }

    public getPlayer(encryptedAccountId: string, region: string): Promise<Player | null> {
        const vals = {
            "encrypted_account_id": encryptedAccountId,
            "region": region.toLowerCase()
        }
        return this.db.query("SELECT * from players WHERE encrypted_account_id = ${encrypted_account_id} and region = ${region} LIMIT 1", vals)
        .then((response: PlayerTableEntry[]) => {
            return this.handleMappingSingleRow<PlayerTableEntry, Player>(response, AchievementDB.PlayerTableMap);
        })
    }

    public createPlayer(accountId: number, region: string, playerName: string, encryptedAccountId: string): Promise<Player | null> {
        const vals = {
            "account_id": accountId,
            "region": region,
            "player_name": playerName,
            "encrypted_account_id": encryptedAccountId
        }
        return this.db.query("INSERT INTO players (account_id, region, player_name, encrypted_account_id) VALUES (${account_id}, ${region}, ${player_name}, ${encrypted_account_id})", vals)
        .then((res) => {
            return this.getPlayer(encryptedAccountId, region);
        });
    }

    private handleMappingSingleRow<T, V>(response: T[], map: { [k in keyof T]: keyof V | null}): V | null {
        if (response.length == 0) {
            return null; 
        } else {
            return this.mapFields<T, V>(map, response[0]);
        }
    }

    private mapFields<T, V>(fieldMap: { [k in keyof T]: keyof V | null}, response: T): V {
        const result: any = {} 
        for (let key in fieldMap) {
            if (fieldMap[key] != null) {
                result[fieldMap[key]] = response[key]
            }
        }
        return result;
    }

    private mapFieldsReverse<T, V>(fieldMap: { [k in keyof T]: keyof V | null}, response: V): T {
        const result: any = {} 
        for (let key in fieldMap) {
            const index = fieldMap[key]
            if (index != null) {
                result[key] = response[index as keyof V]
            }
        }
        return result;
    }
}