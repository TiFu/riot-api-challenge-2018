import * as React from "react";
import { AchievementState } from "../store";
import { connect } from 'react-redux';
import { updatePlayerInfo } from '../store/player/actions';
import { PlayerInfo, PlayerState } from '../store/player/types';
import TreeComponent from './TreeComponent'
import WallpaperComponent from './WallpaperComponent'
import {Route, HashRouter as Router, Link, Switch, Redirect} from 'react-router-dom'
import GroupComponent from './GroupComponent'
import { GroupPartialInfo } from "achievement-sio";
import GroupInvitesComponent from "./GroupInvitesComponent";
import SidebarComponent from "./SidebarComponent";

interface MainComponentProps {
    groups: GroupPartialInfo[]
}

interface MainComponentActions {
}

class MainComponent extends React.Component<MainComponentProps & MainComponentActions, {}> {

    render() {
        const groupCategory = [ <li key={"invites"}><Link to="/groups/invites">Group Invites</Link></li>, <li key={"create"}><Link to="/groupCreate">Create Group</Link></li> ]
        if (this.props.groups) {
            const groupLinks = this.props.groups.map((g, idx) => <li key={g.id}><Link to={"/groups/id/" + idx}>{g.name}</Link></li>)
            groupLinks.forEach(g => groupCategory.push(g))
        }
        return <Router > 
            <div className="row full_width_height no_margin_left">
            <div className="col-2 no_padding">
               <SidebarComponent></SidebarComponent>
            </div>
            <div className="col-10 full_width_height no_padding">
                <Route exact path="/wallpaper" component={WallpaperComponent}></Route>
                <Route  path="/groups/id/:idx" component={GroupComponent}></Route>
                <Route exact path="/groups/invites" component={GroupInvitesComponent}></Route>
            </div>
        </div>
      </Router>  
    }
  
  }
   
  
  function mapStateToProps(state: AchievementState): MainComponentProps {
  
    return {
        groups: state.player.groups
    };
  
  }
  
  function mapDispatchToProps(dispatch): MainComponentActions {
      return {}
  }
  export default connect(mapStateToProps, mapDispatchToProps)(MainComponent)