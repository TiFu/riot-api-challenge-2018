import * as React from "react";
import { AchievementState } from "../store";
import { connect } from 'react-redux';
import { updatePlayerInfo } from '../store/player/actions';
import { PlayerInfo, PlayerState } from '../store/player/types';
import TreeComponent from './TreeComponent'
import WallpaperComponent from './WallpaperComponent'
import {Route, HashRouter as Router, Link, Switch, Redirect} from 'react-router-dom'
import GroupsComponent from './GroupsComponent'
import { GroupPartialInfo } from "achievement-sio";
import GroupInvitesComponent from "./GroupInvitesComponent";
import SidebarComponent from "./SidebarComponent";
import CreateGroupComponent from './CreateGroupComponent'
import Modal from 'react-bootstrap4-modal';
import { showAchievementOverview } from "../store/component/actions";


interface MainComponentProps {
    groups: GroupPartialInfo[]
}

interface MainComponentActions {
    showAchievementOverview: (visible: boolean) => void
}

interface MainComponentState {
    showCreateGroupModal: boolean;
    showLegalInfo: boolean;
}

class MainComponent extends React.Component<MainComponentProps & MainComponentActions, MainComponentState> {
    private timeout;

    public constructor(props) {
        super(props);
        this.state = { showCreateGroupModal: false, showLegalInfo: true };
    }

    public componentDidMount() {
        if (this.state.showLegalInfo) {
            this.timeout = setTimeout(() => {
                this.setState({showLegalInfo: false});
            }, 3000);
        }
    }

    public componentWillUnmount() {
        clearTimeout(this.timeout);
        this.timeout = null;
    }
    private showCreateGroupClickedModal() {
        console.log("Showing modal!");
        this.setState({ showCreateGroupModal: true});
    }

    private handleClose() {
        this.setState({showCreateGroupModal: false})
    }
    private renderCreateGroupModal() {
        console.log("Showing modal: " + this.state.showCreateGroupModal)
        return <CreateGroupComponent show={this.state.showCreateGroupModal} onHideCallback={() => this.handleClose()}></CreateGroupComponent>
    }

    private handleCloseLegal() {
        this.setState({showLegalInfo: false})
    }
    render() {
        const groupCategory = [ <li key={"invites"}><Link to="/groups/invites">Group Invites</Link></li>, <li key={"create"}><Link to="/groupCreate">Create Group</Link></li> ]
        if (this.props.groups) {
            const groupLinks = this.props.groups.map((g, idx) => <li key={g.id}><Link to={"/groups/id/" + idx}>{g.name}</Link></li>)
            groupLinks.forEach(g => groupCategory.push(g))
        }
        let legal = null;
        if (this.state.showLegalInfo) {
            legal = <div className="alert alert-dismissable legal">
                <button type="button" onClick={() => this.handleCloseLegal()} className="close close-legal" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                Trophy Hunter isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends. League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc. League of Legends © Riot Games, Inc.                
            </div>
        }

        return <Router > 
            <div className="row full_width_height no_margin_left">
            <div className="col-2 no_padding">
               <SidebarComponent onCreateGroupClicked={() => this.showCreateGroupClickedModal()}></SidebarComponent>
            </div>
            <div className="col-10 full_width_height no_padding" onClick={() => this.props.showAchievementOverview(false)}>
                <Route exact path="/" component={RedirectComponent}></Route>
                <Route exact path="/wallpaper" component={WallpaperComponent}></Route>
                <Route  path="/groups/id/:idx" component={GroupsComponent}></Route>
                <Route exact path="/groups/invites" component={GroupInvitesComponent}></Route>
                {this.renderCreateGroupModal()}
            </div>
            {legal}
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
      return {
          showAchievementOverview: (visible: boolean) => dispatch(showAchievementOverview(visible))
      }
  }

  class RedirectComponent extends React.Component<{}, {}> {
      render() { 
        return <Redirect to="/wallpaper"></Redirect>
      }
  }
  export default connect(mapStateToProps, mapDispatchToProps)(MainComponent)