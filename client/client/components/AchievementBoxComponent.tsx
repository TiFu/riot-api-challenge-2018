import * as React from "react";
import { AchievementState } from "../store";
import { connect } from 'react-redux';
import { updatePlayerInfo, acceptInvite, declineInvite, createGroupAction } from '../store/player/actions';
import { PlayerInfo, PlayerState, PlayerAchievementEntry } from '../store/player/types';
import TreeComponent from './TreeComponent'
import { number } from "prop-types";
import { PlayerPartialInfo, Group } from 'achievement-sio';
import TrophyComponent from './TrophComponent';
import { playerAchievementCategories, getCategoryCompletionState, Achievement, getObtainableIds } from 'achievement-models';
import { PlayerAchievementCategory } from 'achievement-models';
import { achievementMap } from "achievement-models";
import Modal from 'react-bootstrap4-modal'
import { Redirect, withRouter } from "react-router";
import { GroupPartialInfo } from 'achievement-sio';
import {borderMap, getBorderForLevel} from './util'
import AchievementComponent from "./AchievementComponent";

interface AchievementBoxComponentState {
}

interface ConfigurableAchievementBoxComponentProps {
}
  
interface AchievementBoxComponentProps {
    playerAchievements: PlayerAchievementEntry[]
}

interface AchievementBoxComponentActions {
}

class AchievementBoxComponent extends React.Component<ConfigurableAchievementBoxComponentProps & AchievementBoxComponentProps & AchievementBoxComponentActions, AchievementBoxComponentState> {

    renderObtainableAchievements() {
        let idArr = []
        if (this.props.playerAchievements) {
            return idArr = this.props.playerAchievements.map(a => a.achievementId)
        }
        const obtainedIds = new Set<number>(idArr);
        const objectives: any = []
        console.log("Rendering obtainable achievements")
        for (let categoryName in playerAchievementCategories) {
            const category = playerAchievementCategories[categoryName as any]
            let ids = getObtainableIds(category, obtainedIds)
            console.log("Obtainable Ids: ", ids)
            let id = ids[Math.floor(Math.random() * ids.length)]
            objectives.push(<div className="row achievement-box-padding"><div className="col"><AchievementComponent icon={category.icon} achievement={achievementMap.get(id)} ></AchievementComponent></div></div>)
        }
        return objectives;
    }

    render() {
        return <div className="full_width_height" style={{textAlign: "center"}}>
                <div className="card achievement-box">
                    <div className="card-body">
                    <h3 style={{textAlign: "center"}}><span className="highlight_text">Your Challenges</span></h3>
                    <div style={{"textAlign": "center", width: "100%"}}>
                    {this.renderObtainableAchievements()}
                    </div>
                    </div>
                </div>
            </div>       
    }
}
   
  
  function mapStateToProps(state: AchievementState, ownProps: ConfigurableAchievementBoxComponentProps): AchievementBoxComponentProps {
    return {
        playerAchievements: state.player.playerAchievements
    };
  }
  
  function mapDispatchToProps(dispatch): AchievementBoxComponentActions {
      return {
      }
  }
  export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AchievementBoxComponent) as any) as any