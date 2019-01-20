import {Action} from 'redux'

export interface ComponentState {
    showAchievementOverviewAction: boolean;
}

export interface ShowAchievementOverviewAction {
    type: '@@component/SHOW_ACHIEVEMENT_OVERVIEW'
    payload: boolean
}

export type ComponentStateActions = ShowAchievementOverviewAction