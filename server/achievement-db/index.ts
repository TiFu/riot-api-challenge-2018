// Test DB
import {DBConfig} from 'achievement-config'

import {IMain, IDatabase, IConnected} from 'pg-promise';
import {Player} from './models'

import pgPromise from 'pg-promise';

export * from './models';

export class AchievementDB {
    private db: IDatabase<any>;

    constructor(config: DBConfig) {
        const psql: IMain = pgPromise();
        this.db = psql({
            "user": config.user,
            "password": config.password,
            "database": config.db,
            "port": config.port
        });
        
/*        db.connect().then(() => {
            return db.query('SELECT NOW()')
        }).then((response) => {
            console.log(response)
        }).catch((err) => {
            console.log(err)
        }).finally(() => {
            db.$pool.end()
        })*/
    }

    public connect(): Promise<IConnected<any>> {
        return this.db.connect()
    }
    public retrievePlayer(accountId: number, region: string): Promise<Player> {
        return Promise.resolve({
            "id": 5,
            "region": "euw",
            "accountId": "abcabcabc",
            "name": "TiFu"
        });
    }
}
