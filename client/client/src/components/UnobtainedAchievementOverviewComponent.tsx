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
import { GroupAchievementCategory } from 'achievement-models';
import { filterForLowestObtainableId } from 'achievement-models';

interface ConfigurableAchievementComponentProps {
    achievementCategory: GroupAchievementCategory
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
        let idSet = new Set(this.props.achievements.map(a => a))
        filterForLowestObtainableId(idSet, this.props.achievementCategory.getFirstGroup());
        const achievements = Array.from(idSet).map((m, idx) => {
            const achievement = achievementMap.get(m);
            return <tr key={achievement.id}>
            <td scope="row">{achievement.name}</td>
            <td scope="row">{achievement.description}</td>
            </tr>
        })
        return <div className="group_achieve_div">
                    <h1><i className={"fas fa-" + (this.props.icon || "trophy")}></i> {this.props.title || "Achievements"}<br /><span className="small_text">Group Achievements can only be completed as a team of 5 in matchmade games on Summoner's Rift.</span></h1>
                    <div className="group_achieve_table">
                        <table className="table">
                        <thead>
                            <tr>
                            <th scope="col">Achievement</th>
                            <th scope="col">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {achievements}
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