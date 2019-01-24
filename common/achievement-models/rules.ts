import { PlayerRule } from './models';
import { MatchV4MatchDto, MatchV4MatchTimelineDto } from 'kayn/typings/dtos';

export class KillRule extends PlayerRule {

    public constructor() {
        super();
    }

    public verify(summonerId: string, game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): boolean {
        console.log("Verifying kill rule!")
        return false;
    }
}