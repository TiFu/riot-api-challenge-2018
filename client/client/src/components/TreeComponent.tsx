import * as React from "react";
import { AchievementState } from "../store";
import { connect } from 'react-redux';
import { updatePlayerInfo } from '../store/player/actions';
import { PlayerInfo, PlayerState } from '../store/player/types';
import { PlayerAchievementCategory, GroupAchievementCategory, AchievemenCategory, Achievement, AchievementId, AchievementGroup } from 'achievement-models';
import { Treant } from 'treant-js'
import { Achievement as SIOAchievement } from 'achievement-sio'
import * as champSkinMap from '../assets/champSkinMap.json';
import {borderMap, getBorderForLevel } from './util'

interface ConfigurableTreeComponentProps {
  achievementCategory: AchievemenCategory<any>
  achievements: Map<number, SIOAchievement>
  // nodes: PlayerAchievementCategory
  componentId: string
}

interface TreeComponentProps {

}

interface Node {
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

interface NodeDescription extends Node {
  innerHTML: string
  cssId: string
  achieved: boolean,
  champId: number | null 
  skinId: number | null
  level: number
  achievedAt: Date | null
  achievementGroup: AchievementGroup<any>
  children: NodeDescription[]
  // TODO: more description stuff
}


// TODO: map AchievementCategory + Achievements to tree
class TreeComponent extends React.Component<ConfigurableTreeComponentProps & TreeComponentProps & TreeComponentActions, {}> {
  private treant: any;

  public constructor(props) {
    super(props);
    window.addEventListener("resize", () => {
      this.drawTree()
    })
  }

  private achievementCategoriesToNodes(group: AchievementGroup<any>, obtainedAchievements: Map<number, SIOAchievement>, nodeId: string, counter: number, recurse: boolean = true): NodeDescription {
    let level = -1
    let achieved = false;
    let champId = null;
    let skinId = null;
    let achievedAt = null;
    for (const i in group.levels) {
      if (obtainedAchievements.has(group.levels[i].id)) {
        const achievement = obtainedAchievements.get(group.levels[i].id);
        achieved = true
        level = i as any;
        champId = achievement.championId
        skinId = achievement.skinId
        achievedAt = achievement.achievedAt
      }
    }
    let children = []
    if (achieved) {
      children = group.childAchievements.map((a, i) => this.achievementCategoriesToNodes(a, obtainedAchievements, nodeId + "-" + counter, i, achieved))
    }
    const cssId = "tree-node-" + this.props.componentId + nodeId + "-" + counter;
    return {
      innerHTML: "#" + cssId,
      cssId: cssId,
      children: children,
      champId: champId,
      achieved: achieved,
      skinId: skinId,
      level: level,
      achievedAt: achievedAt,
      achievementGroup: group
    }
  }

  componentDidUpdate() {
    this.drawTree()
  }

  componentDidMount() {
    this.drawTree()
  }

  private drawTree() {
    console.log("REMOUNTED TREE COMPONENT")
    const nodeStructure = this.achievementCategoriesToNodes(this.props.achievementCategory.getFirstGroup(), this.props.achievements, "", 0);
    
    const simple_chart_config: Chart = {
      chart: {
          container: "#tree-simple-" + this.props.componentId,
          hideRootNode: false
      },
      nodeStructure: nodeStructure
    };
    console.log("drawing tree")
    if (this.treant) {
      this.treant.destroy();
    }
    this.treant = new Treant(simple_chart_config)
  }

  private getImgForChampAndSkinId(champId: number | null, skinId: number| null) { 
    const basePath = "./assets/champs/"
    console.log("ChampId", champId, "SkinID: ", skinId);
    if (champId != null && champId.toString() in champSkinMap) {
      if (skinId != null && skinId.toString() in champSkinMap[champId.toString()]) {
        console.log("using normal skin")
        return basePath + champSkinMap[champId.toString()][skinId.toString()]
      } else {
        console.log("Defaulting to base skin")
        return basePath + champSkinMap[champId.toString()][champId.toString() + "000"];
      }
    } else { // random default lul
      console.log("Unknown champ:", champId)
      return basePath + "Neeko_0.jpg";
    }
  }

  private getTreeNode(node: NodeDescription, id: number) {
    let gray = ""
    console.log("Level: ", node.level)
    if (!node.achieved) {
      gray = "tree_border_img_gray"
    }
    let icon = "./assets/padlock.png"
    if (node.achieved) {
      icon = this.getImgForChampAndSkinId(node.champId, node.skinId)
    }
    return <span id={node.cssId} key={"tree-id-" + this.props.componentId + "-" + id}>
          <div>
            <img className={"tree_champ_img " + gray} src={icon}></img>
          </div>
          <div>
            <img className={"tree_border_img " + gray} src={getBorderForLevel("level_" + node.level)}></img>
          </div>
        </span>
  }

  private recursiveGetTreeNodes(node: NodeDescription, nodes: JSX.Element[], id: number = 0): number {
    nodes.push(this.getTreeNode(node, id));
    id++
    for (const child of node.children) {
      id = this.recursiveGetTreeNodes(child, nodes, id);
    }
    return id;
  }

  private getTreeNodes(root: NodeDescription) {
    const treeNodes = [];
    this.recursiveGetTreeNodes(root, treeNodes)
    return <div className="hidden">
      {treeNodes}
    </div>

  }

  render() {
    console.log("UPDATED TREE COMPONENT!")
    const nodes = this.achievementCategoriesToNodes(this.props.achievementCategory.getFirstGroup(), this.props.achievements, "", 0);
    const nodeDiv = this.getTreeNodes(nodes);

    return <div className="full_width_height tree_component">
        <div id={"tree-simple-" + this.props.componentId} className="full_width_height" ></div>
        {nodeDiv}
    </div>;
  }
  
}
   
  
  function mapStateToProps(state: AchievementState, ownProps: ConfigurableTreeComponentProps): Partial<TreeComponentProps> {
//    console.log("Own Props", ownProps)
    return {
      
    };
  
  }
  
  function mapDispatchToProps(dispatch): TreeComponentActions {
      return {
      }
  }
  export default connect(mapStateToProps, mapDispatchToProps)(TreeComponent)