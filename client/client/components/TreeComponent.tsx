import * as React from "react";
import { AchievementState } from "../store";
import { connect } from 'react-redux';
import { updatePlayerInfo } from '../store/player/actions';
import { PlayerInfo, PlayerState } from '../store/player/types';
import { PlayerAchievementCategory } from 'achievement-models';
import { Treant } from 'treant-js'

interface TreeComponentProps {
 // nodes: PlayerAchievementCategory
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

class TreeComponent extends React.Component<TreeComponentProps & TreeComponentActions, {}> {

  private playerAchievementCategoriesToNodes() {
    return {}
  }

  componentDidMount() {
    const simple_chart_config: Chart = {
      chart: {
          container: "#tree-simple",
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
    const hidden = { display: "none"}

    const borderDiv = {
    }

    const border = {
      width:"64px",
      height: "auto"
    } 
  
    const champDiv = {
    }

    const champ ={ 
      position: "absolute" as any,
      left: "50%",
      top: "50%",
      zIndex: -1,
      transform: "translate(-50%, -54%)",
      width: "52px",
      height: "auto",
      borderRadius: "50%"
    }

    const center = {
    }

return <div style={divStyle}>
        <div id="tree-simple" style={divStyle} ></div>
        <div style={ hidden }>
        <span id="aatrox-0" style={center}>
          <div style={champDiv}>
            <img style={champ} src="./assets/champs/Aatrox_0.jpg"></img>
          </div>
          <div style={borderDiv}>
            <img style={border} src="./assets/borders/border_gold.png"></img>
          </div>
        </span>
        <span id="aatrox-1" style={center}>
          <div style={champDiv}>
            <img style={champ} src="./assets/champs/Aatrox_1.jpg"></img>
          </div>
          <div style={borderDiv}>
            <img style={border} src="./assets/borders/border_gold.png"></img>
          </div>
        </span>
        <span id="aatrox-2" style={center}>
          <div style={champDiv}>
            <img style={champ} src="./assets/champs/Aatrox_2.jpg"></img>
          </div>
          <div style={borderDiv}>
            <img style={border} src="./assets/borders/border_gold.png"></img>
          </div>
        </span>
        </div>
    </div>;
  }
  
}
   
  
  function mapStateToProps(state: AchievementState): TreeComponentProps {
  
    return {
      
    };
  
  }
  
  function mapDispatchToProps(dispatch): TreeComponentActions {
      return {
      }
  }
  export default connect(mapStateToProps, mapDispatchToProps)(TreeComponent)