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
import GroupComponent from "./GroupComponent";

interface GroupsComponentsState {
    currentGroupIdx: number;
}

interface ConfigurableGroupsComponentProps {
}
  
interface GroupsComponentProps {
    groups: GroupPartialInfo[]
}



interface GroupsComponentActions {
}

class GroupsComponent extends React.Component<ConfigurableGroupsComponentProps & GroupsComponentProps & GroupsComponentActions, GroupsComponentsState> {

    public constructor(props) {
        super(props);
        this.state = { currentGroupIdx: 0 };
    }

    render() {       
        console.log("Groups: ", this.state.currentGroupIdx)  
        return <div className="background full_width_height">
            <div className="full_width_height">
                <h1>{this.props.groups[this.state.currentGroupIdx].name}</h1>
                <GroupComponent group={this.props.groups[this.state.currentGroupIdx]}></GroupComponent>
            </div>
        </div>
    }
  
}
   
  
  function mapStateToProps(state: AchievementState, ownProps: ConfigurableGroupsComponentProps): GroupsComponentProps {
    console.log(state.player.groups)
    return {
        groups: state.player.groups
    };
  }
  
  function mapDispatchToProps(dispatch): GroupsComponentActions {
      return {}
  }
  export default connect(mapStateToProps, mapDispatchToProps)(GroupsComponent)