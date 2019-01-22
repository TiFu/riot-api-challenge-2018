import { Reducer } from 'redux'
import { ComponentState, ComponentStateActions } from './types';

export const initialState: ComponentState = {
    showAchievementOverviewAction: false
}

const reducer: Reducer<ComponentState> = (state: ComponentState = initialState, action) => {
    // We'll augment the action type on the switch case to make sure we have
    // all the cases handled.
    switch ((action as ComponentStateActions).type) {
        case '@@component/SHOW_ACHIEVEMENT_OVERVIEW':
            return Object.assign({}, state, { "showAchievementOverviewAction": action.payload} as Partial<ComponentState>);
        default:
            return state;
    }
  };
  
  export default reducer;

