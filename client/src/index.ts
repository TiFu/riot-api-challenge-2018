import { LCUService } from './services/LCUService';
import eventBus from './events'
import { LCUUpdateHandler } from './eventHandlers/LCUUpdateHandler';

const lcu = new LCUService(eventBus);
const updateHandler = new LCUUpdateHandler(eventBus, lcu);
const localState = new LocalState(eventBus);
lcu.start()

