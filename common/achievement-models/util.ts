import { MatchV4MatchDto, MatchV4ParticipantDto, MatchV4MatchEventDto } from "kayn/typings/dtos";

export function findParticipantBySummonerId(summonerId: string, game: MatchV4MatchDto): MatchV4ParticipantDto {
    for (const identity of game.participantIdentities) {
        if (identity.player.summonerId == summonerId) {
            return findParticipantByParticipantId(identity.participantId, game);
        }        
    }
    return null;
}

export function findParticipantByParticipantId(id: number, game: MatchV4MatchDto): MatchV4ParticipantDto {
    for (const identity of game.participants) {
        if (identity.participantId == id) {
            return identity;
        }
    }
    return null;
}

export function findLaneOpponent(laner: MatchV4ParticipantDto, game: MatchV4MatchDto) {
    const lane = laner.timeline.lane
    const team = laner.teamId;

    for (const participant of game.participants) {
        if (participant.teamId == team && participant.timeline.lane == lane) {
            return participant
        }
    }
    return null;
}

export function lanerWasInvolved(event: MatchV4MatchEventDto, participant: MatchV4ParticipantDto): boolean {
    return event.killerId == participant.participantId || (event.assistingParticipantIds && event.assistingParticipantIds.indexOf(participant.participantId) !== -1)
}

export type Point = { 
    x: number,
    y: number
}

export function isLeftOf(a: Point, b: Point, c: Point) {
    return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x) >= 0;
}

function transformPoint(a: Point) {
    return { 
        x: 14820 * (a.x - (-120)) / (14870 - (-120)),
        y: 14881 * (a.y - (-120)) / (14980 - (-120))
    }
}

const redSideRiverA = transformPoint({x: 3000, y: 12500});
const redSideRiverB = transformPoint({x: 12800, y: 3000});
const redsideBaseA = transformPoint({x: 9000, y: 13000});
const redsideBaseB = transformPoint({x: 13000, y:9000});

const blueSideRiverA = transformPoint({x: 2000, y: 11500});
const blueSideRiverB = transformPoint({x: 12000, y: 2000});
const blueSideBaseA = transformPoint({x: 1800, y: 5800});
const blueSideBaseB = transformPoint({x: 5700, y: 1700});

export function wasInRedSideJungle(a: Point): boolean {
    return isLeftOf(redSideRiverA, redSideRiverB, a) && !isLeftOf(redsideBaseA, redsideBaseB, a);
}

export function wasInBlueSideJungle(a: Point): boolean {
    return !isLeftOf(blueSideRiverA, blueSideRiverB, a) && isLeftOf(blueSideBaseA, blueSideBaseB, a);
}