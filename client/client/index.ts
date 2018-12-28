import { LCUService } from './services/LCUService';
import { LCUUpdateHandler } from './eventHandlers/LCUUpdateHandler';
import configureStore from './store/index';
import { updateLCUConnectedState } from './store/lcu/actions';
import { AchievementSocketIOService } from './services/AchievementSIOService';
import eventBus from './store/events';
import { endOfGameDetected } from './store/player/actions';

const store = configureStore();
const lcu = new LCUService();

const sioService = new AchievementSocketIOService(store, "http://localhost:" + 3000, eventBus);
const lcuListener = new LCUUpdateHandler(lcu, store, sioService);
lcu.setListener(lcuListener)

store.subscribe(() => {
    console.log(store.getState());
})
lcu.start()

setTimeout(() => {
    store.dispatch(endOfGameDetected(1234))
}, 5000)