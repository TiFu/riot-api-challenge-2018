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

interface AchievementOverviewsComponentState {
}

interface ConfigurableAchievementOverviewsComponentProps {
    icon: string;
    title: string;
    achievements: number[]
}
  
interface AchievementOverviewsComponentProps {
}

interface AchievementOverviewsComponentActions {
}

class AchievementOverviewComponent extends React.Component<ConfigurableAchievementOverviewsComponentProps & AchievementOverviewsComponentProps & AchievementOverviewsComponentActions, AchievementOverviewsComponentState> {

    render() {
        const achievements = this.props.achievements.map(a => achievementMap.get(a)).map(a => {
            return <tr>
                    <td><span className="highlight_text">{a.name}</span><br />{a.description}</td>
                </tr>
        })
        return <div className="full_width_height">
                <div style={{height: "40px"}}>
                    <h3 className="achievement_overview_simple_title" style={{fontSize: "1.5rem"}} ><img src={this.props.icon} width="25px" ></img> <span className="category_title highlight_text">{this.props.title}</span></h3>
                </div>
                <div className="overview_table overview_font">
                    <table className="table" style={{textAlign: "left"}}>
                        <thead>
                        </thead>
                        <tbody>
                            {achievements}
                        </tbody>
                    </table>
                </div>
            </div>
    }
}
   
  
  function mapStateToProps(state: AchievementState, ownProps: ConfigurableAchievementOverviewsComponentProps): AchievementOverviewsComponentProps {
    return {
    };
  }
  
  function mapDispatchToProps(dispatch): AchievementOverviewsComponentActions {
      return {
      }
  }
  export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AchievementOverviewComponent) as any) as any