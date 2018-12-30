import { AchievementRedis } from 'achievement-redis';
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

    public async run() { 
        if (!this._stop) {
            try {
                console.log("Fetching next game in queue!")
                const nextGame = await this.otherRedis.getNextGameInProcessingQueue()
                const result = await this.handleGame(nextGame);
                if (!result) {
                    this.subscribeToNewGameInQueueEvent();
                } else {
                    this.run();
                }
            } catch (err) {
                console.log("Failed to fetch next game in queue!", err)
                Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 3000);
                this.run();
            }
        }
    }

    private async subscribeToNewGameInQueueEvent() {
        console.log("Subscribing");
        const cb = await this.subscribeRedis.subscribeToProcessingEvents(this.subscribeCallback)
        this.currentSubscribeCallback = cb;
    }

    private handleWakeUp() {
        console.log("unsubscribing")
        this.subscribeRedis.unsubscribeFromProcessingEvents(this.currentSubscribeCallback).catch((err) => {
            console.log("Failed to unsubscribe!", err);
        })
        this.currentSubscribeCallback = null
        this.run();
    }

    private async handleGame(game: { gameId: number, platform: string } | null): Promise<boolean> {
        if (game == null) {
            console.log("No game found!")
            return Promise.resolve(false);
        }
        console.log("Processing game!")
        await this.processingService.processGame(game.gameId, game.platform);
        return true;
    }
}