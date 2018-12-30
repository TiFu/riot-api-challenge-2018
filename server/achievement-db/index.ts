// Test DB
import {DBConfig} from 'achievement-config'

import {IMain, IDatabase, IConnected} from 'pg-promise';
import {Player} from './models'

import pgPromise from 'pg-promise';
import { PlayerTableEntry } from './tables';
import { loadConfigFromEnvironment } from 'achievement-config';

export * from './models';

export class AchievementDB {
    private db: IDatabase<any>;
    private static PlayerTableMap: { [k in keyof PlayerTableEntry]: keyof Player} = {
        "account_id": "accountId",
        "encrypted_account_id": "encryptedAccountId",
        "id": "id",
        "player_name": "name",
        "region": "region"
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

    public addAchievement(playerId: number, achievementId: number): Promise<number> {
        const vals = {
            "achievement_id": achievementId,
            "player_id": playerId
        }
        return this.db.query("INSERT INTO player_achievements (achievement_id, player_id) VALUES (${achievement_id}, ${player_id})", vals).catch((err) => {
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
            if (response.length == 0) {
                return null; 
            } else {
                return this.mapFields<PlayerTableEntry, Player>(AchievementDB.PlayerTableMap, response[0])
            }
        })
    }
    public getPlayer(encryptedAccountId: string, region: string): Promise<Player | null> {
        const vals = {
            "encrypted_account_id": encryptedAccountId,
            "region": region.toLowerCase()
        }
        return this.db.query("SELECT * from players WHERE encrypted_account_id = ${encrypted_account_id} and region = ${region} LIMIT 1", vals)
        .then((response: PlayerTableEntry[]) => {
            if (response.length == 0) {
                return null; 
            } else {
                return this.mapFields<PlayerTableEntry, Player>(AchievementDB.PlayerTableMap, response[0])
            }
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

    private mapFields<T, V>(fieldMap: { [k in keyof T]: keyof V}, response: T): V {
        const result: any = {} 
        for (let key in fieldMap) {
            result[fieldMap[key]] = response[key]
        }
        return result;
    }

    private mapFieldsReverse<T, V>(fieldMap: { [k in keyof T]: keyof V}, response: V): T {
        const result: any = {} 
        for (let key in fieldMap) {
            result[key] = response[fieldMap[key]]
        }
        return result;
    }
}