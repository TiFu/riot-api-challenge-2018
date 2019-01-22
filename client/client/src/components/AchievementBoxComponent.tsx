import * as React from "react";
import { AchievementState } from "../store";
import { connect } from 'react-redux';
import { updatePlayerInfo, acceptInvite, declineInvite, createGroupAction } from '../store/player/actions';
import { PlayerInfo, PlayerState, PlayerAchievementEntry } from '../store/player/types';
import TreeComponent from './TreeComponent'
import { number } from "prop-types";
import { PlayerPartialInfo, Group } from 'achievement-sio';
import TrophyComponent from './TrophComponent';
import { playerAchievementCategories, getCategoryCompletionState, Achievement, getObtainableIds } from 'achievement-models';
import { PlayerAchievementCategory } from 'achievement-models';
import { achievementMap } from "achievement-models";
import Modal from 'react-bootstrap4-modal'
import { Redirect, withRouter } from "react-router";
import { GroupPartialInfo } from 'achievement-sio';
import {borderMap, getBorderForLevel} from './util'
import AchievementComponent from "./AchievementComponent";
import AchievementOverviewsComponent from "./AchievementOverviewsComponent";
import { showAchievementOverview } from "../store/component/actions";
import { filterForLowestObtainableId } from "achievement-models";

interface AchievementBoxComponentState {
}

interface ConfigurableAchievementBoxComponentProps {
}
  
interface AchievementBoxComponentProps {
    playerAchievements: PlayerAchievementEntry[]
    showAchievementOverview: boolean
}

interface AchievementBoxComponentActions {
    setOverviewVisible: (visible: boolean) => void
}

class AchievementBoxComponent extends React.Component<ConfigurableAchievementBoxComponentProps & AchievementBoxComponentProps & AchievementBoxComponentActions, AchievementBoxComponentState> {

    public constructor(props) {
        super(props)
        this.state = {}
    }
    
    calculateObtainableAchievements(): { [key: string]: number[] } {
        let idArr = []
        if (this.props.playerAchievements) {
            idArr = this.props.playerAchievements.map(a => a.achievementId)
        }

        let result: { [key: string]: number[] } = {}

        const obtainedIds = new Set<number>(idArr);
        for (let categoryName in playerAchievementCategories) {
            const category: PlayerAchievementCategory = playerAchievementCategories[categoryName as any]
            let ids = getObtainableIds(category, obtainedIds)
            let idSet = new Set(ids)
            filterForLowestObtainableId(idSet, category.getFirstGroup());
            result[categoryName] = Array.from(idSet);
        }

        // filter result

        return result;
    }

    renderObtainableAchievements(map: { [key: string]: number[]}) {
        const objectives: any = []
        for (let categoryName in playerAchievementCategories) {
            const category = playerAchievementCategories[categoryName as any]
            let ids = map[categoryName]
            if (ids.length > 0) {
                let id = ids[0]
                objectives.push(<div key={categoryName} className="row achievement-box-padding"><div className="col" ><AchievementComponent icon={category.icon} achievement={achievementMap.get(id)} ></AchievementComponent></div></div>)
            }
        }
        return objectives;
    }

    render() {
        let map = this.calculateObtainableAchievements()
        let achievementComponent = null
        console.log("ACHIEVEMENT COMPONENT");
        if (this.props.showAchievementOverview) {
            console.log("ACHIEVEMENT COMPONENT JUP")
            achievementComponent = <AchievementOverviewsComponent 
                    topCategory={playerAchievementCategories["top"]}
                    jungleCategory={playerAchievementCategories["jungle"]}
                    midCategory={playerAchievementCategories["mid"]}
                    botCategory={playerAchievementCategories["adc"]}
                    supportCategory={playerAchievementCategories["support"]}
                    clownfiestaCategory={playerAchievementCategories["clownfiesta"]}

                    topAchievements={map["top"]}
                    jungleAchievements={map["jungle"]}
                    midAchievements={map["mid"]}
                    botAchievemets={map["adc"]}
                    supportAchievements={map["support"]}
                    clownfiestaAchievements={map["clownfiesta"]}
                ></AchievementOverviewsComponent>
        }
        
        return <div className="full_width_height" style={{textAlign: "center"}}>
                <div className="card achievement-box" style={{cursor: "pointer"}} onClick={() => this.props.setOverviewVisible(true)}>
                    <div className="card-body" style={{paddingLeft: "5px", paddingRight: "5px"}}>
                        <div style={{position: "absolute", top: "calc(50% - 35px)", left: "100%", zIndex: 2000 }}>
                            <span className="fas fa-caret-right" style={{fontSize: "70px"}}></span>
                        </div>
                        <h3 style={{textAlign: "center"}}>
                            <span className="highlight_text">Your Challenges</span>
                        </h3>
                        <div style={{"textAlign": "center", width: "100%"}}>
                            {this.renderObtainableAchievements(map)}
                        </div>
                    </div>
                </div>
                {achievementComponent}
            </div>       
    }
}
   
  
  function mapStateToProps(state: AchievementState, ownProps: ConfigurableAchievementBoxComponentProps): AchievementBoxComponentProps {
    return {
        playerAchievements: state.player.playerAchievements,
        showAchievementOverview: state.component.showAchievementOverviewAction
    };
  }
  
  function mapDispatchToProps(dispatch): AchievementBoxComponentActions {
      return {
          setOverviewVisible: (visible: boolean) => dispatch(showAchievementOverview(visible))
      }
  }
  export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AchievementBoxComponent) as any) as any