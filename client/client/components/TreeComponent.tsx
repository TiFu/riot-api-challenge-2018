import * as React from "react";
import { AchievementState } from "../store";
import { connect } from 'react-redux';
import { updatePlayerInfo } from '../store/player/actions';
import { PlayerInfo, PlayerState } from '../store/player/types';
import { PlayerAchievementCategory, GroupAchievementCategory, AchievemenCategory, Achievement, AchievementId, AchievementGroup } from 'achievement-models';
import { Treant } from 'treant-js'

interface ConfigurableTreeComponentProps {
  achievementCategory: AchievemenCategory<any>
  achievements: Set<AchievementId>
  // nodes: PlayerAchievementCategory
  componentId: number
}

interface TreeComponentProps {

}

interface Node {
  text?: {
    name: string
  }
  image?: string
  innerHTML?: string
  children?: Node[]
}

interface ChartSettings{ 
  container: string
  hideRootNode: boolean
}

interface Chart {
  chart: ChartSettings
  nodeStructure: Node
}

interface TreeComponentActions {
}


// TODO: map AchievementCategory + Achievements to tree
class TreeComponent extends React.Component<ConfigurableTreeComponentProps & TreeComponentProps & TreeComponentActions, {}> {
  private borderMap: { [key: string]: string } = {
    "level_0": "no_border.png",
    "level_1": "bronze.png",
    "level_2": "silver.png",
    "level_3": "gold.png"
  }

  private playerAchievementCategoriesToNodes(group: AchievementGroup<any>): Node {
    const achievement = group.levels[0].id
    
    return {}
  }

  componentDidMount() {
    const simple_chart_config: Chart = {
      chart: {
          container: "#tree-simple-" + this.props.componentId,
          hideRootNode: false
      },
      nodeStructure: {
          innerHTML: "#aatrox-2",
          children: [
              {
                  innerHTML: "#aatrox-0",
              },
              {
                innerHTML: "#aatrox-1"
              }
          ]
      }
    };
    console.log("drawing tree")
    const treant = new Treant(simple_chart_config)
  }

  render() {
    const divStyle = {
      width:"100%",
      height:"100%",
    }

return <div className="full_width_height">
        <div id={"tree-simple-" + this.props.componentId} className="full_width_height" ></div>
        <div className="hidden">
        <span id="aatrox-0">
          <div>
            <img className="tree_champ_img" src="./assets/champs/Aatrox_0.jpg"></img>
          </div>
          <div>
            <img className="tree_border_img" src="./assets/borders/border_gold.png"></img>
          </div>
        </span>
        <span id="aatrox-1" >
          <div >
            <img className="tree_champ_img" src="./assets/champs/Aatrox_1.jpg"></img>
          </div>
          <div>
            <img className="tree_border_img" src="./assets/borders/border_gold.png"></img>
          </div>
        </span>
        <span id="aatrox-2" >
          <div >
            <img className="tree_champ_img" src="./assets/champs/Aatrox_2.jpg"></img>
          </div>
          <div>
            <img className="tree_border_img" src="./assets/borders/border_gold.png"></img>
          </div>
        </span>
        </div>
    </div>;
  }
  
}
   
  
  function mapStateToProps(state: AchievementState, ownProps: ConfigurableTreeComponentProps): Partial<TreeComponentProps> {
    console.log("Own Props", ownProps)
    return {
      
    };
  
  }
  
  function mapDispatchToProps(dispatch): TreeComponentActions {
      return {
      }
  }
  export default connect(mapStateToProps, mapDispatchToProps)(TreeComponent)