import { LCUService } from './services/LCUService';
import { LCUUpdateHandler } from './eventHandlers/LCUUpdateHandler';
import configureStore from './store/index';
import { updateLCUConnectedState, updateChampSelect } from './store/lcu/actions';
import { AchievementSocketIOService } from './services/AchievementSIOService';
import eventBus from './store/events';
import { endOfGameDetected, updatePlayerInfo } from './store/player/actions';

const store = configureStore();

const sioService = new AchievementSocketIOService(store, "http://localhost:" + 3000, eventBus);

store.subscribe(() => {
    console.log(store.getState());
})

const socket = sioService._getSocket();
socket.emit("hello", {
    "accountId": 555,
    "platformId": "euw1",
    "playerName": "Test1"
})

/*socket.emit("groupInviteRepsonse", {
    inviteId: 1,
    accept: false
}, (err, data) => {
    console.log("Invite declined ", err, data);
})*/
socket.on("groupInvite", (info) => {
    console.log(info);
    /*socket.emit("groupInviteRepsonse", {
        inviteId: info.inviteId,
        accept: true
    }, (err, data) => {
        console.log("Invite declined", err, data);
    })*/
})