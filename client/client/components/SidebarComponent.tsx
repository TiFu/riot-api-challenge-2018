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

interface SidebarComponentProps {
    groups: GroupPartialInfo[]
    connectedToLcu: boolean
    connectedToBackend: boolean
}

interface SidebarComponentActions {
}

class SidebarComponent extends React.Component<SidebarComponentProps & SidebarComponentActions, {}> {

    makeFooter() {
        const lcuClass = this.props.connectedToLcu ? "" : "gray_image"
        const backendClass = this.props.connectedToBackend ? "": "gray_image";
        return <div className="row sidebar_footer">
            <div className="col connection_icon_frame no_padding">
                <img src="./assets/lcu.png" width="40px" className={"connection_icon " + lcuClass}/>
            </div>
            <div className="col connection_icon_frame no_padding">
                <img src="./assets/logo.jpg" width="40px" className={"connection_icon " + backendClass}/>
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
                        <img src="./assets/logo.jpg" className="full_width_height" />
                    </div>
                </div>
                <div className="row sidebar_menu_size">
                    <div className="sidebar_menu">
                        <NavLink className="sidebar_default_link" activeClassName="sidebar_active_link" to="/wallpaper"><span className="fas fa-trophy"></span> <span className="sidebar_desc">Wallpaper</span></NavLink>
                        <NavLink className="sidebar_default_link" activeClassName="sidebar_active_link" to="/groups/id/1"><span className="fas fa-users"></span> <span className="sidebar_desc">Groups</span></NavLink>

                        <Route path="/groups" component={GroupSubItems}>

                        </Route>
                    </div>
                </div>
                {this.makeFooter()}
            </div>
    }
  
  }

function mapStateToProps(state: AchievementState): SidebarComponentProps {
  
    return {
        groups: state.player.groups,
        "connectedToBackend": state.lcu.connectedToFrontend,
        "connectedToLcu": state.lcu.connectedToLcu
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
            <NavLink className="sidebar_default_link" key={"invitePlayer"} activeClassName="sidebar_active_link" to="/groups/id/1/invite"><div className="sidebar_indented"><span className="fas fa-envelope"></span> <span className="sidebar_desc">Invite Player</span></div></NavLink>, 
            <NavLink className="sidebar_default_link" key={"invites"} activeClassName="sidebar_active_link" to="/groups/invites"><div className="sidebar_indented"><span className="fas fa-inbox"></span> <span className="sidebar_desc">Group Invites</span><span className="badge_margin badge badge-light">{this.props.inviteCount}</span></div></NavLink>, 
            <NavLink className="sidebar_default_link" key={"create"} activeClassName="sidebar_active_link" to="/groups/create"><div className="sidebar_indented"><span className="fas fa-plus-circle"></span > <span className="sidebar_desc">Create Group</span></div></NavLink>
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

