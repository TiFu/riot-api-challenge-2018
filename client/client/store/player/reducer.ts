import { Reducer } from 'redux'
import { PlayerState, PlayerActions,PlayerStateUpdatedAction, PlayerAchievementEntry } from './types';
import { Achievement, PlayerData, GroupInviteRequest, AchievementNotification } from 'achievement-sio';

export const initialState: PlayerState = {
    playerInfo: {
        "accountId": 23456,
        "platformId": "euw1",
        "playerName": "TiFu"
    },
    "invites": [
        {
            "groupId": 10,
            "groupName": "10th Division",
            "inviteId": 11,
            "inviter": {
                "accountId": 12345,
                "name": "Leader 11",
                "region": "euw1"
            },
            "status": "pending"
        },
        {
            "groupId": 15,
            "groupName": "15th Division",
            "inviteId": 12,
            "inviter": {
                "accountId": 12345,
                "name": "Leader 15",
                "region": "euw1"
            },
            "status": "pending"
        }
    ],
    groups: [
        {
            id: 5,
            name: "Test 1",
            members: [{
                "accountId": 23456,
                "name": "TiFu",
                "region": "euw1"
            }],
            achievements: [
                {
                    achievedAt: (new Date()).toString(),
                    achievementId: 2,
                    championId: 25
                },
                {
                    achievedAt: (new Date()).toString(),
                    achievementId: 3,
                    championId: 18
                }
            ]
        },
        {
            id: 6,
            name: "Test 2",
            members: [{
                "accountId": 23456,
                "name": "TiFu",
                "region": "euw1"
            }],
            achievements: [
                {
                    achievedAt: (new Date()).toString(),
                    achievementId: 2,
                    championId: 1
                }
            ]
        }
    ]
}

const reducer: Reducer<PlayerState> = (state: PlayerState = initialState, action) => {
    // We'll augment the action type on the switch case to make sure we have
    // all the cases handled.
    switch ((action as PlayerActions).type) {
        case '@@player/PLAYER_STATE_UPDATED':
            return Object.assign({}, state, {playerInfo: (action as PlayerStateUpdatedAction).payload});
        case '@@player/PLAYER_ACHIEVEMENTS_UPDATED': 
            return handlePlayerAchievementsUpdated(state, action.payload)
        case '@@player/GROUP_ACHIEVEMENTS_UPDATED': 
            return handleGroupAchievementsUpdated(state, action.payload)
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
  
function handlePlayerAchievementsUpdated(state: PlayerState, achievements: AchievementNotification): PlayerState {
    if (state.playerInfo.accountId != achievements.acquirer) {
        console.error("Received achievement with wrong player?");
        return state;
    } else {
        const newAchievements = getPlayerAchievementsFromAchievementNotification(achievements);
        state.playerAchievements.forEach(a => newAchievements.push(a));
        return Object.assign({}, state, { playerAchievements: newAchievements }  as Partial<PlayerState>)
    
    }
}

function handleGroupAchievementsUpdated(state: PlayerState, achievements: AchievementNotification): PlayerState {
    const groupIndex = state.groups.findIndex(g => g.id == achievements.acquirer);
    const slice = state.groups.slice();
    const newAchievements = getFromAchievementNotification(achievements);
    state.groups[groupIndex].achievements.forEach(a => newAchievements.push(a));
    slice[groupIndex] = {
        id: state.groups[groupIndex].id,
        name: state.groups[groupIndex].name,
        members: state.groups[groupIndex].members,
        achievements: newAchievements
    }

    return Object.assign({}, state, { groups: slice } as Partial<PlayerState>);
}

function getPlayerAchievementsFromAchievementNotification(achievements: AchievementNotification): PlayerAchievementEntry[] {
    return achievements.achievement_ids.map(a => {
        return {
            "achievementId": a,
            "achievedAt": achievements.achievedAt,
            "champId": achievements.championId,
            "skinId": achievements.skinId
        } as PlayerAchievementEntry
    });
}

function getFromAchievementNotification(achievements: AchievementNotification): Achievement[] {
    return achievements.achievement_ids.map(a => {
        return {
            achievementId: a,
            championId: achievements.championId,
            skinId: achievements.skinId,
            achievedAt: achievements.achievedAt.toString()
        }
    })
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

