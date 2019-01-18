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
import Modal from 'react-bootstrap4-modal'

interface MemberComponentState {
    showModal: boolean;
}

interface ConfigurableMemberComponentProps {
    members: GroupPlayerPartialInfo[]
}
  
interface MemberComponentProps {

}



interface MemberComponentActions {
}

class MemberComponent extends React.Component<ConfigurableMemberComponentProps & MemberComponentProps & MemberComponentActions, MemberComponentState> {

    constructor(props) {
        super(props)
        this.state = { showModal: false }
    }

    private handleClose() {
        this.setState({showModal: false})
    }

    private handleInvitePlayer() {
        
    }
    private renderModal() {
        return <Modal visible={this.state.showModal} onClickBackdrop={() => this.handleClose()}>
        <div className="modal-header">
          <h5 className="modal-title highlight_text modal_title">Invite Player</h5>
        </div>
        <div className="modal-body">
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-danger" onClick={() => this.handleClose()}>
            Cancel
          </button>
          <button type="button" className="btn btn-success" onClick={() => this.handleInvitePlayer()}>
            Invite
          </button>
        </div>
      </Modal>
    }

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
                        <div className="col" style={{textAlign: "right"}}> <button type="button" onClick={() => this.setState({showModal:true})} className="btn btn-primary" data-dismiss="alert" aria-label="Close"><i class="fas fa-plus-circle"></i> Invite Player</button></div>
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
                    {this.renderModal()}                 
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