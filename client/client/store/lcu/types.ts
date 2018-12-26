import {Action} from 'redux'

export interface LCUState {
    connected: boolean   
}


export interface LCUConnectionStateUpdatedAction extends Action {
    type: '@@lcu/LCU_CONNECTION_STATE_UPDATED'
    payload: boolean
}

export type LCUActions = LCUConnectionStateUpdatedAction; // use union type here