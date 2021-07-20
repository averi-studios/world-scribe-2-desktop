import React from 'react';
import AppBar from './ReusableComponents/appBar';
import InitialSetupPage from './InitialSetupPage/InitialSetupPage';
import AppSettingsPage from './AppSettingsPage/AppSettingsPage';
import WorldListPage from './WorldPage/worldsListPage';
import {Route, Redirect, Switch, withRouter} from 'react-router-dom';
import NavigationModule from './navigationModule';
import {withStyles} from "@material-ui/core/styles/index";
import classNames from 'classnames';
import ArticlesList from './ArticleListPage/articlesList';
import CategoryPage from './CategoryPage/categoryPage';
import ArticlePage from './ArticlePage/articlePage';
import SnippetEditor from './ArticlePage/ArticleSnippet/snippetEditor';
import ConnectionPageEditor from './ArticlePage/ArticleConnection/connectionPageEditor';
import CategoryList from './CategoryListPage/categoryList';
import blueGrey from '@material-ui/core/colors/blueGrey';
import { apiHelper } from './helpers/apiHelper';

const drawerWidth = 300;

const styles = theme => ({
    content: {
        marginLeft: 0,
        backgroundColor: blueGrey[50],
        minHeight: "calc(100vh - 70px)",
        height: '100%',
        overflowY: 'scroll'
    },
    contentShift: {
        marginLeft: drawerWidth,
    },
});

const { ipcRenderer } = window.require('electron');
const axios = require('axios');

const toMatch = /articles\/\d+(\/snippets\/\d+)?|categories\/\d+/;

class AppContainer extends React.Component {
    constructor() {
        super();
        this.state = {
            appBarTitle: '',
            open: true,
            pageName: 'worlds',
            appSetupIsComplete: undefined,
            currentWorldName: '',
        };
        this.handleDrawerClose = this.handleDrawerClose.bind(this);
        this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
        this.updateAppBarTitle = this.updateAppBarTitle.bind(this);
        this.setCurrentWorldName = this.setCurrentWorldName.bind(this);
        this.checkIfAppSetupIsComplete = this.checkIfAppSetupIsComplete.bind(this);
    }

    componentDidMount() {
        this.checkIfAppSetupIsComplete();

        axios.get('/api/worlds/current/name')
        .then((response) => {
            this.setState({
                currentWorldName: response.data.name
            });
        },
        (error) => {
            if (error && error.response && error.response.status === 400) {
            }
            else {
                // TODO: Display error message
            }
        });

        ipcRenderer.once('get-electron-user-data-path-result', (event, result) => {
            console.log('===================================================');
            console.log('Electron "userData" path:');
            console.log(result);
            console.log('===================================================');
        })
        ipcRenderer.send('get-electron-user-data-path');
    }

    checkIfAppSetupIsComplete() {
        ipcRenderer.once('electron-store-get-multiple-result', (event, result) => {
            const userAppFolderPath = result.userAppFolderPath;
            const enableAutoUpdate = result.enableAutoUpdate;
            this.setState({
                appSetupIsComplete: (
                    (userAppFolderPath !== undefined) && (userAppFolderPath !== '')
                    && (enableAutoUpdate !== undefined)
                ),
            });
        });
        ipcRenderer.send('electron-store-get-multiple', ['userAppFolderPath', 'enableAutoUpdate']);
    }

    updateAppBarTitle(newTitle) {
        this.setState({
            appBarTitle: newTitle
        });
    }

    setCurrentWorldName(worldName) {
        this.setState({
            currentWorldName: worldName
        });
    }

    handleDrawerOpen = () => {
        this.setState({ open: true });
    };

    handleDrawerClose = () => {
        this.setState({ open: false });
    };

	changeTitle = (newName, toChange) => {
		apiHelper.rename(newName, toChange)
			.then((response) => {
				this.updateAppBarTitle(response.data.name);
			})
			.catch((error) => {
				// TODO: Display error message
			});
	};

    render(){
        const match = this.props.location.pathname.match(toMatch);
        const { classes } = this.props;
        if (this.state.appSetupIsComplete === undefined) {
            // TODO: Display loading message.
            return <div></div>;
        }
        return (
            <Switch>
                <Route
                    exact
                    path="/"
                    render={() => {
                        if (this.state.appSetupIsComplete) {
                            return <Redirect to="/worlds" />
                        } else {
                            return <Redirect to="/initialSetup" />
                        }
                    }}
                />
                <Route
                    path="/initialSetup"
                >
                    <div className={classes.content}>
                        <InitialSetupPage updateAppBarTitle={this.updateAppBarTitle} />
                    </div>
                </Route>
                <Route>
                    <div>
                        <AppBar title={this.state.appBarTitle} open={this.state.open} handleDrawerOpen={this.handleDrawerOpen} editable={match} handleTitleChange={(newName) => this.changeTitle(newName, match[0])}/>
                        <NavigationModule worldName={this.state.currentWorldName} open={this.state.open} handleDrawerClose={this.handleDrawerClose}/>
                        <main className={classNames(classes.content, {
                            [classes.contentShift]: this.state.open,
                        })}>
                            <Switch>
                                <Route path="/appSettings" render={(props) => <AppSettingsPage {...props} updateAppBarTitle={this.updateAppBarTitle} setCurrentWorldName={this.setCurrentWorldName} />} />
                                <Route exact path="/worlds" render={(props) => <WorldListPage {...props} updateAppBarTitle={this.updateAppBarTitle} currentWorldName={this.state.currentWorldName} setCurrentWorldName={this.setCurrentWorldName} />} />
                                <Route path="/categories/:categoryId/" render={(props) => <CategoryPage key={props.match.params.categoryId} {...props} updateAppBarTitle={this.updateAppBarTitle} />} />
                                <Route path="/articles/:articleId/connections/:connectionId/" render ={(props) => <ConnectionPageEditor {...props} updateAppBarTitle={this.updateAppBarTitle}/>} />
                                <Route path="/articles/:articleId/snippets/:snippetId/" render ={(props) => <SnippetEditor {...props} />} />
                                <Route path="/articles/:articleId/" render={(props) => <ArticlePage key={props.match.params.articleId} {...props} updateAppBarTitle={this.updateAppBarTitle} />} />
                                <Route path="/articles/" render={(props) => <ArticlesList {...props} updateAppBarTitle={this.updateAppBarTitle} />} />
                                <Route path="/categories/" render={(props) => <CategoryList {...props} updateAppBarTitle={this.updateAppBarTitle}/>}/>
                            </Switch>
                        </main>
                    </div>
                </Route>
            </Switch>
        )
    }

}

export default withRouter(withStyles(styles, { withTheme: true })(AppContainer));
