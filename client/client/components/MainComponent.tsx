import * as React from "react";
import { AchievementState } from "../store";
import { connect } from 'react-redux';
import { updatePlayerInfo } from '../store/player/actions';
import { PlayerInfo } from '../store/player/types'

interface MainComponentProps {
    lcu: boolean
    backend: boolean
    player?: PlayerInfo
}

interface MainComponentActions {
    dispatchGame(): () => void
}

class MainComponent extends React.Component<MainComponentProps & MainComponentActions, {}> {
    private renderPlayer() {
        if (this.props.player) {
            return this.props.player.accountId + " | " + this.props.player.platformId + " | " + this.props.player.playerName
        } else {
            return "None"
        }
    }

    render() {
      return <div>
          I am {this.props.lcu ? "" : "not"} connected to LCU!<br />
          I am {this.props.backend ? "" : "not"} connected to the backend!<br />
          <button onClick={this.props.dispatchGame}>Set summoner!</button><br />
          Summoner: {this.renderPlayer()}<br />
      </div>;
  
    }
  
  }
   
  
  function mapStateToProps(state: AchievementState): MainComponentProps {
  
    return {
  
      lcu: state.lcu.connectedToLcu,
      backend: state.lcu.connectedToFrontend,
      player: state.player.playerInfo
  
    };
  
  }
  
  function mapDispatchToProps(dispatch): MainComponentActions {
      return {
        dispatchGame: () => dispatch(updatePlayerInfo({
            "playerName": "Tifu",
            "accountId": Math.ceil(Math.random() * 10000),
            "platformId": "euw"
        }))
      }
  }
  export default connect(mapStateToProps, mapDispatchToProps)(MainComponent)