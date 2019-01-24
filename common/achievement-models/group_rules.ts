import { GroupRule, PlayerRule } from './models';
import { MatchV4MatchDto, MatchV4MatchTimelineDto, MatchV4MatchEventDto, MatchV4ParticipantDto } from 'kayn/typings/dtos';
import { findParticipantBySummonerId, findParticipantsBySummonerIds } from './util';
import { TurretDestructionTimedRule } from './player_rules';


export class GroupGameModeRule extends GroupRule {

    // 450 is aram, all others are 5x5 SR Ranked Solo, Blind, Flex
    // 400 | 420 | 430 | 440 | 450
    public constructor(private queueIds: number[]) {
        super();
    }

    public verify(summonerId: string[], game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): boolean {
        return this.queueIds.indexOf(game.queueId) !== -1;
    }

}
export class GroupKillRule extends GroupRule {

    public constructor() {
        super();
    }

    public verify(accountIds: string[], game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): boolean {
        console.log("Verifying kill rule!")
        return true;
    }
}


export class AllMemberKillRule extends GroupRule {
    public constructor(private timeLimitInMs: number) {
        super();
    }

    private handleEvent(event: MatchV4MatchEventDto, participants: MatchV4ParticipantDto[]): boolean {
        if (event.type == "CHAMPION_KILL" && event.timestamp < this.timeLimitInMs) {
            const involvedParticipants = new Set<number>();
            involvedParticipants.add(event.killerId);
            if (event.assistingParticipantIds) {
                for (let participant of event.assistingParticipantIds) {
                    involvedParticipants.add(participant);
                }
            }

            if (participants.every(a => involvedParticipants.has(a.participantId))) {
                return true;
            }
        }
        return false;
    }

    public verify(accountIds: string[], game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): boolean {
        const participants = findParticipantsBySummonerIds(accountIds, game);
        if (participants.some(p => p == null)) {
            return false;
        }

        for (const frame of timeline.frames) {
            for (const event of frame.events) {
                if (this.handleEvent(event, participants)) {
                    return true;
                }
            }
        }
        return false;
    }
}

export class FlashLessRule extends GroupRule {
    public constructor(private maxNumberOfFlashes: number) {
        super();
    }

    public verify(accountIds: string[], game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): boolean {
        const participants = findParticipantsBySummonerIds(accountIds, game);
        if (participants.some(p => p == null)) {
            return false;
        }

        let flashCount = 0;
        for (let participant of participants) {
            if (participant.spell1Id == 4 || participant.spell2Id == 4) {
                flashCount += 1;
            }
        }
        return flashCount <= this.maxNumberOfFlashes;
    }
}


export class MultiKillRule extends GroupRule {
    private killTimeout = 10000;
    private pentaKillTimeout = 30000;

    public constructor(private numberOfKillStreaks: number, private numberOfKillsInRow: number) {
        super();
    }

    private getKillStreaksForOnePlayer(participant: MatchV4ParticipantDto, game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): number {
        let killCounter = 0;
        let lastKillTimestamp = 0;
        let killStreaks = 0;

        for (const frame of timeline.frames) {
            for (const event of frame.events) {
                if (event.type == "CHAMPION_KILL" && event.killerId == participant.participantId) {
                    // Reset after 45
                    const timeout = killCounter == 4 ? this.pentaKillTimeout : this.killTimeout
                    if (event.timestamp - lastKillTimestamp > timeout) {
                        killCounter = 0;
                    }
                    killCounter += 1;
                    lastKillTimestamp = event.timestamp;

                    if (killCounter > this.numberOfKillsInRow) {
                        killCounter = 0
                        killStreaks += 1;
                    }
                }
            }
        }

        return killStreaks;
        
    }
    public verify(accountIds: string[], game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): boolean {
        const participants = findParticipantsBySummonerIds(accountIds, game);
        if (participants.some(p => p == null)) {
            return false;
        }

        let streakCount = 0;
        for (let participant of participants) {
            streakCount += this.getKillStreaksForOnePlayer(participant, game, timeline);
        }
        return streakCount >= this.numberOfKillStreaks;
    }
}

export class AllMarksmanRule extends GroupRule {
    private allowedChamps = new Set<number>([
        22,
        268,
        51,
        42,
        119,
        81,
        104,
        126,
        202,
        222,
        145,
        429,
        85,
        203,
        96,
        236,
        21,
        133,
        15,
        17,
        18,
        29,
        6,
        110,
        67,
        498
    ])

    public constructor(private champCountRequired: number) {
        super();
    }

    public verify(accountIds: string[], game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): boolean {
        const participants = findParticipantsBySummonerIds(accountIds, game);
        if (participants.some(p => p == null)) {
            return false;
        }

        let champCount = 0;
        for (let participant of participants) {
            if (this.allowedChamps.has(participant.championId)) {
                champCount += 1;
            }
        }
        return champCount >= this.champCountRequired;

    }
}


export class NoWardsBuyRule extends GroupRule {

    public constructor() {
        super();
    }

    public verify(accountIds: string[], game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): boolean {
        const participants = findParticipantsBySummonerIds(accountIds, game);
        if (participants.some(p => p == null)) {
            return false;
        }

        const idSet = new Set(participants.map(p => p.participantId));
        for (const frame of timeline.frames) {
            for (const event of frame.events) {
                if (event.type == "ITEM_PURCHASED" && event.itemId == 2055 && idSet.has(event.participantId)) {
                    return false;
                }
            }
        }
        return true;
    }
}

export class NoWardsPlaceRule extends GroupRule {

    public constructor() {
        super();
    }

    public verify(accountIds: string[], game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): boolean {
        const participants = findParticipantsBySummonerIds(accountIds, game);
        if (participants.some(p => p == null)) {
            return false;
        }

        const idSet = new Set(participants.map(p => p.participantId));
        for (const frame of timeline.frames) {
            for (const event of frame.events) {
                if (event.type == "WARD_PLACED" && idSet.has(event.creatorId)) {
                    return false;
                }
            }
        }
        return true;
    }
}

export class LowVisionScoreRule extends GroupRule {
    public constructor(private visionScoreLimit: number) {
        super();
    }

    public verify(accountIds: string[], game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): boolean {
        const participants = findParticipantsBySummonerIds(accountIds, game);
        if (participants.some(p => p == null)) {
            return false;
        }


        let teamVisionScore = 0;
        for (let participant of participants) {
            teamVisionScore += participant.stats.visionScore;
        }
        return teamVisionScore <= this.visionScoreLimit;        
    }
}

export class PerfectGame extends GroupRule {
    public constructor(private noEpicMonstersLost: boolean, private noTurretsLost: boolean, private noDeaths: boolean) {
        super();
    }
    private checkNoTurretsLost(participants: Set<number>, timeline: MatchV4MatchTimelineDto): boolean {
        for (const frame of timeline.frames) {
            for (const event of frame.events) {
                if (event.type == "BUILDING_KILL" && event.buildingType == "TOWER_BUILDING" && !participants.has(event.killerId)) {
                    return false;
                }
            }
        }
        return true;
    }

    private checkNoEpicMonstersLost(participants: Set<number>, timeline: MatchV4MatchTimelineDto): boolean {
        for (const frame of timeline.frames) {
            for (const event of frame.events) {
                if (event.type == "ELITE_MONSTER_KILL" && !participants.has(event.killerId)) {
                    return false;
                }
            }
        }
        return true;
    }

    private checkNoDeaths(participants: MatchV4ParticipantDto[]): boolean {
        return participants.every(p => p.stats.deaths == 0)
    }

    public verify(accountIds: string[], game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): boolean {
        const participants = findParticipantsBySummonerIds(accountIds, game);
        if (participants.some(p => p == null)) {
            return false;
        }

        const idSet = new Set(participants.map(p => p.participantId));

        if (this.noEpicMonstersLost && !this.checkNoEpicMonstersLost(idSet, timeline)) {
            return false;
        }

        if (this.noTurretsLost && !this.checkNoTurretsLost(idSet, timeline)) {
            return false;
        }

        if (this.noDeaths && !this.checkNoDeaths(participants)) {
            return false;
        }

        return true;
    }
}