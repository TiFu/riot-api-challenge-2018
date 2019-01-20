import * as React from "react";
import { AchievementState } from "../store";
import { connect } from 'react-redux';
import { updatePlayerInfo, acceptInvite, declineInvite, createGroupAction } from '../store/player/actions';
import { PlayerInfo, PlayerState, PlayerAchievementEntry } from '../store/player/types';
import TreeComponent from './TreeComponent'
import { number } from "prop-types";
import { Achievement, PlayerPartialInfo, Group } from 'achievement-sio';
import TrophyComponent from './TrophComponent';
import { playerAchievementCategories, getCategoryCompletionState } from 'achievement-models';
import { PlayerAchievementCategory } from 'achievement-models';
import { achievementMap } from "achievement-models";
import Modal from 'react-bootstrap4-modal'
import { Redirect, withRouter } from "react-router";
import { GroupPartialInfo } from 'achievement-sio';

interface CreateGroupComponentState {
    groupName: string
    msg: string | null
}

interface ConfigurableCreateGroupComponentProps {
    show: boolean;
    onHideCallback: () => void;
}
  
interface CreateGroupComponentProps {
    groups: GroupPartialInfo[]
}

interface CreateGroupComponentActions {
    createGroup: (name: string, cb: (err: string, group: Group) => void) => void
}

class CreateGroupComponent extends React.Component<ConfigurableCreateGroupComponentProps & CreateGroupComponentProps & CreateGroupComponentActions, CreateGroupComponentState> {

    public constructor(props) {
        super(props)
        this.state = { groupName: "", msg: null}
    }

    private handleClose() {
        this.props.onHideCallback();
        this.reset();
    }

    private reset() {
        this.setState({ groupName: "", msg: null})
    }
    private handleCreateGroup() {
        console.log("handling create group!")
        this.props.createGroup(this.state.groupName, this.onCreateGroupCallback.bind(this))
    }

    private onCreateGroupCallback(err: string, group: Group) {
        console.log("Got on create group callback?")
        console.log(err)
        console.log(group)
        if (err) {
            this.setState({ msg: err})
        } else {
            // Redirect to group page
            console.log("REDIRECTING! to " + (this.props.groups.length - 1));
            (this.props as any).history.push("/groups/id/" + (this.props.groups.length - 1));
            this.handleClose()
        }
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

    private handleNameChange(event) {
        this.setState({ "groupName": event.target.value});
    }
    private renderForm() {
        return <form>
            <div className="form-group">
                <input type="text" className="form-control" id="inputEmail3" value={this.state.groupName} onChange={this.handleNameChange.bind(this)} placeholder="Group Name" />
            </div>
        </form>;
    }

    render() { 
        let redirect = null
        let msg = null;
        if (this.state.msg) {
            msg = this.renderMessage(this.state.msg)
        }
        return <Modal visible={this.props.show} onClickBackdrop={() => this.handleClose()}>
        <div className="modal-header">
          <h5 className="modal-title highlight_text modal_title">Create Group</h5>
        </div>
        <div className="modal-body">
        {redirect}
        {msg}
        {this.renderForm()}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-danger" onClick={() => this.handleClose()}>
            Cancel
          </button>
          <button type="button" className="btn btn-success" onClick={() => this.handleCreateGroup()}>
            Create
          </button>
        </div>
      </Modal>

    }
}
   
  
  function mapStateToProps(state: AchievementState, ownProps: ConfigurableCreateGroupComponentProps): CreateGroupComponentProps {
    return {
        groups: state.player.groups
    };
  }
  
  function mapDispatchToProps(dispatch): CreateGroupComponentActions {
      return {
          createGroup: (name, cb) => dispatch(createGroupAction(name, cb))
      }
  }
  export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CreateGroupComponent) as any) as any