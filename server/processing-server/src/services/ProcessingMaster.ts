import { AchievementRedis } from '../../../achievement-redis/index';
import { ProcessingService } from './ProcessingService';

export class ProcessingMaster {
    private _stop: boolean = false;
    private subscribeCallback = () => this.handleWakeUp()
    private currentSubscribeCallback: any = null

    public constructor(private subscribeRedis: AchievementRedis, private otherRedis: AchievementRedis, private processingService: ProcessingService) {

    }

    public stop() {
        this._stop = true
    }

    public run() { 
        if (!this._stop) {
            console.log("Fetching next game in queue!")
            this.otherRedis.getNextGameInProcessingQueue().then((game) => this.handleGame(game)).then((result) => {
                if (!result) {
                    console.log("Subscribing")
                    this.subscribeRedis.subscribeToProcessingEvents(this.subscribeCallback).then((cb) => {
                        this.currentSubscribeCallback = cb
                    }).catch((err) => {
                        console.log("Failed to subcsribe!", err);
                        this.run()
                    })
                } else {
                    this.run();
                }
            }).catch((err) => {
                console.log("Failed to fetch next game in queue!", err)
                Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 3000);
                this.run();
            })
        }
    }

    private handleWakeUp() {
        console.log("unsubscribing")
        this.subscribeRedis.unsubscribeFromProcessingEvents(this.currentSubscribeCallback).catch((err) => {
            console.log("Failed to unsubscribe!", err);
        })
        this.currentSubscribeCallback = null
        this.run();
    }

    private handleGame(game: { gameId: number, platform: string } | null): Promise<boolean> {
        if (game == null) {
            console.log("No game found!")
            return Promise.resolve(false);
        }
        console.log("Processing game!")
        return this.processingService.processGame(game.gameId, game.platform).then(() => {
            return true;
        })
    }
}