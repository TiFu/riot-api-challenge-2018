import { Reducer } from 'redux'
import { PlayerState, PlayerActions,PlayerStateUpdatedAction, PlayerAchievementEntry } from './types';
import {Achievement, PlayerData, GroupInviteRequest} from 'achievement-sio'

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
        case '@@player/PLAYER_DATA_UPDATED':
            return handlePlayerDataUpdated(state, action.payload);
        case '@@player/GROUP_INVITE_RECEIVED':
            return handleGroupInviteReceived(state, action.payload);
        case '@@player/GROUP_INVITE_UPDATE':
            return handleGroupInviteUpdate(state, action.payload);
        default:
            return state;
    }
  };

function handleGroupInviteUpdate(state: PlayerState, data: GroupInviteRequest) {
    const invite = state.invites.find((e) => e.inviteId == data.inviteId)
    if (invite && invite.status != "pending") {
        const newInvites = state.invites.slice().filter(f => f.inviteId != data.inviteId);
        return Object.assign({}, state, { "invites": newInvites} as Partial<PlayerState>);
    }
    data.inviteId
    return state;
}

function handleGroupInviteReceived(state: PlayerState, data: GroupInviteRequest) {
    const old = state.invites.slice()
    old.push(data)
    return Object.assign({}, state, { invites: old} as Partial<PlayerState>)
}

function handlePlayerDataUpdated(state: PlayerState, data: PlayerData): PlayerState {
    const mappedAchievements = mapAchievements(data.achievements);
    let newState = Object.assign({}, state, { playerAchievements: mappedAchievements, invites: data.invites, groups: data.groups} as Partial<PlayerState>)
    return newState
}
  
function handleAchievementsUpdated(state: PlayerState, achievements: Achievement[]): PlayerState {
    const mappedAchievements = mapAchievements(achievements);
    console.log("Mapped Achievements", mappedAchievements)
    return Object.assign({}, state, { playerAchievements: mappedAchievements}  as Partial<PlayerState>)
}

function mapAchievements(achievements: Achievement[]): PlayerAchievementEntry[] {
    return achievements.map((a) => {
        return {
        "achievedAt": new Date(Date.parse(a.achievedAt)),
        "achievementId": a.achievementId,
        "champId": a.championId,
        "skinId": a.skinId
        } as PlayerAchievementEntry
    });
}
  export default reducer;

