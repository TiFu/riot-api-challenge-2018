import { Reducer } from 'redux'
import { LCUState, LCUConnectionStateUpdatedAction, LCUActions, FrontendConnectionStateUpdatedAction } from './types';

export const initialState: LCUState = {
    connectedToLcu: false,
    connectedToFrontend: false,
    champselect: {
        champId: null,
        skinId: null
    }
}

const reducer: Reducer<LCUState> = (state: LCUState = initialState, action) => {
    // We'll augment the action type on the switch case to make sure we have
    // all the cases handled.
    switch ((action as LCUActions).type) {
        case '@@lcu/LCU_CONNECTION_STATE_UPDATED':
            return Object.assign({}, state, {connectedToLcu: (action as LCUConnectionStateUpdatedAction).payload});
        case '@@lcu/FRONTEND_CONNECTION_STATE_UPDATED':
            return Object.assign({}, state, {connectedToFrontend: (action as FrontendConnectionStateUpdatedAction).payload})
        case '@@lcu/UPDATE_SELECTED_CHAMP_ACTION':
            return Object.assign({}, state, { champselect: { champId: action.payload.champId, skinId: action.payload.skinId}})
        default:
            return state;
    }
  };
  
  export default reducer;

