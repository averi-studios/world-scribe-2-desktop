import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from "react-router";
import Fab from '@material-ui/core/Fab';

import AddIcon from '@material-ui/icons/Add';
import FolderIcon from '@material-ui/icons/Folder';

import WorldListItem from './worldListItem';
import NonExpandingList from '../ReusableComponents/nonExpandingList';
import LoadingDialog from '../ReusableComponents/loadingDialog';
import CreateWorldDialog from './createWorldDialog';
import Pages from '../ReusableComponents/pages';
import { IconButton, Typography, Tooltip } from '@material-ui/core';

const { ipcRenderer } = window.require('electron');
const path = window.require('path');

const axios = require('axios');

const styles = theme => ({
    pageBackground: {
        minePageNumber: 1,
        sharedPageNumber: 1,
        mineHasMorePages: false,
        sharedHasMorePages: false,
        paddingTop: 50,
        paddingLeft: 50,
        paddingRight: 50,
        backgroundColor: "transparent",
        display: "flex",
        flexDirection: "column"
    },
    createWorldButton: {
       alignSelf: "flex-end"
    }
});

const APP_BAR_TITLE = "Worlds";

class WorldsListPage extends React.Component {
    constructor(props) {
        super(props);

        //TODO: Load World data from the backend
        this.state = {
            minePageNumber: 1,
            mineHasMorePages: false,
            loadingDialogMessage: '',
            createWorldDialogIsOpen: false,
            createWorldDialogErrorMessage: ' ',
            ownedWorlds: [],
            worldsFolderExists: false,
        }

        this.handleOpeningCreateWorldDialog = this.handleOpeningCreateWorldDialog.bind(this);
        this.handleClosingCreateWorldDialog = this.handleClosingCreateWorldDialog.bind(this);
        this.handleCreateWorldSubmission = this.handleCreateWorldSubmission.bind(this);
        this.handleOpenWorld = this.handleOpenWorld.bind(this);
        this.handleOpenWorldsFolderClick = this.handleOpenWorldsFolderClick.bind(this);

        this.getWorldsPage = this.getWorldsPage.bind(this);
        this.incrementMinePage = this.incrementMinePage.bind(this);
        this.decrementMinePage = this.decrementMinePage.bind(this);
    }

    componentDidMount() {
        this.props.updateAppBarTitle(APP_BAR_TITLE);
        this.getWorldsPage()

        ipcRenderer.once('electron-store-get-result', (event, worldsFolderPath) => {
            ipcRenderer.once('file-path-exists-result', (event, worldsFolderExists) => {
                this.setState({
                    worldsFolderExists,
                });
            });
            ipcRenderer.send('file-path-exists', worldsFolderPath);
        });
        ipcRenderer.send('electron-store-get', 'userAppFolderPath');
    };

    getWorldsPage(){
        ipcRenderer.once('electron-store-get-result', (event, result) => {
            const userAppFolderPath = result;
            const worldsFolderPath = path.join(userAppFolderPath, 'Worlds');

            axios.get(`/api/worlds?page=${this.state.minePageNumber}&size=10&path=${encodeURI(worldsFolderPath)}`, { withCredentials: true })
            .then((response) => {
                this.setState({
                    ownedWorlds: response.data.worlds,
                    mineHasMorePages: response.data.hasMore,
                });
            },
            //TODO: Handle error response from backend
            );
        });
        ipcRenderer.send('electron-store-get', 'userAppFolderPath');
    }
    incrementMinePage(){
        if(this.state.mineHasMorePages){
            this.setState({
                minePageNumber: this.state.minePageNumber+1
            }, () => {
                this.getMinePage();
            });
        }
    }
    decrementMinePage(){
        if(this.state.minePageNumber !== 1){
            this.setState({
                minePageNumber: this.state.minePageNumber-1
            }, ()=>{
                this.getMinePage();                
            });
        }
    }

    handleOpeningCreateWorldDialog() {
        this.setState({
            createWorldDialogErrorMessage: ' ',
            createWorldDialogIsOpen: true
        });
    }

    handleClosingCreateWorldDialog() {
        this.setState({
            createWorldDialogIsOpen: false
        });
    }

    handleCreateWorldSubmission(newWorldName) {
        this.setState({
            loadingDialogMessage: `Creating ${newWorldName}...`,
            createWorldDialogIsOpen: false
        });

        ipcRenderer.once('electron-store-get-result', (event, result) => {
            const userAppFolderPath = result;
            const worldsFolderPath = path.join(userAppFolderPath, 'Worlds');

            axios.post('/api/worlds/', { newWorldName, worldsFolderPath }, { withCredentials: true })
            .then((response) => {
                this.handleOpenWorld(newWorldName);
            },
            (error) => {
                this.setState({
                    createWorldDialogErrorMessage: error.response ? error.response.data : error.message,
                    createWorldDialogIsOpen: true,
                    loadingDialogMessage: ''
                });
            })
        });
        ipcRenderer.send('electron-store-get', 'userAppFolderPath');
    }
    handleOpenWorld(openedWorldName){
        const { history, setCurrentWorldName } = this.props;

        ipcRenderer.once('electron-store-get-result', (event, result) => {
            console.log(result);
            const worldFolderPath = path.join(result, 'Worlds', openedWorldName);

            this.setState({
                loadingDialogMessage: `Opening ${openedWorldName}...`
            });

            axios.post('/api/worldAccesses', { worldFolderPath })
            .then(() => {
                this.setState({
                    loadingDialogMessage: ''
                });
                setCurrentWorldName(openedWorldName);
                history.push(`/articles/`);
            })
            .catch((error) => {
                // TODO: Display error message
                console.log(error);
                this.setState({
                    loadingDialogMessage: ''
                });
            })
        });
        ipcRenderer.send('electron-store-get', 'userAppFolderPath');

    }
    handleOpenWorldsFolderClick() {
        ipcRenderer.once('electron-store-get-result', (event, result) => {
            const worldsFolderPath = path.join(result, 'Worlds');
            ipcRenderer.send('open-file-path', worldsFolderPath);
        });
        ipcRenderer.send('electron-store-get', 'userAppFolderPath');
    }
    render() {
        const { classes } = this.props;

        const ownedWorldListItems = this.state.ownedWorlds.map((worldName) => {
            return (
                <WorldListItem
                    key={worldName}
                    worldName={worldName}
                    onOpenWorld={this.handleOpenWorld}
                    setCurrentWorldName={this.props.setCurrentWorldName}
                />
            );
        });
        const createWorldButton = (<Fab
            color='primary'
            className={classes.createWorldButton}
            onClick={this.handleOpeningCreateWorldDialog}
        >
            <AddIcon />
        </Fab>);

        const header = (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Typography
                    variant='h2'
                >
                    My Worlds
                </Typography>
                <Tooltip
                    placement='right'
                    title='Open Worlds folder in file explorer'
                    aria-label='Open Worlds folder in file explorer'
                >
                    <IconButton
                        style={{
                            marginLeft: 30,
                            visibility: this.state.worldsFolderExists ? 'visible' : 'hidden',
                        }}
                        color='primary'
                        onClick={this.handleOpenWorldsFolderClick}
                    >
                        <FolderIcon
                            style={{
                                fontSize: '2em'
                            }}
                        />
                    </IconButton>
                </Tooltip>
            </div>
        );

        return (
            <div
                className={classes.pageBackground}
            >
                <Pages 
                    pageNumber ={this.state.minePageNumber}
                    hasMorePages = {this.state.mineHasMorePages}
                    incrementPage = {this.incrementMinePage}
                    decrementPage = {this.decrementMinePage}
                    bottomRightButton={createWorldButton}
                    content={<NonExpandingList headerComponent={header} title={"My Worlds"} listItems={ownedWorldListItems} />}
                /> 

                <CreateWorldDialog
                    errorMessage={this.state.createWorldDialogErrorMessage}
                    open={this.state.createWorldDialogIsOpen}
                    onClose={this.handleClosingCreateWorldDialog}
                    onCreate={this.handleCreateWorldSubmission}
                />

                <LoadingDialog
                    open={this.state.loadingDialogMessage}
                    message={this.state.loadingDialogMessage}
                />
            </div>
        );
    }
}

export default withRouter(withStyles(styles)(WorldsListPage));
