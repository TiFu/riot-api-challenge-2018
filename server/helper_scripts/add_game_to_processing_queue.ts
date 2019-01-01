import { loadConfigFromEnvironment } from 'achievement-config';
import {AchievementRedis} from 'achievement-redis';

const conf = loadConfigFromEnvironment()
const redis = new AchievementRedis(conf.redis)

redis.addGameToProcessingQueue({ "playerId": 1, "gameId": 3876439142, "platform": "euw1", "champId": 1, "skinId": 2000 }).then((doner => {
    console.log("Added game!");
}))