import { Reducer } from 'redux'
import { PlayerState, PlayerActions, PlayerStateUpdatedAction, PlayerAchievementEntry, GroupInviteChangeResult } from './types';
import { Achievement, PlayerData, GroupInviteRequest, AchievementNotification, Group } from 'achievement-sio';
import { GroupPartialInfo } from 'achievement-sio';

export const initialState: PlayerState = {
    playerInfo: {
        "accountId": 23456,
        "platformId": "euw1",
        "playerName": "TiFu"
    },
    "playerAchievements": [
        {
            "achievedAt": new Date(),
            "achievementId": 100,
            "champId": 1,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 101,
            "champId": 1,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 110,
            "champId": 1,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 111,
            "champId": 1,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 112,
            "champId": 1,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 120,
            "champId": 107,
            "skinId": 107003
        },
        {
            "achievedAt": new Date(),
            "achievementId": 140,
            "champId": 1,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 141,
            "champId": 7,
            "skinId": 7003
        },
        {
            "achievedAt": new Date(),
            "achievementId": 150,
            "champId": 25,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 151,
            "champId": 25,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 152,
            "champId": 25,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 200,
            "champId": 1,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 201,
            "champId": 1,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 202,
            "champId": 84,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 210,
            "champId": 1,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 211,
            "champId": 1,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 212,
            "champId": 84,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 220,
            "champId": 22,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 221,
            "champId": 1,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 222,
            "champId": 420,
            "skinId": 420003
        },
        {
            "achievedAt": new Date(),
            "achievementId": 230,
            "champId": 18,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 231,
            "champId": 18,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 232,
            "champId": 75,
            "skinId": 75003
        },
        {
            "achievedAt": new Date(),
            "achievementId": 240,
            "champId": 1,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 241,
            "champId": 1,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 242,
            "champId": 420,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 250,
            "champId": 1,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 251,
            "champId": 1,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 252,
            "champId": 75,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 300,
            "champId": 1,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 301,
            "champId": 106,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 310,
            "champId": 1,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 311,
            "champId": 1,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 312,
            "champId": 72,
            "skinId": 72002
        },
        {
            "achievedAt": new Date(),
            "achievementId": 320,
            "champId": 23,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 321,
            "champId": 1,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 322,
            "champId": 72,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 340,
            "champId": 1,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 341,
            "champId": 1,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 342,
            "champId": 19,
            "skinId": 19003
        },
        {
            "achievedAt": new Date(),
            "achievementId": 350,
            "champId": 1,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 351,
            "champId": 24,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 400,
            "champId": 1,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 401,
            "champId": 1,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 402,
            "champId": 45,
            "skinId": 45001
        },
        {
            "achievedAt": new Date(),
            "achievementId": 410,
            "champId": 1,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 411,
            "champId": 1,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 412,
            "champId": 1,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 420,
            "champId": 24,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 421,
            "champId": 30,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 430,
            "champId": 18,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 431,
            "champId": 18,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 432,
            "champId": 34,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 440,
            "champId": 1,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 441,
            "champId": 1,
            "skinId": 1008
        },
        {
            "achievedAt": new Date(),
            "achievementId": 450,
            "champId": 1,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 451,
            "champId": 1,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 452,
            "champId": 112,
            "skinId": 112004
        },
        {
            "achievedAt": new Date(),
            "achievementId": 500,
            "champId": 1,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 501,
            "champId": 1,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 502,
            "champId": 429,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 510,
            "champId": 1,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 511,
            "champId": 1,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 512,
            "champId": 222,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 520,
            "champId": 25,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 521,
            "champId": 1,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 522,
            "champId": 133,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 530,
            "champId": 18,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 531,
            "champId": 18,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 532,
            "champId": 222,
            "skinId": 222002
        },
        {
            "achievedAt": new Date(),
            "achievementId": 540,
            "champId": 1,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 541,
            "champId": 1,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 542,
            "champId": 21,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 550,
            "champId": 1,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 551,
            "champId": 1,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 552,
            "champId": 222,
            "skinId": 222002
        },
        {
            "achievedAt": new Date(),
            "achievementId": 600,
            "champId": 1,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 601,
            "champId": 1,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 602,
            "champId": 267,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 610,
            "champId": 1,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 611,
            "champId": 1,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 612,
            "champId": 267,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 620,
            "champId": 26,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 621,
            "champId": 1,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 622,
            "champId": 161,
            "skinId": 161003
        },
        {
            "achievedAt": new Date(),
            "achievementId": 630,
            "champId": 18,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 631,
            "champId": 18,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 632,
            "champId": 143,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 640,
            "champId": 1,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 641,
            "champId": 1,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 642,
            "champId": 40,
            "skinId": 40003
        },
        {
            "achievedAt": new Date(),
            "achievementId": 650,
            "champId": 1,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 651,
            "champId": 1,
            "skinId": 0
        },
        {
            "achievedAt": new Date(),
            "achievementId": 652,
            "champId": 40,
            "skinId": 40003
        }
        
    ],
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
            "status": "pending",
            "date": new Date()
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
            "status": "pending",
            "date": new Date()
        }
    ],
    groups: [
        {
            id: 5,
            name: "Test 1",
            members: [{
                "accountId": 23456,
                "name": "TiFu",
                "region": "euw1",
                "memberSince": (new Date()).toString()
            },
            {
                "accountId": 23456,
                "name": "TiFu",
                "region": "euw1",
                "memberSince": (new Date()).toString()
            },
            {
                "accountId": 23456,
                "name": "TiFu",
                "region": "euw1",
                "memberSince": (new Date()).toString()
            },
            {
                "accountId": 23456,
                "name": "TiFu",
                "region": "euw1",
                "memberSince": (new Date()).toString()
            },
            {
                "accountId": 23456,
                "name": "TiFu",
                "region": "euw1",
                "memberSince": (new Date()).toString()
            },
            {
                "accountId": 23456,
                "name": "TiFu",
                "region": "euw1",
                "memberSince": (new Date()).toString()
            },
            {
                "accountId": 23456,
                "name": "TiFu",
                "region": "euw1",
                "memberSince": (new Date()).toString()
            },
            {
                "accountId": 23456,
                "name": "TiFu",
                "region": "euw1",
                "memberSince": (new Date()).toString()
            },
            {
                "accountId": 23456,
                "name": "TiFu",
                "region": "euw1",
                "memberSince": (new Date()).toString()
            },{

                "accountId": 23456,
                "name": "TiFu",
                "region": "euw1",
                "memberSince": (new Date()).toString()
            }],
            achievements: [
                {
                    achievedAt: (new Date()).toString(),
                    achievementId: 700,
                    championId: 25
                },
                {
                    achievedAt: (new Date()).toString(),
                    achievementId: 701,
                    championId: 25
                },
                {
                    achievedAt: (new Date()).toString(),
                    achievementId: 702,
                    championId: 245
                },
                {
                    achievedAt: (new Date()).toString(),
                    achievementId: 710,
                    championId: 25
                },
                {
                    achievedAt: (new Date()).toString(),
                    achievementId: 720,
                    championId: 25
                },
                {
                    achievedAt: (new Date()).toString(),
                    achievementId: 721,
                    championId: 31
                }
            ]
        },
        {
            id: 6,
            name: "Test 2",
            members: [{
                "accountId": 23456,
                "name": "TiFu",
                "region": "euw1",
                "memberSince": (new Date()).toString()
            }],
            achievements: [
                {
                    achievedAt: (new Date()).toString(),
                    achievementId: 700,
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
        case '@@player/GROUP_INVITE_CHANGE':
            console.log("TRIGGERDE GROUP INVITE CHANGE")
            return state; // ignore
        case '@@player/GROUP_INVITE_CHANGE_RESULT':
            return handleGroupInviteChangeResult(state, action.payload);
        case '@@player/NEW_GROUP':
            return handleNewGroup(state, action.payload);
        default:
            return state;
    }
  };

function handleNewGroup(state: PlayerState, group: Group) {
    const groupExists = state.groups.some(g => g.id == group.id)
    const groupInfo: GroupPartialInfo = {
        "achievements": group.achievements,
        "id": group.id,
        "members": group.players,
        "name": group.name
    }

    if (groupExists) {
        const newGroups = state.groups.slice().map(g => g.id == group.id ? groupInfo : g);
        return Object.assign({}, state, { "groups": newGroups } as Partial<PlayerState>);
    } else {
        const newGroups = state.groups.slice();
        newGroups.push(groupInfo);
        return Object.assign({}, state, { "groups": newGroups} as Partial<PlayerState>)
    }
}

function handleGroupInviteChangeResult(state: PlayerState, data: GroupInviteChangeResult) {
    if (data.success) {
        const newInvites = state.invites.slice().filter(f => f.inviteId != data.inviteId);
        return Object.assign({}, state, { "invites": newInvites} as Partial<PlayerState>);
    }
    return state;
}

function handleGroupInviteUpdate(state: PlayerState, data: GroupInviteRequest) {
    const invite = state.invites.find((e) => e.inviteId == data.inviteId)
    if (invite && invite.status != "pending") {
        const newInvites = state.invites.slice().filter(f => f.inviteId != data.inviteId);
        return Object.assign({}, state, { "invites": newInvites} as Partial<PlayerState>);
    }
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

