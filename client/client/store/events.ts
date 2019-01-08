import {slot, Slot, createEventBus, GenericChannel, combineEvents, TransportMessage} from 'ts-event-bus'
import { PlayerInfo, GameData } from './player/types';
import { AchievementStore, AllActions } from './index';
import { AnyAction } from 'redux';
import { NewGameMessage, AchievementNotification, GroupInviteRequest, GroupInviteUpdate } from 'achievement-sio';

const AchievementEvents = {
    "lcu_connection_update": slot<boolean, void>(),
    "frontend_connection_update": slot<boolean, void>(),
    "player_info_update": slot<PlayerInfo, void>(),
    "end_of_game": slot<NewGameMessage, void>(),
    "new_achievements": slot<AchievementNotification, void>(),
    "new_group_invite": slot<GroupInviteRequest, void>(),
    "group_invite_update": slot<GroupInviteUpdate, void>()
}

export type AchievementEventBus = {
    "lcu_connection_update": Slot<boolean, void>,
    "frontend_connection_update": Slot<boolean, void>,
    "player_info_update": Slot<PlayerInfo, void>,
    "end_of_game": Slot<NewGameMessage, void>,
    "new_achievements": Slot<AchievementNotification, void>,
    "new_group_invite": Slot<GroupInviteRequest, void>,
    "group_invite_update": Slot<GroupInviteUpdate, void>
}

const eventBus = createEventBus( {
    events: AchievementEvents
})

export const eventBusMiddleware = (store: AchievementStore)  => (next: (action: AnyAction) => any) => (action: AnyAction) => {
    const result = next(action);
    console.log("ACTION", action);
    console.log("State after action", JSON.stringify(store.getState()))
    switch ((action as AllActions).type) {
        case '@@lcu/LCU_CONNECTION_STATE_UPDATED':
            eventBus.lcu_connection_update(action.payload)
        break;
        case '@@player/PLAYER_STATE_UPDATED':
            eventBus.player_info_update(action.payload);
        break;
        case '@@lcu/FRONTEND_CONNECTION_STATE_UPDATED':
            eventBus.frontend_connection_update(action.payload);
        break;
        case '@@player/END_OF_GAME':
            console.log("emitting end of game in event bus middleware", action.payload);
            eventBus.end_of_game(action.payload)
        break;
        case '@@player/ACHIEVEMENTS_UPDATED':
            eventBus.new_achievements(action.payload);
        case '@@player/GROUP_INVITE_RECEIVED':
            eventBus.new_group_invite(action.payload);
        case '@@player/GROUP_INVITE_UPDATE':
            eventBus.group_invite_update(action.payload);
        break;
    }
    return result;
}

export default eventBus