import * as React from "react";
import { AchievementState } from "../store";
import { connect } from 'react-redux';
import { updatePlayerInfo } from '../store/player/actions';
import { PlayerInfo, PlayerState } from '../store/player/types';
import TreeComponent from './TreeComponent'
import WallpaperComponent from './WallpaperComponent'

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
        return <WallpaperComponent></WallpaperComponent>
  
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