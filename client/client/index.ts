import { LCUService } from './services/LCUService';
import { LCUUpdateHandler } from './eventHandlers/LCUUpdateHandler';
import configureStore from './store/index';
import { updateLCUConnectedState, updateChampSelect } from './store/lcu/actions';
import { AchievementSocketIOService } from './services/AchievementSIOService';
import eventBus from './store/events';
import { endOfGameDetected, updatePlayerInfo } from './store/player/actions';

const store = configureStore();

const lcu = new LCUService();
const sioService = new AchievementSocketIOService(store, "http://trophy-hunter.pro:" + 80, eventBus);
const lcuListener = new LCUUpdateHandler(lcu, store, sioService);
lcu.setListener(lcuListener)

store.subscribe(() => {
    console.log(store.getState());
})
lcu.start()

/*setTimeout(() => {
    store.dispatch(updateChampSelect(1, 2000));
    store.dispatch(updatePlayerInfo({
        playerName: "TiFu",
        accountId: 36904072,
        platformId: "euw1"
    }))
    store.dispatch(endOfGameDetected(3876439142, 1, 2000))
}, 5000)*/