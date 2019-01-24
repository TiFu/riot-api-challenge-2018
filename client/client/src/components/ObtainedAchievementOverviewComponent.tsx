import * as React from "react";
import { AchievementState } from "../store";
import { connect } from 'react-redux';
import { updatePlayerInfo } from '../store/player/actions';
import { PlayerInfo, PlayerState, PlayerAchievementEntry } from '../store/player/types';
import TreeComponent from './TreeComponent'
import { number } from "prop-types";
import { Achievement, PlayerPartialInfo } from 'achievement-sio';
import TrophyComponent from './TrophComponent';
import { playerAchievementCategories, getCategoryCompletionState } from 'achievement-models';
import { PlayerAchievementCategory } from 'achievement-models';
import { achievementMap } from "achievement-models";

interface ConfigurableAchievementComponentProps {
    achievements: Achievement[]
    title?: string
    icon?: string
}
  
interface AchievementComponentProps {

}



interface AchievementComponentActions {
}

class AchievementComponent extends React.Component<ConfigurableAchievementComponentProps & AchievementComponentProps & AchievementComponentActions, {}> {

    render() { 
        const Achievements = this.props.achievements.sort((a, b) => {
            return Date.parse(b.achievedAt) - Date.parse(a.achievedAt)
        }).map((m, idx) => {
            const achievement = achievementMap.get(m.achievementId);
            return <tr key={m.achievementId}>
            <td scope="row">{new Date(Date.parse(m.achievedAt)).toLocaleString("en-US", { year: "2-digit", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"})}</td>
            <td scope="row">{achievement.name}</td>
            <td>{achievement.description}</td>
            </tr>
        })
        return <div className="group_achieve_div">
                    <h1><i className={"fas fa-" + (this.props.icon || "trophy")}></i> {this.props.title || "Achievements"}</h1>
                    <div className="group_achieve_less_pad">
                        <table className="table">
                        <thead>
                            <tr>
                            <th scope="col" className="first_column_group">Date</th>
                            <th scope="col">Achievement</th>
                            <th scope="col">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Achievements}
                        </tbody>
                        </table>
                    </div>                    
            </div>
    }
  
}
   
  
  function mapStateToProps(state: AchievementState, ownProps: ConfigurableAchievementComponentProps): AchievementComponentProps {
    return {
    };
  }
  
  function mapDispatchToProps(dispatch): AchievementComponentActions {
      return {}
  }
  export default connect(mapStateToProps, mapDispatchToProps)(AchievementComponent)