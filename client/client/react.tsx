import * as React from "react";
import * as ReactDOM from "react-dom";

import MainComponent from "./components/MainComponent";
import {Provider} from 'react-redux'
import configureStores from './store/index';

console.log("Running react!")
const store = configureStores()

const root = document.getElementById('app');
ReactDOM.render(
        <Provider store={store}>
    		<MainComponent />
        </Provider>,
	root
);