import { LCUConnectionStateUpdatedAction, FrontendConnectionStateUpdatedAction, UpdateChampSelectAction } from './types';
import { ActionCreator } from 'redux';

export const updateLCUConnectedState = (playerState: boolean) => {
    return {
        type: '@@lcu/LCU_CONNECTION_STATE_UPDATED',
        payload: playerState
    } as LCUConnectionStateUpdatedAction
}

export const updateFrontendConnectedState = (playerState: boolean) => {
    return {
        type: '@@lcu/FRONTEND_CONNECTION_STATE_UPDATED',
        payload: playerState
    } as FrontendConnectionStateUpdatedAction
}

export const updateChampSelect = (champId: number, skinId: number) => {
    return {
        type: '@@lcu/UPDATE_SELECTED_CHAMP_ACTION',
        payload: {
            champId: champId,
            skinId: skinId
        }
    } as UpdateChampSelectAction
}