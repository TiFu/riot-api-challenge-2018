import * as React from "react";
import { AchievementState } from "../store";
import { connect } from 'react-redux';
import { updatePlayerInfo } from '../store/player/actions';
import { PlayerInfo, PlayerState } from '../store/player/types';
import TreeComponent from './TreeComponent'

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
        const divStyle = {"width": "100%", height:"100%"}
        return <div style={divStyle}>
            <TreeComponent></TreeComponent>
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