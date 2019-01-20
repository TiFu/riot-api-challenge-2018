import { ComponentState, ShowAchievementOverviewAction} from './types';
import { ActionCreator } from 'redux';

export const showAchievementOverview = (show: boolean) => {
    return {
        type: '@@component/SHOW_ACHIEVEMENT_OVERVIEW',
        payload: show
    } as ShowAchievementOverviewAction
}