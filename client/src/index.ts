import { LCUService } from './services/LCUService';
import { LCUUpdateHandler } from './eventHandlers/LCUUpdateHandler';
import configureStore from './store/index';
import { updateLCUConnectedState } from './store/lcu/actions';

const store = configureStore();
const lcu = new LCUService();
const lcuListener = new LCUUpdateHandler(lcu, store);
lcu.setListener(lcuListener)

store.subscribe(() => {
    console.log(store.getState());
})
lcu.start()