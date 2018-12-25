import {combineReducers, Dispatch, Reducer, Store, createStore} from 'redux';

import { PlayerState } from './player/types';
import playerReducer from './player/reducer';
import lcuReducer from './lcu/reducer'
import { LCUState } from './lcu/types';

export interface AchievementState {
    lcu: LCUState
    player: PlayerState
}

const reducers: Reducer<AchievementState> = combineReducers<AchievementState>( {
    lcu: lcuReducer,
    player: playerReducer
}) 

export type AchievementStore = Store<AchievementState>
export default function configureStores(): Store<AchievementState> {
    return createStore(
        reducers
    )
}