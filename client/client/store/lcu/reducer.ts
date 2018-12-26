import { Reducer } from 'redux'
import { LCUState, LCUConnectionStateUpdatedAction, LCUActions, FrontendConnectionStateUpdatedAction } from './types';

export const initialState: LCUState = {
    connectedToLcu: false,
    connectedToFrontend: false
}

const reducer: Reducer<LCUState> = (state: LCUState = initialState, action) => {
    // We'll augment the action type on the switch case to make sure we have
    // all the cases handled.
    switch ((action as LCUActions).type) {
        case '@@lcu/LCU_CONNECTION_STATE_UPDATED':
            return Object.assign({}, state, {connectedToLcu: (action as LCUConnectionStateUpdatedAction).payload});
        case '@@lcu/FRONTEND_CONNECTION_STATE_UPDATED':
            return Object.assign({}, state, {connectedToFrontend: (action as FrontendConnectionStateUpdatedAction).payload})
        default:
            return state;
    }
  };
  
  export default reducer;

