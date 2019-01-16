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
import MemberComponent from './MemberComponent'
import GroupComponent from "./GroupComponent";

interface DropdownComponentsState {
    selectedOptionIdx: number
    isOpen: boolean;
}

interface ConfigurableDropdownComponentProps {
    options: string[]
    onSelectCallback: (idx: number) => void;
    buttonStyle?:  string;
    titleStyle?: string;
    optionStyle?: string;
}
  
interface DropdownComponentProps {
}



interface DropdownComponentActions {
}

class DropdownComponent extends React.Component<ConfigurableDropdownComponentProps & DropdownComponentProps & DropdownComponentActions, DropdownComponentsState> {

    public constructor(props) {
        super(props);
        this.state = { selectedOptionIdx: 0, isOpen: false };
    }

    newDropdownelected(event) {
        this.setState({ "selectedOptionIdx": event.target.value})
    }

    private toggleOpen() {
        this.setState( { "isOpen": !this.state.isOpen})
    }

    private onSelect(idx: number) {
        this.setState({ "isOpen": false, "selectedOptionIdx": idx})
        this.props.onSelectCallback(idx);
    }
    render() {       
        const options = this.props.options.map((o, idx) => <a key={o} className="dropdown-item hover" onClick={() => this.onSelect(idx)}><span className={this.props.optionStyle}>{o}</span></a>        );
        return <div className={"dropdown btn-group "}>
        <a className={"dropdown-toggle " + this.props.buttonStyle} onClick={() => this.toggleOpen()} role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <span className={this.props.titleStyle}>{this.props.options[this.state.selectedOptionIdx]}</span>
        </a>
        <div className={"dropdown_background dropdown-menu" + (this.state.isOpen ? " show" : "")} aria-labelledby="dropdownMenuLink">
            {options}
        </div>
      </div>

    }
  
}
   
  
  function mapStateToProps(state: AchievementState, ownProps: ConfigurableDropdownComponentProps): DropdownComponentProps {
    return {
    };
  }
  
  function mapDispatchToProps(dispatch): DropdownComponentActions {
      return {}
  }
  export default connect(mapStateToProps, mapDispatchToProps)(DropdownComponent)