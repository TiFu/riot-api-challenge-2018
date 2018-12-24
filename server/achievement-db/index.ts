// Test DB
import {DBConfig} from 'achievement-config'

import {IMain, IDatabase} from 'pg-promise';
import pgPromise from 'pg-promise';

export class AchievementDB {
    private db: IDatabase<any>;

    constructor(config: DBConfig) {
        const psql: IMain = pgPromise();
        const db:IDatabase<any> = psql({
            "user": config.user,
            "password": config.password,
            "database": config.db,
            "port": config.port
        });
        
        db.connect().then(() => {
            return db.query('SELECT NOW()')
        }).then((response) => {
            console.log(response)
        }).catch((err) => {
            console.log(err)
        }).finally(() => {
            db.$pool.end()
        })
        this.db = db; 
    }
}
