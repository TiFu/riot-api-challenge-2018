import { AchievementDB } from '../../server/achievement-db/index';
import { ServerDefinition, SimpleNamespace,
    RootServer, ClientSideSocket, ServerSideClientSocketNS, internal } from "typed-socket.io";

// Client Messages
export type SearchPlayerMessage = {
    searchString: string
}
export type SearchPlayerError = string

export type PlayerId = number

export type PublicPlayerData = {
    playerId: PlayerId
    playerName: string,
    achievements: Array<Achievement>
}

export type HelloMessage = {
    playerName: string,
    account_id: string,
    region: string
}

export type NewGameMessage = {
    game: any
    timeline: any
}

export type Achievement = {
    achievement_id: string,
    achievement_level: number,
    timestamp: number
}

// Server Messages
export type AchievementNotification = {
    achievement_id: string,
    achievement_level: number,
    acquirer: PlayerPartialInfo | GroupId,
    acquirer_type: "USER" | "GROUP",
    timestamp: number
}

export type PlayerData = {
    playerName: string
    achievements: Array<Achievement>
    groups: Array<GroupPartialInfo>
    invites: Array<GroupInvite>
}

export type PlayerPartialInfo = {
    name: string
}

export type GroupPartialInfo = {
    id: GroupId,
    name: GroupName,
    members: PlayerPartialInfo[]
}
// GROUPS
export type GroupInvite = {
    groupId: GroupId
    inviter: PlayerPartialInfo
}

export type GroupInviteRequest = {
    group: GroupPartialInfo,
    inviter: PlayerPartialInfo
}

export type GroupInviteResponse = {
    groupId: GroupId
    accept: boolean
}
export type Player = string

export type CreateGroup = {
    name: string
}

export type Group = {
    name: string
    players: Player[]
    achievements: Achievement[]
}

export type GroupName = string
export type GroupId = number

type WebNamespace = SimpleNamespace<{
    ServerMessages: {
        achievementNotification: AchievementNotification
    },
    ClientRPCs: {
        searchPlayer: {
            request: SearchPlayerMessage,
            response: PublicPlayerData,
            error: SearchPlayerError
        }
    },
    ClientMessages: {
        leavePlayer: PlayerId
    }
}>

type LocalClientNamespace = SimpleNamespace<{
    ServerMessages: {
        achievementNotification: AchievementNotification
        groupInvite: GroupInvite
    }
    ClientRPCs: {
        searchPlayer: {
            request: SearchPlayerMessage,
            response: PublicPlayerData, // TODO: add possiblity to display list of players
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
            request: GroupInviteRequest,
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
