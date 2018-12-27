import { LCUService, LCUListener } from '../services/LCUService';
import { updateLCUConnectedState } from '../store/lcu/actions';
import { updatePlayerInfo, endOfGameDetected } from '../store/player/actions';
import { AchievementStore } from '../store/index'
import { AchievementSocketIOService } from '../services/AchievementSIOService';

export class LCUUpdateHandler implements LCUListener {
    private failedGameIds: Set<number> = new Set<number>()
    private interval: any = null;

    public constructor(private lcuService: LCUService, private store: AchievementStore, private sioService: AchievementSocketIOService) {
    }

    public onConnectionStateChanged(state: boolean): void {
        this.store.dispatch(updateLCUConnectedState(state))
        if (state) {
            this.fetchUserAndPublishUpdate();
        } else {
            this.store.dispatch(updatePlayerInfo(null))
        }
    }

    public onUserLogin(): void {
        this.fetchUserAndPublishUpdate();
    }

    public onGameEnd(gameId: number, maxRetries: number = 3): Promise<boolean> {
        return this.lcuService.fetchGame(gameId).then((data) => {
            this.failedGameIds.delete(gameId);
            try {
                this.store.dispatch(endOfGameDetected(data))
            } catch(err) {
                console.log(err)
            }
            return true;
        }).catch((err) => {
            console.log("Failed to fetch game!")
            if (maxRetries > 0) {
                return this.onGameEnd(gameId, maxRetries - 1)
            } else {
                this.failedGameIds.add(gameId);
                return false
            }
        })
    }

    private addFailedGameId(gameId: number) {
        this.failedGameIds.add(gameId)
        this.setTimeOutForRetryGameIds()
    }

    private setTimeOutForRetryGameIds() {
        if (this.failedGameIds.size > 0) {
            this.interval = setTimeout(this.handleFailedGameIds, 60000);
        }
    }
    private handleFailedGameIds(){ 
        const promises = []
        for (const gameId of this.failedGameIds) {
            promises.push(this.onGameEnd(gameId));
        }
        Promise.all(promises).then(() => {
            this.setTimeOutForRetryGameIds()
        })
    }

    private fetchUserAndPublishUpdate(){ 
        this.lcuService.fetchCurrentSummoner().then((player) => {
            this.store.dispatch(updatePlayerInfo(player));
        }).catch((err) => {
            console.log("User probably not logged in");
            // user probably not logged in
        })
    }
}