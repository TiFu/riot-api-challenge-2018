import { RedisConfig} from 'achievement-config'
import redis from 'redis'

export class AchievementRedis {

    public constructor(config: RedisConfig) {
        const redisClient = redis.createClient({
            host: config.url,
            port: config.port
        })

        redisClient.on("error", function (err: any) {
            console.log("Error " + err);
        });
        redisClient.set("test", "test", "EX", 10, redis.print)
    }
}