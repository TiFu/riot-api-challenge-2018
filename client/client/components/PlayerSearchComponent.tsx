import * as React from "react";
import { AchievementState } from "../store";
import { connect } from 'react-redux';
import { updatePlayerInfo, searchPlayerAction } from '../store/player/actions';
import { PlayerInfo, PlayerState, PlayerAchievementEntry } from '../store/player/types';
import TreeComponent from './TreeComponent'
import { number } from "prop-types";
import { Achievement, PlayerPartialInfo, GroupPlayerPartialInfo } from 'achievement-sio';
import TrophyComponent from './TrophComponent';
import { playerAchievementCategories, getCategoryCompletionState } from 'achievement-models';
import { PlayerAchievementCategory } from 'achievement-models';
import Modal from 'react-bootstrap4-modal'
import Autosuggest from 'react-autosuggest';

interface PlayerSearchComponentState {
    seachString: string
    suggestions: PlayerPartialInfo[]
    selectedValue: PlayerPartialInfo
    msg: string
}

interface ConfigurablePlayerSearchComponentProps {
    region: string
    onChange: (player: PlayerPartialInfo) => void
    player: PlayerPartialInfo
}
  
interface PlayerSearchComponentProps {

}



interface PlayerSearchComponentActions {
    fetchSuggestions: (searchString: string, region: string, cb: (err: string, data: PlayerPartialInfo[]) => void) => void
}

class PlayerSearchComponent extends React.Component<ConfigurablePlayerSearchComponentProps & PlayerSearchComponentProps & PlayerSearchComponentActions, PlayerSearchComponentState> {

    constructor(props) {
        super(props)
        this.state = { seachString: "", suggestions: [], selectedValue: null, msg: null }
    }

    public componentWillReceiveProps(nextProps) {
        if  (nextProps.player == null && this.state.selectedValue != null) {
            this.setState({selectedValue:  null, seachString: ""})
        }
    }
    private fetchSuggestions(value: string) {
        this.setState({seachString: value["value"]})
        console.log("Search String ", value) 
        console.log("Region: ", this.props.region)
        this.props.fetchSuggestions(value["value"], this.props.region, this.searchPlayerCallback.bind(this))

    }

    private searchPlayerCallback(err: string, data: PlayerPartialInfo[]) {
        if (err) {
            this.setState({msg: err})
        } else {
            this.updateSuggestions(data)
        }
    }

    private updateSuggestions(players: PlayerPartialInfo[]){ 
        console.log("Updating suggestions!", players)
        this.setState({suggestions: players, msg: null})
    }

    private clearSuggestions() {
        console.log("Clearing suggestinos")
        this.updateSuggestions([])
    }

    private getSuggestionValue(data: PlayerPartialInfo) {
        console.log("Returning suggestion value")
        return data.name.toString();
    }

    private renderSuggestion(data: PlayerPartialInfo) {
        console.log("rendering ")
        return   <div>
        {data.name}
      </div>
    }

    private handleOnChange(event, newValue) {
        console.log(newValue)
        console.log("New Value: ", newValue["newValue"])
        const player = this.state.suggestions.find(x => x.name == newValue["newValue"])
        this.setState({ seachString: newValue["newValue"], selectedValue: player})
        this.props.onChange(player);
    }

    
    private renderMessage(m: string) {
        const icon = <i className="fas fa-exclamation-triangle"></i>;
        return <div className={"alert alert-" + "danger"} role="alert">
                <div className="row  align-items-center">
                <div className="col-auto">
                    {icon}
                </div>
                <div className="col">
                    {m}
                </div>
            </div>
      </div>
    }

    render() { 
        let msg = null
        if (this.state.msg) {
            msg = this.renderMessage(this.state.msg)
        }
        let theme = {
            "input": "react-autosuggest__input form-control",
            container:                'react-autosuggest__container',
            containerOpen:            'react-autosuggest__container--open',
            inputOpen:                'react-autosuggest__input--open',
            inputFocused:             'react-autosuggest__input--focused',
            suggestionsContainer:     'react-autosuggest__suggestions-container',
            suggestionsContainerOpen: 'react-autosuggest__suggestions-container--open',
            suggestionsList:          'react-autosuggest__suggestions-list',
            suggestion:               'react-autosuggest__suggestion',
            suggestionFirst:          'react-autosuggest__suggestion--first',
            suggestionHighlighted:    'react-autosuggest__suggestion--highlighted',
            sectionContainer:         'react-autosuggest__section-container',
            sectionContainerFirst:    'react-autosuggest__section-container--first',
            sectionTitle:             'react-autosuggest__section-title'
        }
        return <div>{msg}
            <Autosuggest
            onSuggestionsFetchRequested={this.fetchSuggestions.bind(this)}
            onSuggestionsClearRequested={this.clearSuggestions.bind(this)}
            getSuggestionValue={this.getSuggestionValue.bind(this)}
            renderSuggestion={this.renderSuggestion.bind(this)}
            suggestions={this.state.suggestions}
            theme={theme}
            inputProps={{
                onChange: this.handleOnChange.bind(this),
                value: this.state.seachString,
                placeholder: "Type name to search player"
            }}
            ></Autosuggest></div>
    }
  
}
   
  
  function mapStateToProps(state: AchievementState, ownProps: ConfigurablePlayerSearchComponentProps): PlayerSearchComponentProps {
    return {
    };
  }
  
  function mapDispatchToProps(dispatch): PlayerSearchComponentActions {
      return {
          fetchSuggestions: (s, r, c) => dispatch(searchPlayerAction(s, r, c))
      }
  }
  export default connect(mapStateToProps, mapDispatchToProps)(PlayerSearchComponent)