import { LCUConnectionStateUpdatedAction, FrontendConnectionStateUpdatedAction } from './types';
import { ActionCreator } from 'redux';

export const updateLCUConnectedState: ActionCreator<LCUConnectionStateUpdatedAction> = (playerState: boolean) => {
    return {
        type: '@@lcu/LCU_CONNECTION_STATE_UPDATED',
        payload: playerState
    }
}

export const updateFrontendConnectedState: ActionCreator<FrontendConnectionStateUpdatedAction> = (playerState: boolean) => {
    return {
        type: '@@lcu/FRONTEND_CONNECTION_STATE_UPDATED',
        payload: playerState
    }
}
