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

socket.on("inviteUpdate", (update) =>{ 
    console.log("Invite update", update);

})

socket.emit("hello", {
    "accountId": 556,
    "platformId": "euw1",
    "playerName": "Test2"
})    
socket.on("playerData", (_) => {
    socket.emit("createGroup", { name:"test group" }, (response, data) => {
        console.log("Group Created", response, data);
        if (!response) {
            socket.emit("groupInviteRequest", {
                "group": data.id,
                "invitee": {
                    "accountId": 555,
                    "region": "euw1",
                    "name": "Test1"
                }
            }, (result, newData) => {
                console.log("Invite sent ", result, newData);
                socket.emit("fetchGroup", data.id, (err, data) => {
                    console.log("Received group: ", err, data);
                })
            } )
        }
    })    
})

