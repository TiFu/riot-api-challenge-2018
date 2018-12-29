import { loadConfigFromEnvironment } from 'achievement-config';
import {AchievementRedis} from 'achievement-redis';

const conf = loadConfigFromEnvironment()
const redis = new AchievementRedis(conf.redis)

redis.addGameToProcessingQueue(3876439142, "euw").then((doner => {
    console.log("Added game!");
}))