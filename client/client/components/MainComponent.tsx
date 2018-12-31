import * as React from "react";
import { AchievementState } from "../store";
import { connect } from 'react-redux';
import { updatePlayerInfo } from '../store/player/actions';
import { PlayerInfo, PlayerState } from '../store/player/types';

interface MainComponentProps {
    lcu: boolean
    backend: boolean
    player?: PlayerState
}

interface MainComponentActions {
    dispatchNewSummoner(): () => void
}

class MainComponent extends React.Component<MainComponentProps & MainComponentActions, {}> {
    private renderPlayer() {
        if (this.props.player) {
            return JSON.stringify(this.props.player)
        } else {
            return "None"
        }
    }

    render() {
      return <div>
          I am {this.props.lcu ? "" : "not"} connected to LCU!<br />
          I am {this.props.backend ? "" : "not"} connected to the backend!<br />
          <button onClick={this.props.dispatchNewSummoner}>Set summoner!</button><br />
          Summoner: {this.renderPlayer()}<br />
      </div>;
  
    }
  
  }
   
  
  function mapStateToProps(state: AchievementState): MainComponentProps {
  
    return {
  
      lcu: state.lcu.connectedToLcu,
      backend: state.lcu.connectedToFrontend,
      player: state.player
  
    };
  
  }
  
  function mapDispatchToProps(dispatch): MainComponentActions {
      return {
        dispatchNewSummoner: () => dispatch(updatePlayerInfo({
            "playerName": "Tifu",
            "accountId": Math.ceil(Math.random() * 10000),
            "platformId": "euw"
        }))
      }
  }
  export default connect(mapStateToProps, mapDispatchToProps)(MainComponent)