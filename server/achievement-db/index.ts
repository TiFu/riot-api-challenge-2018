// Test DB
import {DBConfig} from 'achievement-config'

import {IMain, IDatabase, IConnected} from 'pg-promise';

import pgPromise from 'pg-promise';
import { GroupDB } from './tables/group';
import { PlayerDB } from './tables/player';
import { AchievementDB} from './tables/achievement'
export * from './models/index';

export class AchievementDatabase {
    private db: IDatabase<any>;
    
    public readonly GroupDB: GroupDB;
    public readonly PlayerDB: PlayerDB;
    public readonly AchievementDB: AchievementDB

    constructor(config: DBConfig) {
        const psql: IMain = pgPromise();
        this.db = psql({
            "host": config.url,
            "user": config.user,
            "password": config.password,
            "database": config.db,
            "port": config.port
        });  
        this.GroupDB = new GroupDB(this.db);
        this.PlayerDB = new PlayerDB(this.db);
        this.AchievementDB = new AchievementDB(this.db, psql);
    }

    public connect(): Promise<IConnected<any>> {
        return this.db.connect()
    }
}