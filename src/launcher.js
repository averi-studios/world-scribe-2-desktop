import React from 'react';
import AppContainer from './appContainer';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import {HashRouter, Route} from 'react-router-dom';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#27a4f3',
            contrastText: '#ffffff'
        }
    }
});

export default class Launcher extends React.Component{
    constructor() {
        super();
        this.state = {
            hasError: false,
        }
    }

    render(){
        return (
            <MuiThemeProvider theme={theme}>
                <HashRouter>
                    <Route render={(props) => {
                        return (
                            <HashRouter>
                                <AppContainer />
                            </HashRouter>
                        );
                    }}/>
                </HashRouter>
            </MuiThemeProvider>
        );
    }
}