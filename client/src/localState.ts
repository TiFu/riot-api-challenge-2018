import { AchievementEventBus } from './events';
import { LocalPlayer } from './models';

export class LocalState {
    private currentPlayer: LocalPlayer | null = null;

    public constructor(private eventBus: AchievementEventBus) {
        this.eventBus.user_update.on(this.updatePlayerChanged);
    }

    private updatePlayerChanged(player: LocalPlayer) {
        console.log("State Changed: player updated ", player);
        this.currentPlayer = player;
    }
}