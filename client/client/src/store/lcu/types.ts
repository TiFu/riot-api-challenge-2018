import {Action} from 'redux'

export interface LCUState {
    connectedToLcu: boolean
    connectedToFrontend: boolean,
    champselect: {
        champId?: number
        skinId?: number
    }
}


export interface LCUConnectionStateUpdatedAction extends Action {
    type: '@@lcu/LCU_CONNECTION_STATE_UPDATED'
    payload: boolean
}

export interface FrontendConnectionStateUpdatedAction extends Action {
    type: '@@lcu/FRONTEND_CONNECTION_STATE_UPDATED'
    payload: boolean
}

export interface UpdateChampSelectAction extends Action {
    type: '@@lcu/UPDATE_SELECTED_CHAMP_ACTION'
    payload: {
        champId: number,
        skinId: number
    }
}


export type LCUActions = LCUConnectionStateUpdatedAction | FrontendConnectionStateUpdatedAction | UpdateChampSelectAction; // use union type here