import React from 'react';
import { withStyles } from "@material-ui/core/styles/index";
import { withRouter } from 'react-router-dom';
import UserAppFolderLocation from '../ReusableComponents/SettingsFields/userAppFolderLocation'
import EnableAutoUpdate from '../ReusableComponents/SettingsFields/enableAutoUpdate'

import { Paper } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { Snackbar } from '@material-ui/core';

const { ipcRenderer } = window.require('electron');
const path = window.require('path');

const axios = require('axios');

const styles = theme => ({
    content: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        margin: '30px',
        padding: '30px',
    },
    title: {
        marginBottom: '30px',
        alignSelf: 'center',
    },
    fieldsWrapper: {
        width: '100%',
    },
    fieldDivider: {
        marginTop: '30px',
        marginBottom: '40px',
    },
    buttonsSection: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%',
        marginTop: '30px',
    },
    cancelButton: {
        fontSize: '1.8em',
        marginRight: '20px',
    },
    saveButton: {
        fontSize: '1.8em',
    },
});

class AppSettingsPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            parentPathOfUserAppFolder: '',
            originalParentPathOfUserAppFolder: '',
            enableAutoUpdate: false,
            snackbarMessage: '',
        };

        this.renderFields = this.renderFields.bind(this);
        this.setParentPathOfUserAppFolder = this.setParentPathOfUserAppFolder.bind(this);
        this.toggleEnableAutoUpdateCheck = this.toggleEnableAutoUpdateCheck.bind(this);
        this.handleCancelButton = this.handleCancelButton.bind(this);
        this.handleSaveButton = this.handleSaveButton.bind(this);
        this.handleCloseSnackbar = this.handleCloseSnackbar.bind(this);
    }

    componentDidMount() {
        this.props.updateAppBarTitle('App Settings');

        ipcRenderer.once('electron-store-get-multiple-result', (event, result) => {
            this.setState({
                parentPathOfUserAppFolder: path.dirname(result.userAppFolderPath),
                originalParentPathOfUserAppFolder: path.dirname(result.userAppFolderPath),
                enableAutoUpdate: result.enableAutoUpdate,
            });
        });
        ipcRenderer.send('electron-store-get-multiple', ['userAppFolderPath', 'enableAutoUpdate']);
    }

    setParentPathOfUserAppFolder(newPath) {
        this.setState({
            parentPathOfUserAppFolder: newPath,
        });
    }

    toggleEnableAutoUpdateCheck() {
        this.setState({
            enableAutoUpdate: !this.state.enableAutoUpdate
        });
    }

    handleCancelButton() {
        const { history } = this.props;
        history.goBack();
    }

    handleSaveButton() {
        const { history, setCurrentWorldName } = this.props;
        const userAppFolderPath = path.join(this.state.parentPathOfUserAppFolder, 'WorldScribe');
        const enableAutoUpdate = this.state.enableAutoUpdate;

        ipcRenderer.once('electron-store-set-success', (event, arg) => {
            if (this.state.parentPathOfUserAppFolder !== this.state.originalParentPathOfUserAppFolder) {
                axios.post('/api/worldAccesses', { worldFolderPath: '' })
                .then(() => {
                    setCurrentWorldName('');
                    history.replace('/worlds');
                })
                .catch((error) => {
                    console.log(error);
                    this.setState({
                        snackbarMessage: 'Settings saved successfully, but an error occurred afterwards. Please close and re-launch the app.',
                    });
                });
            } else {
                history.goBack();
            }
        });

        const updatedSettingsFields = {
            userAppFolderPath,
            enableAutoUpdate
        };
        ipcRenderer.send('electron-store-set', updatedSettingsFields);
    }

    handleCloseSnackbar() {
        this.setState({
            snackbarMessage: '',
        });
    }

    renderFields() {
        const { classes } = this.props;
        return (
            <div
                className={classes.fieldsWrapper}
            >
                <hr
                    className={classes.fieldDivider}
                />
                <UserAppFolderLocation selectedPath={this.state.parentPathOfUserAppFolder} onSelectPath={this.setParentPathOfUserAppFolder} />
                <hr
                    className={classes.fieldDivider}
                />
                <EnableAutoUpdate isChecked={this.state.enableAutoUpdate} onToggleCheckbox={this.toggleEnableAutoUpdateCheck} />
            </div>
        );
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Paper
                    className={classes.content}
                >
                    <Typography
                        className={classes.title}
                        variant='h1'
                        color='primary'
                    >
                        App Settings
                    </Typography>
                    {this.renderFields()}
                    <div
                        className={classes.buttonsSection}
                    >
                        <Button
                            className={classes.cancelButton}
                            color='primary'
                            onClick={this.handleCancelButton}
                        >
                            CANCEL
                        </Button>
                        <Button
                            className={classes.saveButton}
                            variant='contained'
                            color='primary'
                            onClick={this.handleSaveButton}
                        >
                            SAVE
                        </Button>
                    </div>
                </Paper>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    open={this.state.snackbarMessage}
                    onClose={this.handleCloseSnackbar}
                    message={this.state.snackbarMessage}
                >
                </Snackbar>
            </div>
        );
    }
}

export default withRouter(withStyles(styles)(AppSettingsPage));
