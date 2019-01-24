import * as React from "react";
import { AchievementState } from "../store";
import { connect } from 'react-redux';
import { updatePlayerInfo } from '../store/player/actions';
import { PlayerInfo, PlayerState, PlayerAchievementEntry } from '../store/player/types';
import TreeComponent from './TreeComponent'
import { groupAchievementCategories, getObtainableIds } from "achievement-models";
import { number } from "prop-types";
import { Achievement } from 'achievement-sio';
import TrophyComponent from './TrophComponent';
import { playerAchievementCategories, getCategoryCompletionState } from 'achievement-models';
import { GroupPartialInfo } from 'achievement-sio';
import { PlayerAchievementCategory } from 'achievement-models';
import MemberComponent from './MemberComponent'
import AchievementOverviewComponent from "./ObtainedAchievementOverviewComponent";
import UnobtainedAchievementOverviewComponent from './UnobtainedAchievementOverviewComponent';

interface ConfigurableGroupComponentProps {
    group: GroupPartialInfo
}
  
interface GroupComponentProps {
    region: string
}



interface GroupComponentActions {
}

class GroupComponent extends React.Component<ConfigurableGroupComponentProps & GroupComponentProps & GroupComponentActions, {}> {

    render() { 
        const groupCat = groupAchievementCategories[0]
        const completionState = getCategoryCompletionState(groupCat, new Set<number>(this.props.group.achievements.map(a => a.achievementId)));
        const achievementMap = new Map<number, Achievement>();
        this.props.group.achievements.forEach(a => achievementMap.set(a.achievementId, a))
        
        const unlockedAchievements = getObtainableIds(groupAchievementCategories[0], new Set<number>(achievementMap.keys()))

        return <div className="full_width_height">
            <div className="full_width_height">
                <div className="row row_half no_margin">
                    <div className="col full_width_height">
                        <div className="row  full_width_height">
                            <div className="col-6" style={{height: "100%"}}>
                                <TrophyComponent completionState={completionState} achievementCategory={groupCat}></TrophyComponent>
                            </div>
                            <div className="col-6" style={{height: "100%"}}>
                                <TreeComponent achievementCategory={groupCat} achievements={achievementMap} componentId={"group_" + this.props.group.id}></TreeComponent>
                            </div>
                        </div>
                    </div>
                    <div className="col margin">
                        <UnobtainedAchievementOverviewComponent achievementCategory={groupAchievementCategories[0]} title="Unlocked Achievements" icon="unlock" achievements={unlockedAchievements}></UnobtainedAchievementOverviewComponent>
                    </div>
                </div>
                <div className="row row_half no_margin">
                    <div className="col margin">
                        <AchievementOverviewComponent achievements={this.props.group.achievements}/>
                    </div>
                    <div className="col margin">
                        <MemberComponent region={this.props.region} groupId={this.props.group.id} members={this.props.group.members}/>
                    </div>
                </div>
            </div>
        </div>
    }
  
}
   
  
  function mapStateToProps(state: AchievementState, ownProps: ConfigurableGroupComponentProps): GroupComponentProps {
    return {
        region: state.player.playerInfo.platformId
    };
  }
  
  function mapDispatchToProps(dispatch): GroupComponentActions {
      return {}
  }
  export default connect(mapStateToProps, mapDispatchToProps)(GroupComponent)