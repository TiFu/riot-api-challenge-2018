import { loadConfigFromEnvironment } from '../achievement-config/index';
import { AchievementDB} from 'achievement-db'
import pgPromise from 'pg-promise';

const config = loadConfigFromEnvironment().db;
const psql = pgPromise();
const db = psql({
    "user": config.user,
    "password": config.password,
    "database": config.db,
    "port": config.port
});
print()

async function print() {
    await printTable("players")
    await printTable("processed_games")
    await printTable("player_achievements")
}

async function printTable(tableName: string) {
    const players = await db.query("SELECT * from " + tableName)
    console.log(tableName + " Table!")
    for (const player of players) {
        console.log(player)
    }
    console.log("----------------")
}