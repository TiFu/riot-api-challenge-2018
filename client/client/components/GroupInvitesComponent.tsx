import * as React from "react";
import { AchievementState } from "../store";
import { connect } from 'react-redux';
import { updatePlayerInfo, acceptInvite, declineInvite } from '../store/player/actions';
import { PlayerInfo, PlayerState, PlayerAchievementEntry } from '../store/player/types';
import TreeComponent from './TreeComponent'
import { number } from "prop-types";
import { Achievement, PlayerPartialInfo, GroupInviteRequest } from 'achievement-sio';
import TrophyComponent from './TrophComponent';
import { playerAchievementCategories, getCategoryCompletionState } from 'achievement-models';
import { PlayerAchievementCategory } from 'achievement-models';
import { achievementMap } from "achievement-models";

interface Message {
    id: number
    success: boolean, 
    msg: string,
    timeout: any
}
interface GroupInviteComponentState {
    messages: Message[]
}

interface ConfigurableGroupInviteComponentProps {
}
  
interface GroupInviteComponentProps {
    invites: GroupInviteRequest[]
}

let messageId = 0;

interface GroupInviteComponentActions {
    acceptInvitation: (inviteId: number, groupId: number, cb: (err: string, success: boolean) => void ) => void;
    declineInvitation: (inviteId: number, groupId: number, cb: (err: string, success: boolean) => void) => void;
}

class GroupInviteComponent extends React.Component<ConfigurableGroupInviteComponentProps & GroupInviteComponentProps & GroupInviteComponentActions, GroupInviteComponentState> {

    public constructor(props) {
        super(props)
        this.state = { messages: [] }
    }

    private updateStateResultAccept(invite: GroupInviteRequest, err: string, success: boolean) { 
        const updatedMessages = this.state.messages.slice();
        let msg = "";
        if (success) {
            msg = "Joined " + invite.groupName;
        } else {
            msg = "Failed to accept invitation for " + invite.groupName + ": " + err;
        }
        const message = { 
            id: messageId++,
            success: success,
            msg: msg,
            timeout: null            
        }
        updatedMessages.push(message)
        this.setRemoveMessageTimeout(message);
        this.setState({ messages: updatedMessages })
    }

    private updateStateResultDecline(invite: GroupInviteRequest, err: string, success: boolean) {
        const updatedMessages = this.state.messages.slice();
        let msg = "";
        if (success) {
            msg = "Declined invitation for " + invite.groupName;
        } else {
            msg = "Failed to decline invitation for " + invite.groupName + ": " + err;
        }
        const message = { 
            id: messageId++,
            success: success,
            msg: msg,
            timeout: null            
        }
        updatedMessages.push(message)
        this.setRemoveMessageTimeout(message);
        this.setState({ messages: updatedMessages })
        
    }

    private setRemoveMessageTimeout(message: Message) {
        const timeout = setTimeout(() => {
            this.removeMessage(message);
        }, 5000)
        message.timeout = timeout
    }

    private removeMessage(message: Message){
        const newMessages = this.state.messages.slice();
        newMessages.splice(newMessages.indexOf(message), 1);
        this.setState({ messages: newMessages })
    }

    private dismissMessage(message: Message) {
        clearTimeout(message.timeout);
        this.removeMessage(message);
    }

    private renderMessage(m: Message) {
        const icon = !m.success ? <i className="fas fa-exclamation-triangle"></i> : <i className="fas fa-check-circle"></i>;
        return <div key={m.id} className={"alert alert-dismissible alert-" + (m.success ? "success":"danger")} role="alert">
                <div className="row  align-items-center">
                <div className="col-auto">
                    {icon}
                </div>
                <div className="col">
                    {m.msg}
                </div>
            </div>
            <button type="button" onClick={() => this.dismissMessage(m)}className="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
      </div>
    }

    private renderMessages() {
        const msgs = this.state.messages.map(m => this.renderMessage(m))
        return <div className="margin">
                {msgs}
            </div>
    }
    render() { 
        let invitations = []
        if (this.props.invites) {
            console.log(this.props.invites)
            invitations = this.props.invites.filter(i => i.status == "pending").map(i => {
                return <tr key={i.inviteId} className="hover-table-row">
                    <td>{(new Date(Date.parse(i.date as any))).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric"})}</td>
                    <td>{i.groupName}</td>
                    <td>{i.inviter.name}</td>
                    <td className="align_buttons">
                        <button onClick={() => { console.log("Button clicked"); this.props.acceptInvitation(i.inviteId, i.groupId, (err, data) => this.updateStateResultAccept(i, err, data))}} type="button" className="btn btn-success"><span className="fas fa-check"></span></button>
                        <button onClick={() => { console.log("Button clicked"); this.props.declineInvitation(i.inviteId, i.groupId, (err, data) => this.updateStateResultDecline(i, err, data))}} type="button" className="btn btn-danger"><span className="fas fa-times"></span></button>
                    </td>
                </tr>
            })
        }
        return <div className="background full_width_height no_padding_right">
                    <div className="row no_margin">
                        <div className="col margin">
                            <h1><span  className="highlight_text">Group Invitations</span></h1>
                        </div>
                    </div>
                    <div className="row no_margin">
                        <div className="col margin">                                                    
                            {this.renderMessages()}
                            <table className="table borderless">
                                <thead>
                                <tr>
                                <th scope="col">Date</th>
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
   
  
  function mapStateToProps(state: AchievementState, ownProps: ConfigurableGroupInviteComponentProps): GroupInviteComponentProps {
    return {
        invites: state.player.invites
    };
  }
  
  function mapDispatchToProps(dispatch): GroupInviteComponentActions {
      return {
        acceptInvitation: (inviteId: number, groupId: number, cb: (err: string, success: boolean) => void ) => { console.log("accepted"); dispatch(acceptInvite(inviteId, groupId, cb))},
        declineInvitation: (inviteId: number, groupId: number, cb: (err: string, success: boolean) => void ) => { console.log("declined"); dispatch(declineInvite(inviteId, groupId, cb))}
      }
  }
  export default connect(mapStateToProps, mapDispatchToProps)(GroupInviteComponent)