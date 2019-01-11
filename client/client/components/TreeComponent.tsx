import * as React from "react";
import { AchievementState } from "../store";
import { connect } from 'react-redux';
import { updatePlayerInfo } from '../store/player/actions';
import { PlayerInfo, PlayerState } from '../store/player/types';
import { PlayerAchievementCategory, GroupAchievementCategory, AchievemenCategory, Achievement, AchievementId, AchievementGroup } from 'achievement-models';
import { Treant } from 'treant-js'
import { Achievement as SIOAchievement } from 'achievement-sio'
import * as champSkinMap from '../assets/champSkinMap.json';


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

type BorderMap = {
  "level_0": string,
  "level_1": string,
  "level_2": string,
  "level_3": string
}
const borderMap: BorderMap = {
  "level_0": "./assets/borders/no_border.png",
  "level_1": "./assets/borders/border_bronze.png",
  "level_2": "./assets/borders/border_silver.png",
  "level_3": "./assets/borders/border_gold.png"
}

// TODO: map AchievementCategory + Achievements to tree
class TreeComponent extends React.Component<ConfigurableTreeComponentProps & TreeComponentProps & TreeComponentActions, {}> {

  private achievementCategoriesToNodes(group: AchievementGroup<any>, obtainedAchievements: Map<number, SIOAchievement>, nodeId: string, counter: number): NodeDescription {
    let level = -1
    let achieved = false;
    let champId = null;
    let skinId = null;
    let achievedAt = null;
    for (const i in group.levels) {
      console.log("Index: ", i);
      console.log("Achievement Id", group.levels[i].id);
      console.log(obtainedAchievements)
      if (obtainedAchievements.has(group.levels[i].id)) {
        console.log("has achievement");
        const achievement = obtainedAchievements.get(group.levels[i].id);
        achieved = true
        level = i as any;
        champId = achievement.championId
        skinId = achievement.skinId
        achievedAt = achievement.achievedAt
      }
    }
    const children = group.childAchievements.map((a, i) => this.achievementCategoriesToNodes(a, obtainedAchievements, nodeId + "-" + counter, i))
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

  componentDidMount() {
    const nodeStructure = this.achievementCategoriesToNodes(this.props.achievementCategory.getFirstGroup(), this.props.achievements, "", 0);
    const simple_chart_config: Chart = {
      chart: {
          container: "#tree-simple-" + this.props.componentId,
          hideRootNode: false
      },
      nodeStructure: nodeStructure
    };
    console.log("drawing tree")
    const treant = new Treant(simple_chart_config)
  }

  private getImgForChampAndSkinId(champId: number | null, skinId: number| null) { 
    const basePath = "./assets/champs/"
    if (champId == null || skinId == null) { // TODO: fix base placeholder
      return basePath + "Neeko_0.jpg"; 
    }
    if (champId.toString() in champSkinMap) {
      if (skinId.toString() in champSkinMap[champId.toString()]) {
        return basePath + champSkinMap[champId.toString()][skinId.toString()]
      } else {
        return basePath + champSkinMap[champId.toString()][champId.toString() + "000"];
      }
    } else { // random default lul
      console.log("Unknown champ:", champId.toString())
      return basePath + "Neeko_0.jpg";
    }
  }

  private getBorderForLevel(level: string) {
    return borderMap[level]
  }
  private getTreeNode(node: NodeDescription, id: number) {
    let gray = ""
    console.log("Level: ", node.level)
    if (!node.achieved) {
      gray = "tree_border_img_gray"
    }
    return <span id={node.cssId} key={"tree-id-" + this.props.componentId + "-" + id}>
          <div>
            <img className="tree_champ_img" src={this.getImgForChampAndSkinId(node.champId, node.skinId)}></img>
          </div>
          <div>
            <img className={"tree_border_img " + gray} src={this.getBorderForLevel("level_" + node.level)}></img>
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
    const nodes = this.achievementCategoriesToNodes(this.props.achievementCategory.getFirstGroup(), this.props.achievements, "", 0);
    const nodeDiv = this.getTreeNodes(nodes);

    return <div className="full_width_height">
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