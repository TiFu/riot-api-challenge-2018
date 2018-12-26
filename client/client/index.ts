import { LCUService } from './services/LCUService';
import { LCUUpdateHandler } from './eventHandlers/LCUUpdateHandler';
import configureStore from './store/index';
import { updateLCUConnectedState } from './store/lcu/actions';
import { AchievementSocketIOService } from './services/AchievementSIOService';
import eventBus from './store/events';

const store = configureStore();
const lcu = new LCUService();

const sioService = new AchievementSocketIOService("http://localhost:" + 3000, eventBus);
const lcuListener = new LCUUpdateHandler(lcu, store, sioService);
lcu.setListener(lcuListener)

store.subscribe(() => {
    console.log(store.getState());
})
lcu.start()
