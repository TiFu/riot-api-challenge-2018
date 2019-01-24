import * as React from "react";
import { AchievementState } from "../store";
import { connect } from 'react-redux';
import { updatePlayerInfo } from '../store/player/actions';
import { PlayerInfo, PlayerState } from '../store/player/types';
import TreeComponent from './TreeComponent'
import WallpaperComponent from './WallpaperComponent'
import {Route, HashRouter as Router, NavLink, withRouter} from 'react-router-dom'
import GroupComponent from './GroupsComponent'
import { GroupPartialInfo } from "achievement-sio";
import GroupInvitesComponent from "./GroupInvitesComponent";
import AchievementBoxComponent from "./AchievementBoxComponent";
import { playerAchievementCategories } from 'achievement-models';
import { showAchievementOverview } from "../store/component/actions";

export interface SidebarConfigurableProps {
     onCreateGroupClicked: () => void;
}
interface SidebarComponentProps {
    groups: GroupPartialInfo[]
    connectedToLcu: boolean
    connectedToBackend: boolean
}

interface SidebarComponentActions {
    setOverviewVisible: (visible: boolean) => void;
}

class SidebarComponent extends React.Component<SidebarConfigurableProps & SidebarComponentProps & SidebarComponentActions, {}> {

    makeFooter() {
        const lcuClass = this.props.connectedToLcu ? "" : "gray_image"
        const backendClass = this.props.connectedToBackend ? "": "gray_image";
        return <div className="row sidebar_footer">
            <div className="col connection_icon_frame no_padding">
                <img src="./assets/lcu.png" width="40px" className={"connection_icon " + lcuClass}/>
            </div>
            <div className="col connection_icon_frame no_padding">
                <img src="./assets/logo.png" width="40px" className={"connection_icon " + backendClass}/>
            </div>
        </div>
    }

    render() {
        return <div className="sidebar full_width_height no_padding"> 
                <div className="row title_bar">
                    <div className="col-7 title no_padding">
                        <div className="title_cell">
                            <span style={{"marginLeft": "10%"}}>TROPHY</span><br />
                            <span style={{"marginLeft": "10%"}}>HUNTER</span>
                        </div>
                    </div>
                    <div className="col-5 no_padding">
                        <img src="./assets/logo.png" className="full_width_height" />
                    </div>
                </div>
                <div className="row sidebar_menu_size" onClick={() => this.props.setOverviewVisible(false)}>
                    <div className="sidebar_menu">
                        <NavLink className="sidebar_default_link" activeClassName="sidebar_active_link" to="/wallpaper"><span className="fas fa-trophy"></span> <span className="sidebar_desc">Trophy Wall</span></NavLink>
                        <NavLink className="sidebar_default_link" activeClassName="sidebar_active_link" to="/groups/id/0"><span className="fas fa-users"></span> <span className="sidebar_desc">Groups</span></NavLink>
                        <GroupSubItems onCreateGroupClicked={this.props.onCreateGroupClicked} ></GroupSubItems>
                    </div>
                </div>
                <div className="row sidebar_achievementBox">
                    <div className="sidebar_menu">
                        <AchievementBoxComponent></AchievementBoxComponent>
                    </div>
                </div>
                {this.makeFooter()}
            </div>
    }
  
  }

function mapStateToProps(state: AchievementState, ownProps: SidebarConfigurableProps): SidebarComponentProps {
  
    return {
        groups: state.player.groups,
        "connectedToBackend": state.lcu.connectedToFrontend,
        "connectedToLcu": state.lcu.connectedToLcu
    };
  
}
  
function mapDispatchToProps(dispatch): SidebarComponentActions {
      return {
        setOverviewVisible: (visible: boolean) => dispatch(showAchievementOverview(visible))
      }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SidebarComponent) as any) as any


interface GroupSubItemsConfigurableProps {
    onCreateGroupClicked: () => void;
}

interface GroupSubItemsProps {
    inviteCount: number
}

class _GroupSubItems extends React.Component<GroupSubItemsProps & GroupSubItemsConfigurableProps, {}> {

    public render() {    
        const groupCategory = [ 
            <NavLink className="sidebar_default_link" key={"invites"} activeClassName="sidebar_active_link" to="/groups/invites"><div className="sidebar_indented"><span className="fas fa-inbox"></span> <span className="sidebar_desc">Group Invites</span><span className="badge_margin badge badge-light">{this.props.inviteCount}</span></div></NavLink>, 
            <NavLink className="sidebar_default_link" onClick={(evt) => { console.log(this.props); this.props.onCreateGroupClicked(); evt.preventDefault(); }} key={"create"} activeClassName="sidebar_active_link" to="/groups/create"><div className="sidebar_indented"><span className="fas fa-plus-circle"></span > <span className="sidebar_desc">Create Group</span></div></NavLink>
        ]
        return <div>
            {groupCategory}
        </div>            
    }
}
  

function mapStateToPropsSubItems(state: AchievementState, ownProps: GroupSubItemsConfigurableProps): GroupSubItemsProps {
  
    return {
        inviteCount: state.player.invites ? state.player.invites.filter(i => i.status == "pending").length : 0
    };
  
}
  
function mapDispatchToPropsSubItems(dispatch) {
      return {}
}
const GroupSubItems = withRouter(connect(mapStateToPropsSubItems, mapDispatchToPropsSubItems)(_GroupSubItems) as any) as any

