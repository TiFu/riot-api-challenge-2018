import * as React from "react";
import { AchievementState } from "../store";
import { connect } from 'react-redux';
import { updatePlayerInfo } from '../store/player/actions';
import { PlayerInfo, PlayerState, PlayerAchievementEntry } from '../store/player/types';
import TreeComponent from './TreeComponent'
import { groupAchievementCategories } from "achievement-models";
import { number } from "prop-types";
import { Achievement } from 'achievement-sio';
import TrophyComponent from './TrophComponent';
import { playerAchievementCategories, getCategoryCompletionState } from 'achievement-models';
import { GroupPartialInfo } from 'achievement-sio';
import { PlayerAchievementCategory } from 'achievement-models';
import MemberComponent from './MemberComponent'
import AchievementOverviewComponent from "./AchievementOverviewComponent";
interface ConfigurableGroupComponentProps {
    match: {
        params: {"idx": string}
    }
}
  
interface GroupComponentProps {
    group: GroupPartialInfo
}



interface GroupComponentActions {
}

class GroupComponent extends React.Component<ConfigurableGroupComponentProps & GroupComponentProps & GroupComponentActions, {}> {

    render() { 
        const groupCat = groupAchievementCategories[0]
        const completionState = getCategoryCompletionState(groupCat, new Set<number>(this.props.group.achievements.map(a => a.achievementId)));
        const achievementMap = new Map<number, Achievement>();
        this.props.group.achievements.forEach(a => achievementMap.set(a.achievementId, a))
        
        return <div className="background full_width_height">
            <div className="full_width_height">
                <div className="row row_half no_margin">
                    <div className="col">
                        <div className="row margin" style={{height: "5%"}}><h1>{this.props.group.name}</h1></div>
                        <div className="row margin" style={{height: "95%"}}>
                        <TrophyComponent completionState={completionState} achievementCategory={groupCat}></TrophyComponent>
                        </div>
                    </div>
                    <div className="col margin">
                        <TreeComponent achievementCategory={groupCat} achievements={achievementMap} componentId={"group_" + this.props.match.params.idx}></TreeComponent>
                    </div>
                </div>
                <div className="row row_half no_margin">
                    <div className="col margin">
                        <AchievementOverviewComponent achievements={this.props.group.achievements}/>
                    </div>
                    <div className="col margin">
                        <MemberComponent members={this.props.group.members}/>
                    </div>
                </div>
            </div>
        </div>
    }
  
}
   
  
  function mapStateToProps(state: AchievementState, ownProps: ConfigurableGroupComponentProps): GroupComponentProps {
    console.log(ownProps)
    return {
        group: state.player.groups[Number.parseInt(ownProps.match.params["idx"])]
    };
  }
  
  function mapDispatchToProps(dispatch): GroupComponentActions {
      return {}
  }
  export default connect(mapStateToProps, mapDispatchToProps)(GroupComponent)