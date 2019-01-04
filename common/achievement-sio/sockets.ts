import { AchievementNotification, NewGameMessage } from './types/achievement';
import { PlayerId, SearchPlayerMessage, PublicPlayerData, SearchPlayerError, PlayerData, PlayerPartialInfo, OpenPlayerMessage, HelloMessage } from './types/player';
import { GroupInvite, CreateGroup, Group, GroupId, GroupInviteResponse, GroupInviteRequest, GroupInviteRequestMessage, GroupInvitationNotification } from './types/group';

import { ServerDefinition, SimpleNamespace,
    RootServer, ClientSideSocket, ServerSideClientSocketNS, internal } from "typed-socket.io";


type WebNamespace = SimpleNamespace<{
    ServerMessages: {
        achievementNotification: AchievementNotification
    },
    ClientRPCs: {
        searchPlayer: {
            request: SearchPlayerMessage,
            response: PlayerPartialInfo[],
            error: SearchPlayerError
        },
        openPlayer: {
            request: OpenPlayerMessage,
            response: PlayerData
        }
    },
    ClientMessages: {
        leavePlayer: PlayerId
    }
}>

type LocalClientNamespace = SimpleNamespace<{
    ServerMessages: {
        achievementNotification: AchievementNotification
        playerData: PlayerData
        groupInvite: GroupInvitationNotification
        inviteUpdate: { groupId: number, player: PlayerPartialInfo, newStatus: "accepted" | "canceled" | "declined" | "pending" }
        error: string
    }
    ClientRPCs: {
        leaveGroup: {
            request: GroupId,
            response: boolean,
            error: string
        }
        searchPlayer: {
            request: SearchPlayerMessage,
            response: PlayerPartialInfo[], // TODO: add possiblity to display list of players
            error: SearchPlayerError
        },
        createGroup: {
            request: CreateGroup,
            response: Group,
            error: string
        }
        fetchGroup: {
            request: GroupId,
            response: Group,
            error: string
        },
        groupInviteRepsonse: {
            request: GroupInviteResponse,
            response: boolean,
            error: string
        },
        groupInviteRequest: {
            request: GroupInviteRequestMessage,
            response: boolean,
            error: string
        }
    }
    ClientMessages: {
        hello: HelloMessage,
        newGame: NewGameMessage
    }
}>
interface AchievementServerDefinition extends ServerDefinition {
    namespaces: {
        "/web": WebNamespace
        "/local": LocalClientNamespace
    }
}

export type AchievementServer = RootServer<AchievementServerDefinition>
export type AchievementWebClient = ClientSideSocket<AchievementServerDefinition, "/web">
export type AchievementLocalClient = ClientSideSocket<AchievementServerDefinition, "/local">
export type AchievementServerWebNS = ServerSideClientSocketNS<AchievementServerDefinition, WebNamespace>
export type AchievementServerLocalNS = ServerSideClientSocketNS<AchievementServerDefinition, LocalClientNamespace>
export type AchievementServerWeb = internal.ServerNamespaceNSI<AchievementServerDefinition, WebNamespace>
export type AchievementServerLocal = internal.ServerNamespaceNSI<AchievementServerDefinition, LocalClientNamespace>



export function getPlayerRoomFromId(region: string, accountId: number): string {
        return region + "_player_" + accountId
}
export function getGroupRoom(id: number): string {
        return "group_" + id
}