import { PlayerRule } from "./models";
import { MatchV4MatchDto, MatchV4MatchTimelineDto, MatchV4MatchParticipantFrameDto, MatchV4ParticipantStatsDto, MatchV4ParticipantTimelineDto, MatchV4MatchEventDto, MatchV4ParticipantDto, MatchV4MatchReferenceDto } from "kayn/typings/dtos";
import { findParticipantBySummonerId, findLaneOpponent, lanerWasInvolved, wasInRedSideJungle, wasInBlueSideJungle, findParticipantByParticipantId } from './util';

export class GameModeRule extends PlayerRule {

    // 450 is aram, all others are 5x5 SR Ranked Solo, Blind, Flex
    // 400 | 420 | 430 | 440 | 450
    public constructor(private queueIds: number[]) {
        super();
    }

    public verify(summonerId: string, game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): boolean {
        return this.queueIds.indexOf(game.queueId) !== -1;
    }

}

class StatsRule extends PlayerRule {

    public constructor(private statName: keyof MatchV4ParticipantStatsDto, private value: number | boolean, private comparison: (stat: number | boolean, value: number | boolean) => boolean) {
        super();
    }

    public verify(summonerId: string, game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): boolean {
        const participant = findParticipantBySummonerId(summonerId, game); 
        if (participant == null) {
            return false;
        }
 
        return this.comparison(participant.stats[this.statName], this.value)
    }
}

const greaterThan = (stat: number | boolean, value: number | boolean) => stat >= value;
const lessThan = (stat: number | boolean, value: number | boolean) => stat <= value;

export class HealingRule extends StatsRule {
    public constructor(healingRequired: number) {
        super("totalHeal", healingRequired, greaterThan);
    }
}

export class CCRule extends StatsRule {
    public constructor(ccTimeRequired: number) {
        super("timeCCingOthers", ccTimeRequired, greaterThan);
    }

}
export class KillingSpreeRule extends StatsRule {

    public constructor(killingSpreeLength: number) {
        super("largestKillingSpree", killingSpreeLength, greaterThan);
    }
}

export class DamageToChampsionsRule extends StatsRule {
    public constructor(dmgToChamps: number) {
        super("totalDamageDealtToChampions", dmgToChamps, greaterThan);
    }
}

export class MostDamageToChampionsInTeamRule extends PlayerRule {
    
    public constructor() {
        super();
    }

    public verify(summonerId: string, game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): boolean {
        const laner = findParticipantBySummonerId(summonerId, game); 
        if (laner == null) {
            return false;
        }

        let maximum = Number.NEGATIVE_INFINITY;
        for (const participant of game.participants) {
            if (participant.participantId == laner.participantId || laner.teamId != participant.teamId) {
                continue;
            }

            if (participant.stats.totalDamageDealtToChampions > maximum) {
                maximum = participant.stats.totalDamageDealtToChampions
            }
        }
        return laner.stats.totalDamageDealtToChampions > maximum;
    }
}

export class LeastDamageToChampionsRule extends PlayerRule {
    
    public constructor() {
        super();
    }

    public verify(summonerId: string, game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): boolean {
        const laner = findParticipantBySummonerId(summonerId, game); 
        if (laner == null) {
            return false;
        }

        let minimum = Number.POSITIVE_INFINITY;
        for (const participant of game.participants) {
            if (participant.participantId == laner.participantId) {
                continue;
            }

            if (participant.stats.totalDamageDealtToChampions < minimum) {
                minimum = participant.stats.totalDamageDealtToChampions
            }
        }
        return laner.stats.totalDamageDealtToChampions < minimum;
    }
}

export class MostDamageTakenRule extends PlayerRule {
    public constructor() {
        super();
    }

    public verify(summonerId: string, game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): boolean {
        const laner = findParticipantBySummonerId(summonerId, game); 
        if (laner == null) {
            return false;
        }

        let maximum = Number.NEGATIVE_INFINITY;
        for (const participant of game.participants) {
            if (participant.participantId == laner.participantId) {
                continue;
            }

            if (participant.stats.totalDamageTaken > maximum) {
                maximum = participant.stats.totalDamageTaken
            }
        }
        return laner.stats.totalDamageTaken > maximum;
    }
}

export class DamageTakenRule extends StatsRule {
    public constructor(dmgToChamps: number) {
        super("totalDamageTaken", dmgToChamps, greaterThan);
    }
}

export class MinionRule extends StatsRule {
    public constructor(minionCount: number) {
        super("totalMinionsKilled", minionCount, greaterThan);
    }
}

export class GreaterThanKillRule extends StatsRule {
    public constructor(killCount: number) {
        super("kills", killCount, greaterThan);
    }

}

export class LessThanKillRule extends StatsRule {
    public constructor(killCount: number) {
        super("kills", killCount, lessThan);
    }  
}

export class GreaterThanAssistRule extends StatsRule {
    public constructor(assistCount: number) {
        super("assists", assistCount, greaterThan);
    }
}

export class LessThanDeathRule extends StatsRule {
    public constructor(deathCount: number) {
        super("deaths", deathCount, lessThan);
    }
}

export class MoreThanDeathRule extends StatsRule {
    public constructor(deathCount: number) {
        super("deaths", deathCount, greaterThan);
    }
}

export class TurretDamageRule extends StatsRule {
    public constructor(turretDamage: number) {
        super("damageDealtToTurrets", turretDamage, greaterThan);
    }
}

export class WinRule extends PlayerRule {
    private win: string;
    public constructor(win: boolean) {
        super();
        if (win) {
            this.win = "Win";
        } else {
            this.win = "Fail";
        }
    }

    public verify(summonerId: string, game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): boolean {
        const participant = findParticipantBySummonerId(summonerId, game); 
        if (participant == null) {
            return false;
        }
 
        for (const team of game.teams) {
            if (team.teamId == participant.teamId) {
                return team.win == this.win;
            }
        }
    }     
}

export class GameLengthRule extends PlayerRule {

    public constructor(private gameLengthSeconds: number) {
        super();
    }

    public verify(summonerId: string, game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): boolean {
        return game.gameDuration >= this.gameLengthSeconds;
    }
}

// 3222 Mikaels
// 3073 Tear Quickcharge
// 3153 Botrk
// 3193 Stoneplate
export class CheckItemsRule extends PlayerRule {
    public constructor(private itemIds: number[]) {
        super();
    }

    public verify(summonerId: string, game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): boolean {
        const participant = findParticipantBySummonerId(summonerId, game); 
        if (participant == null) {
            return false;
        }
 
        for (let item of this.itemIds) {
            // TS didn't like "item" + i for some reason
            const isItem0 = item == participant.stats.item0
            const isItem1 = item == participant.stats.item1
            const isItem2 = item == participant.stats.item2
            const isItem3 = item == participant.stats.item3
            const isItem4 = item == participant.stats.item4
            const isItem5 = item == participant.stats.item5
            const isItem6 = item == participant.stats.item6
            const isContained = isItem0 || isItem1 || isItem2 || isItem3 || isItem4 || isItem5 || isItem6;

            if (!isContained) {
                return false;
            }
        }
        return true;
    }
}

export type Lane = "MID" | "MIDDLE" | "TOP" | "JUNGLE" | "BOT" | "BOTTOM" | "NONE";
export type Role = "DUO" | "NONE" | "SOLO" | "DUO_CARRY" | "DUO_SUPPORT";

export class LaneRule extends PlayerRule {
    // match one of the tuples!
    public constructor(private lane: Array<[Lane, Role]>) {
        super();
    }

    public verify(summonerId: string, game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): boolean {
        const participant = findParticipantBySummonerId(summonerId, game); 
        if (participant == null) {
            return false;
        }
 
        return this.lane.some(a => participant.timeline.lane == a[0] && participant.timeline.role == a[1]);
    }
}

export class MinionTimeRule extends PlayerRule {
    public constructor(private cs: number) {
        super();
    }

    public verify(summonerId: string, game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): boolean {
        const participant = findParticipantBySummonerId(summonerId, game); 
        if (participant == null) {
            return false;
        }
 
        if (timeline.frames.length <= 10) {
            return false;
        }
        
        console.log(timeline.frames[10].participantFrames[participant.participantId])
        return timeline.frames[10].participantFrames[participant.participantId].minionsKilled >= this.cs;
    }
}

export class CSAdvantageRule extends PlayerRule {
    public constructor(private csDiff: number) {
        super();
    }

    public verify(summonerId: string, game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): boolean {
        const participant = findParticipantBySummonerId(summonerId, game); 
        if (participant == null) {
            return false;
        }
 
        return participant.timeline.csDiffPerMinDeltas["0-10"] * 10 >= this.csDiff;
    }
}

// "RIFTHERALD"
export class MonsterKillTimeCheck extends PlayerRule {

    public constructor(private eventType: string, private monsterType: string, private timeConstraintInMs: number) {
        super();
    }

    public verify(summonerId: string, game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): boolean {
        const participant = findParticipantBySummonerId(summonerId, game); 
        if (participant == null) {
            return false;
        }
 
        const participantId = participant.participantId

        for (const frame of timeline.frames) {
            for (const event of frame.events) {
                if (event.type == "ELITE_MONSTER_KILL" 
                    && event.monsterType == this.monsterType 
                    && event.killerId == participantId
                    && event.timestamp <= this.timeConstraintInMs) {
                    return true;
                }
            }
        }
        return false;
    }
}

export class SummonerSpellCheck extends PlayerRule {
    public constructor(private summonerSpellId: number) {
        super();
    }

    public verify(summonerId: string, game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): boolean {
        const participant = findParticipantBySummonerId(summonerId, game); 
        if (participant == null) {
            return false;
        }

        return participant.spell1Id == this.summonerSpellId || participant.spell2Id == this.summonerSpellId;
    }
}


export class OnlySoloKillsTop extends PlayerRule {
    public constructor(private summonerSpellId: number, private timeLimitMs: number) {
        super();
    }

    private wasInvolved(event: MatchV4MatchEventDto, participant: MatchV4ParticipantDto): boolean {
        return event.victimId == participant.participantId || event.killerId == participant.participantId || (event.assistingParticipantIds && event.assistingParticipantIds.indexOf(participant.participantId) !== -1);
    }

    private lanerOrOpponentWasInvolvedInNonSoloKill(event: MatchV4MatchEventDto, laner: MatchV4ParticipantDto, opponent: MatchV4ParticipantDto): boolean {
        if (event.type == "CHAMPION_KILL" && event.timestamp <= this.timeLimitMs) {
            const soloKill = event.assistingParticipantIds ? event.assistingParticipantIds.length == 0 : true;
            const lanerWasInvolved = this.wasInvolved(event, laner);
            const opponentWasInvolved = this.wasInvolved(event, opponent);
            if (lanerWasInvolved || opponentWasInvolved) {
                return !(soloKill && lanerWasInvolved && opponentWasInvolved);
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    public verify(summonerId: string, game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): boolean {
        const participant = findParticipantBySummonerId(summonerId, game); 
        if (participant == null) {
            return false;
        }

        const opponent = findLaneOpponent(participant, game); 
        if (opponent == null) {
            return false;
        }


        for (const frame of timeline.frames) {
            for (const event of frame.events) {
                if (this.lanerOrOpponentWasInvolvedInNonSoloKill(event, participant, opponent)) {
                    return false;
                }
            }
        }
    }

}

export class LaneKillsRule extends PlayerRule {
    public constructor(private numberOfGanks: number, private numberOfDifferentLanes: number, private timeLimitInMs: number) {
        super();
    }



    public verify(summonerId: string, game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): boolean {
        const participant = findParticipantBySummonerId(summonerId, game); 
        if (participant == null) {
            return false;
        }

        let idCache: { [key: number]: Lane} = {}

        const killedIds: number[] = [];
        const gankedLanes: Set<string> = new Set<string>();

        for (const frame of timeline.frames) {
            for (const event of frame.events) {
                // only reward succesful ganks
                if (event.type == "CHAMPION_KILL" 
                        && event.timestamp <= this.timeLimitInMs
                        && lanerWasInvolved(event, participant)) {
                    if (!idCache[event.victimId]) {
                        idCache[event.victimId] = findParticipantByParticipantId(event.victimId, game).timeline.lane;
                    }
                    if (idCache[event.victimId] != "JUNGLE") {
                        killedIds.push(event.victimId);
                        gankedLanes.add(idCache[event.victimId]);
                    }
                }
            }
        }

        return killedIds.length >= this.numberOfGanks && gankedLanes.size >= this.numberOfDifferentLanes;
    }
}

export class EpicMonsterKillRule extends PlayerRule {

    public constructor(private monsterKills: number) {
        super();
    }

    public verify(summonerId: string, game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): boolean {
        const participant = findParticipantBySummonerId(summonerId, game); 
        if (participant == null) {
            return false;
        }

        let killCounter = 0;
        for (const frame of timeline.frames) {
            for (const event of frame.events) {
                if (event.type == "ELITE_MONSTER_KILL" && event.killerId == participant.participantId) {
                    killCounter += 1;
                } 
            }
        }
        return killCounter >= this.monsterKills;
    }
}

export class CampingRule extends PlayerRule {
    public constructor(private requiredKillCount: number, private timeLimitInMs: number) {
        super();
    }
    

    public verify(summonerId: string, game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): boolean {
        const participant = findParticipantBySummonerId(summonerId, game); 
        if (participant == null) {
            return false;
        }

        let killCounter: { [key: number]: number} = {};
        for (const frame of timeline.frames) {
            for (const event of frame.events) {
                if (event.type == "ELITE_MONSTER_KILL" && event.timestamp <= this.timeLimitInMs && lanerWasInvolved(event, participant)) {
                    if (!killCounter[event.victimId]) {
                        killCounter[event.victimId] = 0;                        
                    }
                    killCounter[event.victimId] += 1;
                } 
            }
        }

        let maxGreaterKillCount = false;
        for (let element in killCounter) {
            maxGreaterKillCount = maxGreaterKillCount || killCounter[element] >= this.requiredKillCount;
        }
        return maxGreaterKillCount
    }
}


export class KillInEnemyJungleRule extends PlayerRule {

    public constructor(private requiredKillCount: number, private timeLimitInMs: number) {
        super();
    }
    

    public verify(summonerId: string, game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): boolean {
        const participant = findParticipantBySummonerId(summonerId, game); 
        if (participant == null) {
            return false;
        }

        const opponent = findLaneOpponent(participant, game); 
        if (opponent == null) {
            return false;
        }

        let killCount = 0;

        for (const frame of timeline.frames) {
            for (const event of frame.events) {
                if (event.type == "CHAMPION_KILL" && event.timestamp <= this.timeLimitInMs && lanerWasInvolved(event, participant) && event.victimId == opponent.participantId) {
                    if (participant.teamId == 100 && wasInRedSideJungle({ x: event.position.x, y: event.position.y})) {
                        killCount += 1;
                    }
                    if (participant.teamId == 200 && wasInBlueSideJungle({ x: event.position.x, y: event.position.y})) {
                        killCount += 1;
                    }
                } 
            }
        }
        return killCount >= this.requiredKillCount;
    }
}


export class OuterTurretAssistRule extends PlayerRule {

    public constructor(private requiredParticipateCount: number) {
        super();
    }
    

    public verify(summonerId: string, game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): boolean {
        const participant = findParticipantBySummonerId(summonerId, game); 
        if (participant == null) {
            return false;
        }

        let killCount = 0;

        for (const frame of timeline.frames) {
            for (const event of frame.events) {
                if (event.type == "BUILDING_KILL" 
                        && event.buildingType == "TOWER_BUILDING" 
                        && event.towerType == "OUTER_TURRET" 
                        && lanerWasInvolved(event, participant)) {
                    killCount += 1;
                }
            }
        }
        return killCount >= this.requiredParticipateCount;        
    }
}


// only one of both options is used!
export class TurretDestructionTimedRule extends PlayerRule {
    public constructor(private timeLimitInMs: number, private beforeFirstBlood: boolean) {
        super();
    }
    

    public verify(summonerId: string, game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): boolean {
        const participant = findParticipantBySummonerId(summonerId, game); 
        if (participant == null) {
            return false;
        }

        let firstKill = false;
        for (const frame of timeline.frames) {
            for (const event of frame.events) {
                if (event.type == "CHAMPION_KILL") {
                    firstKill = true;
                }
                if (event.type == "BUILDING_KILL" 
                        && event.buildingType == "TOWER_BUILDING" 
                        && event.laneType == "MID_LANE"
                        && event.towerType == "OUTER_TURRET" 
                        && lanerWasInvolved(event, participant)) {
                    if ((this.beforeFirstBlood && !firstKill) || (event.timestamp <= this.timeLimitInMs)) {
                        return true;
                    }
                }
            }
        }
    }

}

export class AheadInKillsOfEnemyLaner extends PlayerRule {
    public constructor(private killsRequired: number, private timeLimitInMs: number) {
        super();
    }
    

    public verify(summonerId: string, game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): boolean {
        const participant = findParticipantBySummonerId(summonerId, game); 
        if (participant == null) {
            return false;
        }

        const opponent = findLaneOpponent(participant, game); 
        if (opponent == null) {
            return false;
        }

        let participantKills = 0;
        let opponentKills = 0;

        for (const frame of timeline.frames) {
            for (const event of frame.events) {
                if (event.type == "CHAMPION_KILL" && event.timestamp < this.timeLimitInMs) {
                    if (event.killerId == participant.participantId) {
                        participantKills += 1;
                    } else if (event.killerId == opponent.participantId) {
                        opponentKills += 1;
                    }
                }
            }
        }
        return participantKills - opponentKills >= this.killsRequired
    }  
}

export class KillsOnLaneRule extends PlayerRule {
//    private lanes = [ "BOTTOM", "BOT", "TOP"]
//    private lanes = [ "MID", "MIDDLE"]
    public constructor(private killsRequired: number, private timeLimitInMs: number, private lanes: string[]) {
        super();
    }
    
    private validKillTargets(game: MatchV4MatchDto, teamId: number) {

        let validTargets = new Set<number>();
        for (const participant of game.participants) {
            if (participant.teamId != teamId && this.lanes.indexOf(participant.timeline.lane) !== -1) {
                validTargets.add(participant.participantId)
            }
        }
        return validTargets
    }

    public verify(summonerId: string, game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): boolean {
        const participant = findParticipantBySummonerId(summonerId, game); 
        if (participant == null) {
            return false;
        }

        const validTargets = this.validKillTargets(game, participant.teamId);
        let killCount = 0;
        
        for (const frame of timeline.frames) {
            for (const event of frame.events) {
                if (event.type == "CHAMPION_KILL" && event.timestamp < this.timeLimitInMs && lanerWasInvolved(event, participant)) {
                    if (validTargets.has(event.victimId)) {
                        killCount += 1;
                    }
                }
            }
        }
        return killCount >= this.killsRequired;
    }
}

export class KillParticipationRule extends PlayerRule {
    public constructor(private participationRequirement: number) {
        super();
    }

    private getKillCount(game: MatchV4MatchDto, team: number) {
        let killCount = 0;
        for (const participant of game.participants) {
            if (participant.teamId == team) {
                killCount += participant.stats.kills;
            }
        }
        return killCount;
    }
    
    public verify(summonerId: string, game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): boolean {
        const participant = findParticipantBySummonerId(summonerId, game); 
        if (participant == null) {
            return false;
        }

        const participation = (participant.stats.kills + participant.stats.assists) / this.getKillCount(game, participant.teamId);

        return participation > this.participationRequirement;
    }

}



export class KillWhileBehindEnemyLaner extends PlayerRule {
    public constructor(private killsRequired: number) {
        super();
    }
    

    public verify(summonerId: string, game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): boolean {
        const participant = findParticipantBySummonerId(summonerId, game); 
        if (participant == null) {
            return false;
        }

        const opponent = findLaneOpponent(participant, game); 
        if (opponent == null) {
            return false;
        }

        let participantKills = 0;
        let opponentKills = 0;

        for (const frame of timeline.frames) {
            for (const event of frame.events) {
                if (event.type == "CHAMPION_KILL") {
                    if (event.killerId == participant.participantId) {
                        if ((participantKills - opponentKills) >= this.killsRequired) {
                            return true;
                        }
                        participantKills += 1;
                    } else if (event.killerId == opponent.participantId) {
                        opponentKills += 1;
                    }
                }
            }
        }
        return false;
    }  
}


export class XKillRule extends PlayerRule {
    private killTimeout = 10000;
    private pentaKillTimeout = 30000;

    public constructor(private numberOfKillStreaks: number, private numberOfKillsInRow: number, private timeLimitInMs: number) {
        super();
    }
    

    public verify(summonerId: string, game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): boolean {
        const participant = findParticipantBySummonerId(summonerId, game); 
        if (participant == null) {
            return false;
        }

        let killCounter = 0;
        let lastKillTimestamp = 0;
        let killStreaks = 0;

        for (const frame of timeline.frames) {
            for (const event of frame.events) {
                if (event.type == "CHAMPION_KILL" && event.timestamp <= this.timeLimitInMs && event.killerId == participant.participantId) {
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

        return killStreaks >= this.numberOfKillStreaks
        
    }  
}

export class SoloKillRule extends PlayerRule {

    public constructor(private killCountRequired: number) {
        super();
    }
    

    public verify(summonerId: string, game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): boolean {
        const participant = findParticipantBySummonerId(summonerId, game); 
        if (participant == null) {
            return false;
        }

        let killCounter = 0;

        for (const frame of timeline.frames) {
            for (const event of frame.events) {
                if (event.type == "CHAMPION_KILL" 
                    && event.killerId == participant.participantId 
                    && (!event.assistingParticipantIds || event.assistingParticipantIds.length == 0)) {
                    killCounter += 1;
                }
            }
        }
        return killCounter >= this.killCountRequired;
    }
}

export class ItemInInventoryRule extends PlayerRule {
   
    // ONE OF THE ITEMS HAS TO BE KEPT
    public constructor(private itemsToKeep: number[], private buyTime: number) {
        super();
    }
    
    public updateItems(items: number[], event: MatchV4MatchEventDto) {
        if (event.type == "ITEM_DESTROYED" || event.type == "ITEM_SOLD" || event.type == "ITEM_UNDO") {
            const index = items.indexOf(event.itemId);
            if (index !== -1) {
                items.splice(index, 1);
                return true;
            }
        } else if (event.type == "ITEM_PURCHASED") {
            items.push(event.itemId);
            return true;
        }
        return false;
    }

    private checkRequiredItems(items: number[]): boolean {
        const set = new Set<number>(items);
        return this.itemsToKeep.some(a => set.has(a));
    }
    public verify(summonerId: string, game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): boolean {
        const participant = findParticipantBySummonerId(summonerId, game); 
        if (participant == null) {
            return false;
        }

        const items: number[] = []

        for (const frame of timeline.frames) {
            for (const event of frame.events) {
                if ((event.type == "ITEM_DESTROYED" || event.type == "ITEM_PURCHASED" || event.type == "ITEM_SOLD" || event.type == "ITEM_UNDO") 
                    && event.participantId == participant.participantId) {
                    this.updateItems(items, event);
                    if (event.timestamp > this.buyTime && !this.checkRequiredItems(items)) {
                        return false;
                    }
                }
            }
        }
        return !this.checkRequiredItems(items);
    } 
}


export class PinkWardRule extends PlayerRule {

    public constructor(private pinkWardCount: number) {
        super();
    }

    public verify(summonerId: string, game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): boolean {
        const participant = findParticipantBySummonerId(summonerId, game); 
        if (participant == null) {
            return false;
        }

        const items: number[] = []
        let wardCount = 0;

        for (const frame of timeline.frames) {
            for (const event of frame.events) {
                if (event.type =="WARD_PLACED" && event.creatorId == participant.participantId && event.wardType == "UNDEFINED") {
                    wardCount += 1;
                }
            }
        }

        return wardCount >= this.pinkWardCount;
    }
}


export class ZeroScoreRule extends PlayerRule {
  
    // use POSITIVE_INFINITY for until end of game
    public constructor(private zeroScoreUntilTimeInMs: number) {
        super();
    }

    public verify(summonerId: string, game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): boolean {
        const participant = findParticipantBySummonerId(summonerId, game); 
        if (participant == null) {
            return false;
        }
 
        for (const frame of timeline.frames) {
            for (const event of frame.events) {
                if (event.type =="CHAMPION_KILL" && event.timestamp <= this.zeroScoreUntilTimeInMs && lanerWasInvolved(event, participant)) {
                    return false;
                }
            }
        }
        return true;
    }  
}