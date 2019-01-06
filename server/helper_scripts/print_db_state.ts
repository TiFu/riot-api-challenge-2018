import { loadConfigFromEnvironment } from '../achievement-config/index';
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
    for (const table of ["players", "processed_games", "player_achievements", "groups", "group_members", "group_invites", "group_achievements", "group_achievement_participants", "processed_group_games"]) {
        await printTable(table);
    }
}

async function printTable(tableName: string) {
    const players = await db.query("SELECT * from " + tableName)
    console.log(tableName + " Table!")
    for (const player of players) {
        console.log(player)
    }
    console.log("----------------")
}