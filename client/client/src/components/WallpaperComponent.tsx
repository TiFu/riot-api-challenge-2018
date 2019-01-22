import * as React from "react";
import { AchievementState } from "../store";
import { connect } from 'react-redux';
import { updatePlayerInfo } from '../store/player/actions';
import { PlayerInfo, PlayerState, PlayerAchievementEntry } from '../store/player/types';
import TreeComponent from './TreeComponent'
import { groupAchievementCategories } from "achievement-models";
import { number } from "prop-types";
import { Achievement } from 'achievement-sio';
import TrophyComponent from './TrophComponent';
import { playerAchievementCategories, getCategoryCompletionState } from 'achievement-models';
import { GroupPartialInfo } from 'achievement-sio';
import { PlayerAchievementCategory } from 'achievement-models';

interface WallpaperComponentProps {
    groups: GroupPartialInfo[]
    playerAchievements: PlayerAchievementEntry[]
}

interface WallpaperComponentActions {
}

class WallpaperComponent extends React.Component<WallpaperComponentProps & WallpaperComponentActions, {}> {

    private getGroupWithHighestCompletionState(): { "completionState": number, "group": GroupPartialInfo | null} {
        if (!this.props.groups) {
            return { "completionState": -1, "group": null};
        }
        return this.props.groups.reduce((prev, g) => {
            const completionState = getCategoryCompletionState(groupAchievementCategories[0], new Set<number>(g.achievements.map(a => a.achievementId)));
            if (completionState > prev["completionState"]) {
                return { "completionState": completionState, "group": g}
            } else {
                return prev;
            }
        }, { "completionState": -1, "group": null})
    }

    private getMapFromAchievements(achievements: Achievement[]) {
        const map = new Map<number, Achievement>();
        achievements.forEach(a => map.set(a.achievementId, a));
        return map;
    }

    private getMapFromPlayerAchievements(achievements: PlayerAchievementEntry[]) {
        const map = new Map<number, Achievement>();
        if (achievements !== undefined) {
            achievements.forEach(a => map.set(a.achievementId, {
                "achievedAt": a.achievedAt.toString(),
                "championId": a.champId,
                "skinId": a.skinId,
                "achievementId": a.achievementId
            }));
        }
        return map;
    }

    private getDataFromPlayerAchievement(category: PlayerAchievementCategory): [PlayerAchievementCategory, number] {
        if (this.props.playerAchievements) {
            const completionState = getCategoryCompletionState(category, new Set<number>(this.props.playerAchievements.map(p => p.achievementId)))
            const achievements = this.getMapFromPlayerAchievements(this.props.playerAchievements);

            return [category, completionState]
        } else {
            return [category, 0]
        }
    }

    private getTopColumn(playerAchievements: Map<number, Achievement>) {
        const groupState = this.getGroupWithHighestCompletionState()
        const group = groupState["group"];
        let groupAchievements = new Map<number, Achievement>();
        let groupTree = <span className="wallpaper-placeholder-span">Join a group with at least 5 members to unlock the first group achievement!</span>;
        let groupTrophy = null;
        let groupWall = [<div className="col-6 wallpaper-center-text" key={"group_placeholder"}>{groupTree}</div>]
        if (group != null) {
            groupAchievements = this.getMapFromAchievements(group.achievements);
            groupTree = <TreeComponent achievements={groupAchievements} achievementCategory={groupAchievementCategories[0]}  componentId={"group"}> </TreeComponent>            
            groupTrophy = <TrophyComponent completionState={groupState.completionState} achievementCategory={groupAchievementCategories[0]} />
            groupWall = [<div className="col-3 wallpaper-centerd" key={"group_tree"}>
                {groupTree}
            </div>,
            <div className="col-3 wallpaper-centerd trophy_top" key={"group_trophy"}>
                {groupTrophy}
            </div>]

        }

        const [clownfiesta, clownfiestaCompletionState]  = this.getDataFromPlayerAchievement(playerAchievementCategories["clownfiesta"])


        return <div className="wallpaper-80">
            <div className="row full_width_height">
                {groupWall}
                <div className="col-3 wallpaper-centerd trophy_top">
                    <TrophyComponent completionState={clownfiestaCompletionState} achievementCategory={clownfiesta} />
                </div>
                <div className="col-3 wallpaper-centerd">
                <TreeComponent achievements={playerAchievements} achievementCategory={clownfiesta}  componentId={"clownfiesta"}> </TreeComponent>
                </div>
            </div>
        </div>
    }

    private getRoleTrees(playerAchievements: Map<number, Achievement>) {
        const trees = []
        for (const lane of ["top", "jungle", "mid", "adc", "support"]) {
            trees.push(<div key={lane} className="col wallpaper-centerd" style={{width: "20%"}}>
                <TreeComponent achievements={playerAchievements} achievementCategory={playerAchievementCategories[lane]}  componentId={lane}> </TreeComponent>
            </div>
            )
        }
        return <div className="row row-one-third">
                {trees}
            </div>
    }

    private getRoleTrophies(playerAchievements: Map<number, Achievement>) {
        const trophies = []
        const keys = new Set<number>(playerAchievements.keys());
        for (const lane of ["top", "jungle", "mid", "adc", "support"]) {
            const completionState = getCategoryCompletionState(playerAchievementCategories[lane], keys)
            trophies.push(<div key={lane} className="col wallpaper-centerd trophy_col">
                <TrophyComponent completionState={completionState} achievementCategory={playerAchievementCategories[lane]} />
            </div>
            )
        }
        return <div className="row row-one-third">
                {trophies}
            </div>
    }

    render() { 
        const playerAchievements = this.getMapFromPlayerAchievements(this.props.playerAchievements)

        const completionState = 1.0
        return <div className="wallpaper_background full_width_height">
            <div className="full_width_height wallpaper-padding">
                <div className="row row-one-third">
                    <div className="wallpaper-10"></div>
                        {this.getTopColumn(playerAchievements)}
                    <div className="wallpaper-10"></div>
                </div>
                    {this.getRoleTrees(playerAchievements)}
                    {this.getRoleTrophies(playerAchievements)}
            </div>
        </div>;
    }
  
  }
   
  
  function mapStateToProps(state: AchievementState): WallpaperComponentProps {
  
    return {
        groups: state.player.groups,
        "playerAchievements": state.player.playerAchievements
    };
  
  }
  
  function mapDispatchToProps(dispatch): WallpaperComponentActions {
      return {}
  }
  export default connect(mapStateToProps, mapDispatchToProps)(WallpaperComponent)