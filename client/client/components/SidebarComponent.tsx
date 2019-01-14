import * as React from "react";
import { AchievementState } from "../store";
import { connect } from 'react-redux';
import { updatePlayerInfo } from '../store/player/actions';
import { PlayerInfo, PlayerState } from '../store/player/types';
import TreeComponent from './TreeComponent'
import WallpaperComponent from './WallpaperComponent'
import {Route, HashRouter as Router, NavLink, withRouter} from 'react-router-dom'
import GroupComponent from './GroupComponent'
import { GroupPartialInfo } from "achievement-sio";
import GroupInvitesComponent from "./GroupInvitesComponent";

interface SidebarComponentProps {
    groups: GroupPartialInfo[]
}

interface SidebarComponentActions {
}

class SidebarComponent extends React.Component<SidebarComponentProps & SidebarComponentActions, {}> {

    render() {
        return <div className="sidebar full_width_height no_padding"> 
                <div className="row title_bar">
                    <div className="col-7 title no_padding">
                        <span style={{"marginLeft": "10%"}}>Trophy</span><br />
                        <span style={{"marginLeft": "10%"}}>Hunter</span>
                    </div>
                    <div className="col-5 no_padding">
                        <img src="./assets/logo.jpg" className="full_width_height" />
                    </div>
                </div>
                <div className="row sidebar_menu_size">
                    <div className="sidebar_menu">
                        <NavLink className="sidebar_default_link" activeClassName="sidebar_active_link" to="/wallpaper"><span className="fas fa-trophy"></span> Wallpaper</NavLink>
                        <NavLink className="sidebar_default_link" activeClassName="sidebar_active_link" to="/groups/id/1"><span className="fas fa-users"></span> Groups</NavLink>

                        <Route path="/groups" component={GroupSubItems}>

                        </Route>
                    </div>
                </div>
                <div className="row sidebar_footer">
                
                </div>
            </div>
    }
  
  }

function mapStateToProps(state: AchievementState): SidebarComponentProps {
  
    return {
        groups: state.player.groups
    };
  
}
  
function mapDispatchToProps(dispatch): SidebarComponentActions {
      return {}
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SidebarComponent) as any)


interface GroupSubItemsProps {
    inviteCount: number
}

class _GroupSubItems extends React.Component<GroupSubItemsProps, {}> {

    public render() {    
        const groupCategory = [ 
            <NavLink className="sidebar_default_link" key={"invitePlayer"} activeClassName="sidebar_active_link" to="/groups/id/1/invite"><div className="sidebar_indented"><span className="fas fa-envelope"></span> Invite Player</div></NavLink>, 
            <NavLink className="sidebar_default_link" key={"invites"} activeClassName="sidebar_active_link" to="/groups/invites"><div className="sidebar_indented"><span className="fas fa-envelope-open"></span> Group Invites<span className="badge_margin badge badge-light">{this.props.inviteCount}</span></div></NavLink>, 
            <NavLink className="sidebar_default_link" key={"create"} activeClassName="sidebar_active_link" to="/groups/create"><div className="sidebar_indented"><span className="fas fa-plus-circle"></span> Create Group</div></NavLink>
        ]
        return <div>
            {groupCategory}
        </div>            
    }
}
  

function mapStateToPropsSubItems(state: AchievementState): GroupSubItemsProps {
  
    return {
        inviteCount: state.player.invites ? state.player.invites.filter(i => i.status == "pending").length : 0
    };
  
}
  
function mapDispatchToPropsSubItems(dispatch): SidebarComponentActions {
      return {}
}
const GroupSubItems = withRouter(connect(mapStateToPropsSubItems, mapDispatchToPropsSubItems)(_GroupSubItems) as any)

