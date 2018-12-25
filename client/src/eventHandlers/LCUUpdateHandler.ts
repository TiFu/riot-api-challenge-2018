import { AchievementEventBus } from '../events';
import { LCUService } from '../services/LCUService';

export class LCUUpdateHandler {
    public constructor(private eventBus: AchievementEventBus, private lcuService: LCUService) {
        this.eventBus.lcu_connected.on(this.handleLCUConnected);
        this.eventBus.lcu_disconnected.on(this.handleLCUDisconnected)
        this.eventBus.user_login.on(this.handleUserLogin);
    }

    private handleUserLogin() {
        this.fetchUserAndPublishUpdate()
    }

    private handleLCUConnected() { 
        this.fetchUserAndPublishUpdate()
    }

    private handleLCUDisconnected() {
        this.eventBus.user_update(null);
    }

    private fetchUserAndPublishUpdate(){ 
        this.lcuService.fetchCurrentSummoner().then((player) => {
            this.eventBus.user_update(player);
        }).catch((err) => {
            console.log("User not logged in!", err);
        })
    }
}