import {slot, Slot, createEventBus, GenericChannel, combineEvents, TransportMessage} from 'ts-event-bus'
import { PlayerInfo, GameData } from './player/types';
import { AchievementStore, AllActions } from './index';
import { AnyAction } from 'redux';

const AchievementEvents = {
    "lcu_connection_update": slot<boolean, void>(),
    "frontend_connection_update": slot<boolean, void>(),
    "player_info_update": slot<PlayerInfo, void>(),
    "end_of_game": slot<GameData, void>()
}

export type AchievementEventBus = {
    "lcu_connection_update": Slot<boolean, void>,
    "frontend_connection_update": Slot<boolean, void>,
    "player_info_update": Slot<PlayerInfo, void>,
    "end_of_game": Slot<GameData, void>
}

const eventBus = createEventBus( {
    events: AchievementEvents
})

export const eventBusMiddleware = (store: AchievementStore)  => (next: (action: AnyAction) => any) => (action: AnyAction) => {
    const result = next(action);
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
    }
    return result;
}

export default eventBus