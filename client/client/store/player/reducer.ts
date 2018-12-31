import { Reducer } from 'redux'
import { PlayerState, PlayerActions,PlayerStateUpdatedAction } from './types';
import {Achievement} from 'achievement-sio'
import { achievementMap } from 'achievement-models'

export const initialState: PlayerState = {
    playerInfo: null
}

const reducer: Reducer<PlayerState> = (state: PlayerState = initialState, action) => {
    // We'll augment the action type on the switch case to make sure we have
    // all the cases handled.
    switch ((action as PlayerActions).type) {
        case '@@player/PLAYER_STATE_UPDATED':
            return Object.assign({}, state, {playerInfo: (action as PlayerStateUpdatedAction).payload});
        case '@@player/ACHIEVEMENTS_UPDATED': 
            return handleAchievementsUpdated(state, action.payload)
        default:
            return state;
    }
  };
  
function handleAchievementsUpdated(state: PlayerState, achievements: Achievement[]) {
    const mappedAchievements = achievements.map((a) => {
        return {
        "achievedAt": a.achievedAt,
        "achievement": achievementMap[a.achievementId]
        }
    });
    console.log("Mapped Achievements", mappedAchievements)
    return Object.assign({}, state, { playerAchievements: mappedAchievements})
}

  export default reducer;

