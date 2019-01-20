import {combineReducers, Dispatch, Reducer, Store, createStore, applyMiddleware} from 'redux';

import { PlayerState, PlayerActions } from './player/types';
import playerReducer from './player/reducer';
import lcuReducer from './lcu/reducer'
import { LCUState, LCUActions } from './lcu/types';
import { eventBusMiddleware } from './events';
import { ComponentState } from 'react';
import componentReducer from './component/reducer';

export interface AchievementState {
    lcu: LCUState
    player: PlayerState
    component: ComponentState
}

const reducers: Reducer<AchievementState> = combineReducers<AchievementState>( {
    lcu: lcuReducer,
    player: playerReducer,
    component: componentReducer
}) 

export type AllActions = LCUActions | PlayerActions

export type AchievementStore = Store<AchievementState>
export default function configureStores(): Store<AchievementState> {
    return createStore(
        reducers,
        applyMiddleware(eventBusMiddleware)
    )
}