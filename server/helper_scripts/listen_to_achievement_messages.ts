import { loadConfigFromEnvironment } from 'achievement-config';
import {AchievementRedis} from 'achievement-redis';

const conf = loadConfigFromEnvironment()
const redis = new AchievementRedis(conf.redis)

redis.subscribeToAchievementEvents((msg) => {
    console.log("Message!", msg);
})