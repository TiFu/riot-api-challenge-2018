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
    public retrievePlayer(accountId: number, region: string, playerName: string): Promise<Player> {
        const vals = {
            "account_id": accountId,
            "region": region
        }
        return this.db.tx(t => {
            return t.query("SELECT * FROM players WHERE account_id = ${account_id} and region = ${region} LIMIT 1", vals).
            then((response: PlayerTableEntry[]) => {
                if (response.length == 0) {
                    return this.createPlayer(accountId, region, playerName);
                } else {
                    return this.mapFields<PlayerTableEntry, Player>(AchievementDB.PlayerTableMap, response[0])
                }
            })
        }); 
    }

    public createPlayer(accountId: number, region: string, playerName: string): Promise<Player> {
        const vals = {
            "account_id": accountId,
            "region": region,
            "player_name": playerName
        }
        return this.db.query("INSERT INTO players (account_id, region, player_name) VALUES (${account_id}, ${region}, ${player_name})", vals)
        .then((res) => {
            console.log(res);
            return res;
        })
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