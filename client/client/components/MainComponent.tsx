import * as React from "react";
import { AchievementState } from "../store";
import { connect } from 'react-redux';
import { updatePlayerInfo } from '../store/player/actions';
import { PlayerInfo, PlayerState } from '../store/player/types';
import TreeComponent from './TreeComponent'
import WallpaperComponent from './WallpaperComponent'
import {Route, HashRouter as Router, Link} from 'react-router-dom'
import GroupComponent from './GroupComponent'
import { GroupPartialInfo } from "achievement-sio";
import GroupInvitesComponent from "./GroupInvitesComponent";

interface MainComponentProps {
    groups: GroupPartialInfo[]
}

interface MainComponentActions {
}

class MainComponent extends React.Component<MainComponentProps & MainComponentActions, {}> {

    render() {
        const groupCategory = [ <li key={"invites"}><Link to="/groupInvites">Group Invites</Link></li>, <li key={"create"}><Link to="/groupCreate">Create Group</Link></li> ]
        if (this.props.groups) {
            const groupLinks = this.props.groups.map((g, idx) => <li key={g.id}><Link to={"/groups/" + idx}>{g.name}</Link></li>)
            groupLinks.forEach(g => groupCategory.push(g))
        }
        return <Router> 
            <div className="row full_width_height no_margin_left">
            <div className="col-1">
                <ul>
                    <li>
                    <Link to="/">Wallpaper</Link>
                    </li>
                    <li>
                    <Link to="/groups">Groups</Link>
                        <ul>
                            {groupCategory}
                        </ul>
                    </li>
                </ul>
            </div>
            <div className="col-11 full_width_height no_pad_right">
                <Route exact path="/" component={WallpaperComponent}></Route>
                <Route exact path="/groups/:idx" component={GroupComponent}></Route>
                <Route exact path="/groupInvites" component={GroupInvitesComponent}></Route>
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