import React from 'react';
import { withStyles } from "@material-ui/core/styles/index";

import { Typography } from '@material-ui/core';
import { Button } from '@material-ui/core';

import FolderIcon from '@material-ui/icons/Folder';

const { ipcRenderer } = window.require('electron');

const styles = theme => ({
    wrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    titleRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: '20px',
    },
    titleIcon: {
        marginRight: '20px',
        fontSize: '3em',
    },
    instructions: {
        marginBottom: '20px',
        textAlign: 'left',
    },
    fileSelectionArea: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    selectedFilePathText: {
        marginLeft: '20px',
    },
});

class UserAppFolderLocation extends React.Component {
    constructor(props) {
        super(props);

        this.handleBrowseButtonClick = this.handleBrowseButtonClick.bind(this);
    }

    handleBrowseButtonClick() {
        const { onSelectPath } = this.props;
        ipcRenderer.once('select-folder-result', function(event, arg) {
            const selectedFolderPath = JSON.parse(arg)[0];
            onSelectPath(selectedFolderPath);
        });
        ipcRenderer.send('select-folder');
    }

    render() {
        const { classes, selectedPath } = this.props;

        return (
            <div
                className={classes.wrapper}
            >
                <div
                    className={classes.titleRow}
                >
                    <FolderIcon
                        className={classes.titleIcon}
                    />
                    <Typography
                        variant='h3'
                    >
                        App Folder Location
                    </Typography>
                </div>
                <Typography
                    className={classes.instructions}
                    variant='body1'
                >
                    Select a folder on your computer. Within it, a subfolder will be created named "WorldScribe".<br />
            <b>If you want to load an existing "WorldScribe" folder, please choose its <i>parent</i> folder (not the "WorldScribe" folder itself).</b><br />
                    The "WorldScribe" folder will hold all of the data you put into World Scribe, including
                    your Worlds' data.
                </Typography>
                <div
                    className={classes.fileSelectionArea}
                >
                    <Button
                        variant='contained'
                        color='primary'
                        onClick={this.handleBrowseButtonClick}
                    >
                        BROWSE
                    </Button>
                    <Typography
                        className={classes.selectedFilePathText}
                        variant='body1'
                    >
                        {
                            selectedPath
                            ? <b>{selectedPath}</b>
                            : <i>No folder selected</i>
                        }
                    </Typography>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(UserAppFolderLocation);
