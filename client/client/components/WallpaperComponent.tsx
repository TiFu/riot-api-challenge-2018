import * as React from "react";
import { AchievementState } from "../store";
import { connect } from 'react-redux';
import { updatePlayerInfo } from '../store/player/actions';
import { PlayerInfo, PlayerState } from '../store/player/types';
import TreeComponent from './TreeComponent'
import { groupAchievementCategories } from "achievement-models";
import { number } from "prop-types";
import { Achievement } from 'achievement-sio';
import TrophyComponent from './TrophComponent';

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
        const completionState = 1.0
        return <div className="background full_width_height">
            <div className="full_width_height wallpaper-padding">
                <div className="row row-one-third">
                    <div className="wallpaper-10"></div>
                    <div className="wallpaper-80">
                        <div className="row full_width_height">
                            <div className="col wallpaper-centerd">
                                <TreeComponent achievements={achievements} achievementCategory={group}  componentId={"group"}> </TreeComponent>
                            </div>
                            <div className="col wallpaper-centerd">
                                <TrophyComponent completionState={completionState} achievementCategory={group} />
                            </div>
                            <div className="col wallpaper-centerd">
                                <TrophyComponent completionState={completionState} achievementCategory={group} />
                            </div>
                            <div className="col wallpaper-centerd">
                            <TreeComponent achievements={achievements} achievementCategory={group}  componentId={"clownfiesta"}> </TreeComponent>
                            </div>
                        </div>
                    </div>
                    <div className="wallpaper-10"></div>
                </div>
                <div className="row row-one-third">
                    <div className="col wallpaper-centerd">
                        <TreeComponent achievements={achievements} achievementCategory={group}  componentId={"top"}> </TreeComponent>
                    </div>
                    <div className="col wallpaper-centerd">
                        <TreeComponent achievements={achievements} achievementCategory={group}  componentId={"jungle"}> </TreeComponent>
                    </div>
                    <div className="col wallpaper-centerd">
                        <TreeComponent achievements={achievements} achievementCategory={group}  componentId={"mid"}> </TreeComponent>
                    </div>
                    <div className="col wallpaper-centerd">
                        <TreeComponent achievements={achievements} achievementCategory={group}  componentId={"adc"}> </TreeComponent>
                    </div>
                    <div className="col wallpaper-centerd">
                        <TreeComponent achievements={achievements} achievementCategory={group}  componentId={"support"}> </TreeComponent>
                    </div>
                </div>
                <div className="row row-one-third">
                    <div className="col wallpaper-centerd">
                        <TrophyComponent completionState={completionState} achievementCategory={group} />
                    </div>
                    <div className="col wallpaper-centerd">
                        <TrophyComponent completionState={completionState} achievementCategory={group} />
                    </div>
                    <div className="col wallpaper-centerd">
                        <TrophyComponent completionState={completionState} achievementCategory={group} />
                    </div>
                    <div className="col wallpaper-centerd">
                        <TrophyComponent completionState={completionState} achievementCategory={group} />
                    </div>
                    <div className="col wallpaper-centerd">
                        <TrophyComponent completionState={completionState} achievementCategory={group} />
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