import * as React from "react";
import { AchievementState } from "../store";
import { connect } from 'react-redux';
import { updatePlayerInfo } from '../store/player/actions';
import { PlayerInfo, PlayerState } from '../store/player/types';
import TreeComponent from './TreeComponent'
import { groupAchievementCategories } from "achievement-models";
import { number } from "prop-types";
import { Achievement } from 'achievement-sio';
interface WallpaperComponentProps {
}

interface WallpaperComponentActions {
}

class WallpaperComponent extends React.Component<WallpaperComponentProps & WallpaperComponentActions, {}> {

    render() { 
        const group = groupAchievementCategories[0];
        const achievements = new Map<number, Achievement>();
       achievements.set(2, {
            achievementId: 2,
            championId: 18,
            skinId: 18003,
            achievedAt: (new Date()).toString()
        })
        achievements.set(3, {
            achievementId: 3,
            championId: 1,
            skinId: 1000,
            achievedAt: (new Date()).toString()
        })
        return <div className="background full_width_height">
            <div className="full_width_height wallpaper-padding">
                <div className="row row-one-third">
                    <div className="wallpaper-10"></div>
                    <div className="wallpaper-80">
                        <div className="row full_width_height">
                            <div className="col wallpaper-centerd">
                                <TreeComponent achievements={achievements} achievementCategory={group}  componentId={3}> </TreeComponent>
                            </div>
                            <div className="col wallpaper-centerd">
                                <img src="./assets/trophies/trophies.png" className="full_width_height"></img>
                            </div>
                            <div className="col wallpaper-centerd">
                                <img src="./assets/trophies/trophies.png" className="full_width_height"></img>
                            </div>
                            <div className="col wallpaper-centerd">
                            <TreeComponent achievements={achievements} achievementCategory={group}  componentId={4}> </TreeComponent>
                            </div>
                        </div>
                    </div>
                    <div className="wallpaper-10"></div>
                </div>
                <div className="row row-one-third">
                    <div className="col wallpaper-centerd">
                        <TreeComponent achievements={achievements} achievementCategory={group}  componentId={5}> </TreeComponent>
                    </div>
                    <div className="col wallpaper-centerd">
                        <TreeComponent achievements={achievements} achievementCategory={group}  componentId={6}> </TreeComponent>
                    </div>
                    <div className="col wallpaper-centerd">
                        <TreeComponent achievements={achievements} achievementCategory={group}  componentId={7}> </TreeComponent>
                    </div>
                    <div className="col wallpaper-centerd">
                        <TreeComponent achievements={achievements} achievementCategory={group}  componentId={8}> </TreeComponent>
                    </div>
                    <div className="col wallpaper-centerd">
                        <TreeComponent achievements={achievements} achievementCategory={group}  componentId={9}> </TreeComponent>
                    </div>
                </div>
                <div className="row row-one-third">
                    <div className="col wallpaper-centerd">
                        <img src="./assets/trophies/trophies.png" className="full_width_height"></img>
                    </div>
                    <div className="col wallpaper-centerd">
                        <img src="./assets/trophies/trophies.png" className="full_width_height"></img>
                    </div>
                    <div className="col wallpaper-centerd">
                        <img src="./assets/trophies/trophies.png" className="full_width_height"></img>
                    </div>
                    <div className="col wallpaper-centerd">
                        <img src="./assets/trophies/trophies.png" className="full_width_height"></img>
                    </div>
                    <div className="col wallpaper-centerd">
                        <img src="./assets/trophies/trophies.png" className="full_width_height"></img>
                    </div>
                </div>
            </div>
        </div>;
    }
  
  }
   
  
  function mapStateToProps(state: AchievementState): WallpaperComponentProps {
  
    return {
  
      lcu: state.lcu.connectedToLcu,
      backend: state.lcu.connectedToFrontend,
      player: state.player
  
    };
  
  }
  
  function mapDispatchToProps(dispatch): WallpaperComponentActions {
      return {}
  }
  export default connect(mapStateToProps, mapDispatchToProps)(WallpaperComponent)