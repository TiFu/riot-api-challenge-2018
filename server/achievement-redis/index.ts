import { RedisConfig} from 'achievement-config'
import redis from 'redis'

export class AchievementRedis {
    private redisClient: redis.RedisClient
    private static PROCESSING_ID_CTR = "processing_id_counter"
    private static PROCESSING_PREFIX = "processing_"
    private static PROCESSING_LIST = "processing_list"

    public constructor(config: RedisConfig) {
        this.redisClient = redis.createClient({
            host: config.url,
            port: config.port
        })

        this.redisClient.on("error", function (err: any) {
            console.log("Error " + err);
        });
    }

    public subToNotifications(listener: () => void) {
        // TODO: transfered info?
    }

    public addGameToProcessingQueue(gameId: number, platform: string): Promise<void> {
        return this.addGameToRedisKey(this.getProcessingId(gameId, platform), gameId, platform)
        .then((processingId: string) =>{ 
            return this.addProcessingIdToQueue(processingId)
        });
    }

    private addGameToRedisKey(processingId: string, gameId: number, platform: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.redisClient.hmset(processingId, "gameId", gameId, "platform", platform, (err: any, ok: "OK") => {
                console.log("Added game " + gameId + " on platform " + platform + " for processing id: "+ processingId)
                if (!err) {
                    resolve(processingId);
                }
                else {
                    reject(err);
                }
            });
        });
    }

    private addProcessingIdToQueue(processingId: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.redisClient.sadd(AchievementRedis.PROCESSING_LIST, processingId, (err: any, ok: number) => {
                console.log("Added " + processingId + " to processing list!");
                if (err) {
                    reject(err);
                }
                else if (ok > 1) { // 0 is fine - in that case the game was already being processed anyway
                    reject("Added more than 1 value to processing list???");
                }
                else {
                    resolve();
                }
            });
        });
    }

    private getProcessingId(gameId: number, platform: string): string {
        return AchievementRedis.PROCESSING_PREFIX + platform + "_" + gameId;
    }
}