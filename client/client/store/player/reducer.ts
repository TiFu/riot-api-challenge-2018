import { Reducer } from 'redux'
import { PlayerState, PlayerActions,PlayerStateUpdatedAction } from './types';

export const initialState: PlayerState = {
    playerInfo: null
}

const reducer: Reducer<PlayerState> = (state: PlayerState = initialState, action) => {
    // We'll augment the action type on the switch case to make sure we have
    // all the cases handled.
    switch ((action as PlayerActions).type) {
        case '@@player/PLAYER_STATE_UPDATED':
            return Object.assign({}, state, {playerInfo: (action as PlayerStateUpdatedAction).payload});
        default:
            return state;
    }
  };
  
  export default reducer;

