import {combineReducers, Dispatch, Reducer, Store, createStore, applyMiddleware} from 'redux';

import { PlayerState, PlayerActions } from './player/types';
import playerReducer from './player/reducer';
import lcuReducer from './lcu/reducer'
import { LCUState, LCUActions } from './lcu/types';
import { eventBusMiddleware } from './events';

export interface AchievementState {
    lcu: LCUState
    player: PlayerState
}

const reducers: Reducer<AchievementState> = combineReducers<AchievementState>( {
    lcu: lcuReducer,
    player: playerReducer
}) 

export type AllActions = LCUActions | PlayerActions

export type AchievementStore = Store<AchievementState>
export default function configureStores(): Store<AchievementState> {
    return createStore(
        reducers,
        applyMiddleware(eventBusMiddleware)
    )
}