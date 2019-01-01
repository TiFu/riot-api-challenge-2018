import { LCUService, LCUListener } from '../services/LCUService';
import { updateLCUConnectedState, updateChampSelect } from '../store/lcu/actions';
import { updatePlayerInfo, endOfGameDetected } from '../store/player/actions';
import { AchievementStore } from '../store/index'
import { AchievementSocketIOService } from '../services/AchievementSIOService';

export class LCUUpdateHandler implements LCUListener {
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

    public onGameEnd(gameId: number): void {
        const state = this.store.getState().lcu

        this.store.dispatch(endOfGameDetected(gameId, state.champselect.champId, state.champselect.skinId));
    }

    public onChampAndSkinChanged(champId: number, skinId: number): void {
        this.store.dispatch(updateChampSelect(champId, skinId));
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