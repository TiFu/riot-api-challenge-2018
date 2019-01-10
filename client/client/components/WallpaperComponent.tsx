import * as React from "react";
import { AchievementState } from "../store";
import { connect } from 'react-redux';
import { updatePlayerInfo } from '../store/player/actions';
import { PlayerInfo, PlayerState } from '../store/player/types';
import TreeComponent from './TreeComponent'
interface WallpaperComponentProps {
}

interface WallpaperComponentActions {
}

class WallpaperComponent extends React.Component<WallpaperComponentProps & WallpaperComponentActions, {}> {

    render() { 
        return <div className="background full_width_height">
            <div className="full_width_height wallpaper-padding">
                <div className="row row-one-third">
                    <div className="wallpaper-10"></div>
                    <div className="wallpaper-80">
                        <div className="row full_width_height">
                            <div className="col wallpaper-centerd">
                                <TreeComponent componentId={3}> </TreeComponent>
                            </div>
                            <div className="col wallpaper-centerd">
                                <img src="./assets/trophies/trophies.png" className="full_width_height"></img>
                            </div>
                            <div className="col wallpaper-centerd">
                                <img src="./assets/trophies/trophies.png" className="full_width_height"></img>
                            </div>
                            <div className="col wallpaper-centerd">
                            <TreeComponent componentId={4}> </TreeComponent>
                            </div>
                        </div>
                    </div>
                    <div className="wallpaper-10"></div>
                </div>
                <div className="row row-one-third">
                    <div className="col wallpaper-centerd">
                        <TreeComponent componentId={5}> </TreeComponent>
                    </div>
                    <div className="col wallpaper-centerd">
                        <TreeComponent componentId={6}> </TreeComponent>
                    </div>
                    <div className="col wallpaper-centerd">
                        <TreeComponent componentId={7}> </TreeComponent>
                    </div>
                    <div className="col wallpaper-centerd">
                        <TreeComponent componentId={8}> </TreeComponent>
                    </div>
                    <div className="col wallpaper-centerd">
                        <TreeComponent componentId={9}> </TreeComponent>
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