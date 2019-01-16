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
    achievements: number[]
    title?: string
    icon?: string
}
  
interface AchievementComponentProps {

}



interface AchievementComponentActions {
}

class AchievementComponent extends React.Component<ConfigurableAchievementComponentProps & AchievementComponentProps & AchievementComponentActions, {}> {

    render() { 
        const achievements = this.props.achievements.map((m, idx) => {
            const achievement = achievementMap.get(m);
            return <tr key={achievement.id}>
            <th scope="row"><img src={achievement.icon} width="32px"></img> {achievement.name}</th>
            <th scope="row">{achievement.description}</th>
            </tr>
        })
        return <div>
                    <h1><i className={"fas fa-" + (this.props.icon || "trophy")}></i> {this.props.title || "Achievements"}</h1>
                    <table className="table">
                    <thead>
                        <tr>
                        <th scope="col" >Achievement</th>
                        <th scope="col">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {achievements}
                    </tbody>
                    </table>                    
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