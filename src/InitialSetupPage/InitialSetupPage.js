import React from 'react';
import { withStyles } from "@material-ui/core/styles/index";
import { withRouter } from 'react-router-dom';
import UserAppFolderLocation from '../ReusableComponents/SettingsFields/userAppFolderLocation'
import EnableAutoUpdate from '../ReusableComponents/SettingsFields/enableAutoUpdate'

import { Paper } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { Button } from '@material-ui/core';

const { ipcRenderer } = window.require('electron');
const path = window.require('path');

const styles = theme => ({
    content: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        margin: '30px',
        padding: '30px',
    },
    welcomeMessage: {
        marginBottom: '30px',
        alignSelf: 'center',
    },
    instructions: {
        alignSelf: 'center',
        color: 'grey',
        marginBottom: '20px',
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
    saveAndContinueButton: {
        fontSize: '1.8em',
    },
});

class InitialSetupPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            parentPathOfUserAppFolder: '',
            enableAutoUpdate: false,
        };

        this.renderFields = this.renderFields.bind(this);
        this.setParentPathOfUserAppFolder = this.setParentPathOfUserAppFolder.bind(this);
        this.toggleEnableAutoUpdateCheck = this.toggleEnableAutoUpdateCheck.bind(this);
        this.allFieldsAreFilledIn = this.allFieldsAreFilledIn.bind(this);
        this.handleSaveAndContinueButton = this.handleSaveAndContinueButton.bind(this);
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

    allFieldsAreFilledIn() {
        return (
            this.state.parentPathOfUserAppFolder && this.state.parentPathOfUserAppFolder !== ''
        );
    }

    handleSaveAndContinueButton() {
        const { history } = this.props;
        const userAppFolderPath = path.join(this.state.parentPathOfUserAppFolder, 'WorldScribe');
        const enableAutoUpdate = this.state.enableAutoUpdate;

        ipcRenderer.once('electron-store-set-success', (event, arg) => {
            history.replace('/worlds');
        });

        const updatedSettingsFields = {
            userAppFolderPath,
            enableAutoUpdate,
        };
        ipcRenderer.send('electron-store-set', updatedSettingsFields);
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
            <Paper
                className={classes.content}
            >
                <Typography
                    className={classes.welcomeMessage}
                    variant='h1'
                    color='primary'
                >
                    Welcome to World Scribe!
                </Typography>
                <Typography
                    className={classes.instructions}
                    variant='h5'
                >
                    Before you start worldbuilding, we'll need you to set up a few things.<br />
                    (You can change these settings later in the app at any time.)
                </Typography>
                {this.renderFields()}
                <div
                    className={classes.buttonsSection}
                >
                    <Button
                        className={classes.saveAndContinueButton}
                        variant='contained'
                        disabled={!this.allFieldsAreFilledIn()}
                        color='primary'
                        onClick={this.handleSaveAndContinueButton}
                    >
                        SAVE & CONTINUE
                    </Button>
                </div>
            </Paper>
        );
    }
}

export default withRouter(withStyles(styles)(InitialSetupPage));
