import * as React from "react";
import { AchievementState } from "../store";
import { connect } from 'react-redux';
import { updatePlayerInfo, invitePlayerAction } from '../store/player/actions';
import { PlayerInfo, PlayerState, PlayerAchievementEntry } from '../store/player/types';
import TreeComponent from './TreeComponent'
import { number } from "prop-types";
import { Achievement, PlayerPartialInfo, GroupPlayerPartialInfo } from 'achievement-sio';
import TrophyComponent from './TrophComponent';
import { playerAchievementCategories, getCategoryCompletionState } from 'achievement-models';
import { PlayerAchievementCategory } from 'achievement-models';
import Modal from 'react-bootstrap4-modal'
import PlayerSearchComponent from "./PlayerSearchComponent";

interface MemberComponentState {
    showModal: boolean;
    selectedPlayer: PlayerPartialInfo
    msg: string
}

interface ConfigurableMemberComponentProps {
    groupId: number
    members: GroupPlayerPartialInfo[]
    region: string
}
  
interface MemberComponentProps {

}



interface MemberComponentActions {
    invitePlayer: (groupId: number, player: PlayerPartialInfo, cb: (err: string, success: boolean) => void) => void
}

class MemberComponent extends React.Component<ConfigurableMemberComponentProps & MemberComponentProps & MemberComponentActions, MemberComponentState> {

    constructor(props) {
        super(props)
        this.state = { showModal: false, selectedPlayer: null, msg: null }
    }

    private handleClose() {
        this.setState({showModal: false, selectedPlayer: null, msg: null})
    }

    private handleInvitePlayer() {
        const player = this.state.selectedPlayer
        this.props.invitePlayer(this.props.groupId, player, this.handleInvitePlayerCb.bind(this))
    }

    private handleInvitePlayerCb(err: string, success: boolean) {
        if (err) {
            this.setState({msg: err})
        } else {
            this.handleClose()
        }
    }

    private handlePlayerUpdate(player: PlayerPartialInfo) {
        console.log("Selected PLAYER: ", player)
        this.setState({ selectedPlayer: player})
    }

    private renderMessage(m: string) {
        const icon = <i className="fas fa-exclamation-triangle"></i>;
        return <div className={"alert alert-" + "danger"} role="alert">
                <div className="row  align-items-center">
                <div className="col-auto">
                    {icon}
                </div>
                <div className="col">
                    {m}
                </div>
            </div>
      </div>
    }

    private renderModal() {
        let msg = null
        if (this.state.msg) {
            msg = this.renderMessage(this.state.msg)
        }
        return <Modal visible={this.state.showModal} onClickBackdrop={() => this.handleClose()}>
        <div className="modal-header">
          <h5 className="modal-title highlight_text modal_title">Invite Player</h5>
        </div>
        <div className="modal-body">
            {msg}
            <PlayerSearchComponent exclude={new Set<number>(this.props.members.map(m => m.accountId))} player={this.state.selectedPlayer} region={this.props.region} onChange={this.handlePlayerUpdate.bind(this)}></PlayerSearchComponent>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-danger" onClick={() => this.handleClose()}>
            Cancel
          </button>
          <button type="button" className="btn btn-success" disabled={this.state.selectedPlayer === undefined || this.state.selectedPlayer == null} onClick={() => this.handleInvitePlayer()}>
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
        return <div className="group_achieve_div">
                    <div className="row">
                        <div className="col"><h1><i className="fas fa-users"></i> Members</h1></div>
                        <div className="col" style={{textAlign: "right"}}> <button type="button" onClick={() => this.setState({showModal:true})} className="btn btn-primary" data-dismiss="alert" aria-label="Close"><i className="fas fa-plus-circle"></i> Invite Player</button></div>
                    </div>

                   
                    <div className="group_achieve_less_pad">
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
        </div>
    }
  
}
   
  
  function mapStateToProps(state: AchievementState, ownProps: ConfigurableMemberComponentProps): MemberComponentProps {
    return {
    };
  }
  
  function mapDispatchToProps(dispatch): MemberComponentActions {
      return {
        invitePlayer: (groupId: number, player: PlayerPartialInfo, cb: (err: string, success: boolean) => void) => dispatch(invitePlayerAction(groupId, player, cb))
      }
  }
  export default connect(mapStateToProps, mapDispatchToProps)(MemberComponent)