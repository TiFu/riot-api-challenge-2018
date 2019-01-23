import { GroupRule, PlayerRule } from './models';
import { MatchV4MatchDto, MatchV4MatchTimelineDto } from 'kayn/typings/dtos';

export class GroupKillRule extends GroupRule {

    public constructor() {
        super();
    }

    public verify(accountIds: string[], game: MatchV4MatchDto, timeline: MatchV4MatchTimelineDto): boolean {
        console.log("Verifying kill rule!")
        return true;
    }
}
