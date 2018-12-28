import {Action} from 'redux'

export interface LCUState {
    connectedToLcu: boolean
    connectedToFrontend: boolean
}


export interface LCUConnectionStateUpdatedAction extends Action {
    type: '@@lcu/LCU_CONNECTION_STATE_UPDATED'
    payload: boolean
}

export interface FrontendConnectionStateUpdatedAction extends Action {
    type: '@@lcu/FRONTEND_CONNECTION_STATE_UPDATED'
    payload: boolean
}

export type LCUActions = LCUConnectionStateUpdatedAction | FrontendConnectionStateUpdatedAction; // use union type here