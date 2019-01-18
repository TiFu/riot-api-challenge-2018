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

interface PlayerSearchComponentState {
    searchString: string;

}

interface ConfigurablePlayerSearchComponentProps {
}
  
interface PlayerSearchComponentProps {

}



interface PlayerSearchComponentActions {
}

class PlayerSearchComponent extends React.Component<ConfigurablePlayerSearchComponentProps & PlayerSearchComponentProps & PlayerSearchComponentActions, PlayerSearchComponentState> {

    constructor(props) {
        super(props)
        this.state = { searchString: "" }
    }

    render() { 
        return <div></div>
    }
  
}
   
  
  function mapStateToProps(state: AchievementState, ownProps: ConfigurablePlayerSearchComponentProps): PlayerSearchComponentProps {
    return {
    };
  }
  
  function mapDispatchToProps(dispatch): PlayerSearchComponentActions {
      return {}
  }
  export default connect(mapStateToProps, mapDispatchToProps)(PlayerSearchComponent)