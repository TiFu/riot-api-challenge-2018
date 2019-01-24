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
import GroupComponent from "./GroupComponent";
import DropdownComponent from "./DropdownComponent";
import { withRouter } from "react-router";

interface GroupsComponentsState {
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
    }

    newGroupSelected(idx) {
        console.log("Updating group index: ", idx);
        (this.props as any).history.push("/groups/id/" + idx);
    }

    renderGroupSelectComponent() {
        if (this.props.groups && this.props.groups.length > 0) {
            const options = this.props.groups.map((g, idx) => g.name);
            return <div className="center_dropdown"><DropdownComponent selected={(this.props as any).match.params.idx} options={options} optionStyle="dropdown_title" titleStyle="highlight_text" buttonStyle="group_title" onSelectCallback={(idx) => this.newGroupSelected(idx)}></DropdownComponent></div>
        } else {
            return null;
        }
    }

    render() {       
        let groupComponent = null;
        let groupIdx = (this.props as any).match.params.idx 
        if (!this.props.groups || (this.props.groups.length <= (this.props as any).match.params.idx  && this.props.groups.length > 1)) {
            groupIdx = 0
        }
        console.log("Current Idx: " + (this.props as any).match.params.idx )
        console.log("New idx: ", groupIdx)
        if (this.props.groups && this.props.groups.length > (this.props as any).match.params.idx ) {
            groupComponent = <GroupComponent group={this.props.groups[groupIdx]}></GroupComponent>
        } else if (!this.props.groups || this.props.groups.length == 0) {
            groupComponent = <div className="full_width_height" style={{textAlign: "center", fontSize: "20pt"}}>
                <i className="fas fa-users" style={{fontSize: "50pt"}}></i><br />
                Create a group or accept a group invite to unlock new achievements!
            </div>
        }
        return <div className="background full_width_height">
            <div className="row group_name_row">
                <div className="col">
                    {this.renderGroupSelectComponent()}
                </div>
            </div>
            <div className="row group_component_row">
                {groupComponent}
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
  export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GroupsComponent) as any);