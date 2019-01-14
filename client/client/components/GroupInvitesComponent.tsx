import * as React from "react";
import { AchievementState } from "../store";
import { connect } from 'react-redux';
import { updatePlayerInfo } from '../store/player/actions';
import { PlayerInfo, PlayerState, PlayerAchievementEntry } from '../store/player/types';
import TreeComponent from './TreeComponent'
import { number } from "prop-types";
import { Achievement, PlayerPartialInfo, GroupInviteRequest } from 'achievement-sio';
import TrophyComponent from './TrophComponent';
import { playerAchievementCategories, getCategoryCompletionState } from 'achievement-models';
import { PlayerAchievementCategory } from 'achievement-models';
import { achievementMap } from "achievement-models";

interface ConfigurableAchievementComponentProps {
}
  
interface AchievementComponentProps {
    invites: GroupInviteRequest[]
}



interface AchievementComponentActions {
}

class AchievementComponent extends React.Component<ConfigurableAchievementComponentProps & AchievementComponentProps & AchievementComponentActions, {}> {

    render() { 
        let invitations = []
        if (this.props.invites) {
            invitations = this.props.invites.filter(i => i.status == "pending").map(i => {
                return <tr key={i.inviteId}>
                    <td>{i.groupName}</td>
                    <td>{i.inviter.name}</td>
                    <td>Accept / Decline</td>
                </tr>
            })
        }
        return <div className="background full_width_height no_padding_right">
                    <div className="row full_width_height no_margin">
                        <div className="col margin">
                            <h1>Group Invitations</h1>
                            <table className="table">
                            <thead>
                                <tr>
                                <th scope="col">Group</th>
                                <th scope="col">Inviter</th>
                                <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {invitations}
                            </tbody>
                            </table>                
                        </div>    
                    </div>
            </div>
    }
  
}
   
  
  function mapStateToProps(state: AchievementState, ownProps: ConfigurableAchievementComponentProps): AchievementComponentProps {
    return {
        invites: state.player.invites
    };
  }
  
  function mapDispatchToProps(dispatch): AchievementComponentActions {
      return {}
  }
  export default connect(mapStateToProps, mapDispatchToProps)(AchievementComponent)