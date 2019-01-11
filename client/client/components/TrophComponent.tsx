import * as React from "react";
import { AchievementState } from "../store";
import { connect } from 'react-redux';
import { AchievemenCategory } from 'achievement-models';


interface ConfigurableTrophyComponentProps {
  achievementCategory: AchievemenCategory<any>
  completionState: number // completion in percent / 100
}

interface TrophyComponentProps {

}


interface TrophyComponentActions {
}

// TODO: map AchievementCategory + Achievements to Trophy
class TrophyComponent extends React.Component<ConfigurableTrophyComponentProps & TrophyComponentProps & TrophyComponentActions, {}> {

  render() {
    const trophyImages = this.props.achievementCategory.trophyImages;
    let trophyImage = trophyImages[0].trophyImage;
    for (let i = 0; i < trophyImages.length; i++) {
        if (this.props.completionState <= trophyImages[i].completionState) {
            trophyImage = trophyImages[i].trophyImage
        }
    }
    return <div className="full_width_height">
        <img src={"./assets/trophies/" + trophyImage} className="full_width_height"></img>
    </div>
  }
  
}
   
  
  function mapStateToProps(state: AchievementState, ownProps: ConfigurableTrophyComponentProps): Partial<TrophyComponentProps> {
//    console.log("Own Props", ownProps)
    return {
      
    };
  
  }
  
  function mapDispatchToProps(dispatch): TrophyComponentActions {
      return {
      }
  }
  export default connect(mapStateToProps, mapDispatchToProps)(TrophyComponent)