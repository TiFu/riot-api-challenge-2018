import * as React from "react";
import { AchievementState } from "../store";
import { connect } from 'react-redux';
import { updatePlayerInfo } from '../store/player/actions';
import { PlayerInfo, PlayerState, PlayerAchievementEntry } from '../store/player/types';
import TreeComponent from './TreeComponent'
import { number } from "prop-types";
import { Achievement, PlayerPartialInfo, GroupPlayerPartialInfo } from 'achievement-sio';
import TrophyComponent from './TrophComponent';
import { playerAchievementCategories, getCategoryCompletionState } from 'achievement-models';
import { PlayerAchievementCategory } from 'achievement-models';

interface ConfigurableMemberComponentProps {
    members: GroupPlayerPartialInfo[]
}
  
interface MemberComponentProps {

}



interface MemberComponentActions {
}

class MemberComponent extends React.Component<ConfigurableMemberComponentProps & MemberComponentProps & MemberComponentActions, {}> {

    render() { 
        const members = this.props.members.map((m, idx) => {
            return <tr key={m.accountId}>
            <th scope="row">{idx + 1}</th>
            <td>{m.name}</td>
            <td>{(new Date(Date.parse(m.memberSince))).toLocaleString("en-US", { year: "numeric", month: "long", day: "numeric"})}</td>
            </tr>
        })
        return <div>
                    <div className="row">
                        <div className="col"><h1><i className="fas fa-users"></i> Members</h1></div>
                        <div className="col" style={{textAlign: "right"}}> <button type="button" onClick={() => console.log("button clicked")} className="btn btn-primary" data-dismiss="alert" aria-label="Close"><i class="fas fa-plus-circle"></i> Invite Player</button></div>
                    </div>
                    <table className="table">
                    <thead>
                        <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Member since</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members}
                    </tbody>
                    </table>                    
            </div>
    }
  
}
   
  
  function mapStateToProps(state: AchievementState, ownProps: ConfigurableMemberComponentProps): MemberComponentProps {
    return {
    };
  }
  
  function mapDispatchToProps(dispatch): MemberComponentActions {
      return {}
  }
  export default connect(mapStateToProps, mapDispatchToProps)(MemberComponent)