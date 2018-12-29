import { RedisConfig} from 'achievement-config'
import redis from 'redis'

export class AchievementRedis {
    private redisClient: redis.RedisClient
    private static PROCESSING_ID_CTR = "processing_id_counter"
    private static PROCESSING_PREFIX = "processing_"
    private static PROCESSING_LIST = "processing_list"
    private static PROCESSING_EVENT_CHANNEL = "processing_channel"

    private subscriberFunctions: Array<() => void> = []
    private isInSubMode = false

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

    public subscribeToProcessingEvents(cb: () => void) {
        return new Promise((resolve, reject) => {
            this.redisClient.subscribe(AchievementRedis.PROCESSING_EVENT_CHANNEL, (err, msg) => {
                if (!err) {
                    resolve(msg)
                } else {
                    reject(err)
                }
            })
        }).then(() => {
            const cbHandler = (channel: string, message: string) =>{ 
                if (channel == AchievementRedis.PROCESSING_EVENT_CHANNEL) {
                    cb()
                }
            }
            this.redisClient.addListener("message", cbHandler)
            return cbHandler;
        })
    }

    public unsubscribeFromProcessingEvents(cb: () => void) {
        this.redisClient.removeListener("message", cb);
        return new Promise((resolve, reject) => {
            this.redisClient.unsubscribe(AchievementRedis.PROCESSING_EVENT_CHANNEL, (err, msg) => {
                if (!err) {
                    resolve(msg)
                } else {
                    reject(err);
                }
            })
        })
    }

    public addGameToProcessingQueue(gameId: number, platform: string): Promise<void> {
        return this.addProcessingIdToQueue(this.getProcessingId(gameId, platform)).then(() => {});
    }

    public getNextGameInProcessingQueue(): Promise<{ gameId: number, platform: string } | null> {
        return new Promise((resolve, reject) => {
            this.redisClient.spop(AchievementRedis.PROCESSING_LIST, (err: any, element: string) => {
                if (!err) {
                    if (element == null) {
                        resolve(null);
                    } else {
                        const result = this.getGameIdAndPlatformFromProcessingId(element)
                        resolve(result)
                    }
                } else {
                    reject(err)
                }
            })
        });
    }

    private publishEvent(channel: string, message: string) {
        return new Promise<number>((resolve, reject) => {
            this.redisClient.publish(channel, message, (err, receiveCount) =>{
                if (!err) {
                    resolve(receiveCount)
                } else {
                    reject(err)
                }
            })
        })
    }

    private addProcessingIdToQueue(processingId: string): Promise<number> {
        return new Promise((resolve, reject) => {
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
        }).then(() => {
            return this.publishEvent(AchievementRedis.PROCESSING_EVENT_CHANNEL, "");
        });
    }

    private getGameIdAndPlatformFromProcessingId(processingId: string): { gameId: number, platform: string } {
        const split = processingId.split("_")
        return {
            gameId: parseInt(split[2]),
            platform: split[1]
        }
    }

    private getProcessingId(gameId: number, platform: string): string {
        return AchievementRedis.PROCESSING_PREFIX + platform + "_" + gameId;
    }
}