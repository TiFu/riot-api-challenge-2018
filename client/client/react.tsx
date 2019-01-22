import * as React from "react";
import * as ReactDOM from "react-dom";
import { LCUService } from './services/LCUService';
import { LCUUpdateHandler } from './eventHandlers/LCUUpdateHandler';
import { AchievementSocketIOService } from './services/AchievementSIOService';
import eventBus from './store/events';
import MainComponent from "./components/MainComponent";
import {Provider} from 'react-redux'
import configureStores from './store/index';

console.log("Running react!")
const store = configureStores()

const lcu = new LCUService();
const sioService = new AchievementSocketIOService(store, "http://localhost:" + 80, eventBus);
const lcuListener = new LCUUpdateHandler(lcu, store, sioService);

lcu.setListener(lcuListener)
lcu.start()

const root = document.getElementById('app');
ReactDOM.render(
        <Provider store={store}>
    		<MainComponent />
        </Provider>,
	root
);