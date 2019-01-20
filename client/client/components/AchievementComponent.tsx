import * as React from "react";
import { AchievementState } from "../store";
import { connect } from 'react-redux';
import { updatePlayerInfo, acceptInvite, declineInvite, createGroupAction } from '../store/player/actions';
import { PlayerInfo, PlayerState, PlayerAchievementEntry } from '../store/player/types';
import TreeComponent from './TreeComponent'
import { number } from "prop-types";
import { PlayerPartialInfo, Group } from 'achievement-sio';
import TrophyComponent from './TrophComponent';
import { playerAchievementCategories, getCategoryCompletionState, Achievement } from 'achievement-models';
import { PlayerAchievementCategory } from 'achievement-models';
import { achievementMap } from "achievement-models";
import Modal from 'react-bootstrap4-modal'
import { Redirect, withRouter } from "react-router";
import { GroupPartialInfo } from 'achievement-sio';
import {borderMap, getBorderForLevel} from './util'
interface AchievementComponentState {
}

interface ConfigurableAchievementComponentProps {
    icon: string,
    achievement: Achievement<any>
}
  
interface AchievementComponentProps {
}

interface AchievementComponentActions {
}

class AchievementComponent extends React.Component<ConfigurableAchievementComponentProps & AchievementComponentProps & AchievementComponentActions, AchievementComponentState> {

    renderIcon() {
        // getBorderForLevel("level_" + this.props.achievement.level)
        return <span style={{position: "absolute"}}>
          <div>
            <img className={"achievement_champ_img "} src={this.props.icon}></img>
          </div>
          <div>
            <img className={"achievement_border_img "} src="./assets/borders/border_square.png"></img>
          </div>
        </span>
    }
    render() {
        return <div>
                <div className="row" style={{height: "40px"}}>
                    <div className="col-4">
                        <div style={{width: "100%", position: "relative"}}>
                                {this.renderIcon()}
                        </div>                    
                    </div>
                    <div className="col-8">
                        <div style={{"display": "table", height: "100%", overflow: "hidden"}}>
                            <div style={{display: "table-cell", verticalAlign: "middle"}}>
                                <div style={{paddingLeft: "5px"}}>
                                    {this.props.achievement.name}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    }
}
   
  
  function mapStateToProps(state: AchievementState, ownProps: ConfigurableAchievementComponentProps): AchievementComponentProps {
    return {
    };
  }
  
  function mapDispatchToProps(dispatch): AchievementComponentActions {
      return {
      }
  }
  export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AchievementComponent) as any) as any