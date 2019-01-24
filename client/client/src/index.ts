import { LCUService } from './services/LCUService';
import { LCUUpdateHandler } from './eventHandlers/LCUUpdateHandler';
import configureStore from './store/index';
import { updateLCUConnectedState, updateChampSelect } from './store/lcu/actions';
import { AchievementSocketIOService } from './services/AchievementSIOService';
import eventBus from './store/events';
import { endOfGameDetected, updatePlayerInfo } from './store/player/actions';

const store = configureStore();

const lcu = new LCUService();
const sioService = new AchievementSocketIOService(store, "http://localhost:" + 3000, eventBus);


store.subscribe(() => {
    console.log(store.getState());
})

// "Admiral Alonso"
// 3876439142
console.log("Process.argv: ", process.argv)
console.log("Using player: ", process.argv[2]);
console.log("Using game id: ", process.argv[3]);
store.dispatch(updatePlayerInfo({
    playerName: process.argv[2],
    accountId: 36904072,
    platformId: "euw1"
}))

setTimeout(() => {
    store.dispatch(endOfGameDetected(Number.parseInt(process.argv[3]), 1, 2000))
}, 5000)