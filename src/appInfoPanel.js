// Code copied and modified from Material UI demos:
// https://github.com/mui-org/material-ui/blob/master/docs/src/pages/demos/menus/MenuListComposition.js
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import app_info_panel_background from './Assets/app_info_panel_background.png';
import Snackbar from '@material-ui/core/Snackbar'

import Menu from '@material-ui/icons/Menu';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CloseIcon from '@material-ui/icons/Close';
import { IconButton } from '@material-ui/core';

const { ipcRenderer } = window.require('electron');

const styles = theme => ({
    panelContainer: {
        backgroundImage: `url(${app_info_panel_background})`,
        backgroundSize: 'cover',
        height: 300,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    appInfoText: {
        color: 'white'
    },
    dropdownMenu: {
        width: 300,
    },
    popper: {
        zIndex: 100
    },
    closeDrawerButton: {
        alignSelf: 'flex-start',
        color: 'white'
    }
});

class AppInfoPanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            errorHasOccurred: false,
            dropdownOpen: false,
            snackbarMessage: '',
        }
        
        this.handleToggle = this.handleToggle.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleQuitWorldScribeClick = this.handleQuitWorldScribeClick.bind(this);
        this.handleOpenLogFileClick = this.handleOpenLogFileClick.bind(this);
        this.handleCloseSnackbar = this.handleCloseSnackbar.bind(this);
    }

    componentDidMount() {
        ipcRenderer.once('get-app-version-result', (event, result) => {
            this.setState({
                appVersion: result
            });
        })
        ipcRenderer.send('get-app-version');
    }

    handleToggle() {
        this.setState(state => ({ dropdownOpen: !state.dropdownOpen }));
    };

    handleClose(event) {
        if (this.anchorEl.contains(event.target)) {
          return;
        }
    
        this.setState({ dropdownOpen: false });
    };

    handleOpenLogFileClick() {
        ipcRenderer.once('open-app-log-file-in-folder-result', (event, result) => {
            if (!result.succeeded) {
                this.setState({
                    snackbarMessage: result.message || 'An unknown error occurred.',
                });
            }
        });
        ipcRenderer.send('open-app-log-file-in-folder');
    }

    handleQuitWorldScribeClick() {
        this.setState({
            dropdownOpen: false
        });
        ipcRenderer.send('quit-app');
    }

    handleCloseSnackbar() {
        this.setState({
            snackbarMessage: '',
        });
    }

    render() {
        const { classes, theme } = this.props;

        return (
            <div>
                <div
                    className={classes.panelContainer}
                >
                    <IconButton
                        onClick={this.props.handleDrawerClose}
                        className={classes.closeDrawerButton}
                    >
                        {theme.direction === 'ltr' ? <Menu fontSize='large' /> : <ChevronRightIcon fontSize='large' />}
                    </IconButton>
                    <div>
                        <List>
                            <ListItem
                                className={classes.panelContent}
                                button
                                buttonRef={node => {
                                    this.anchorEl = node;
                                }}
                                aria-owns={this.state.dropdownOpen ? 'menu-list-grow' : undefined}
                                aria-haspopup="true"
                                onClick={this.handleToggle}
                            >
                                <ListItemText>
                                    <Typography
                                        variant='body1'
                                        className={classes.appInfoText}
                                    >
                                        Version {this.state.appVersion}
                                    </Typography>
                                </ListItemText>
                                <ListItemSecondaryAction>
                                    <IconButton
                                        buttonRef={node => {
                                            this.anchorEl = node;
                                        }}
                                        aria-owns={this.state.dropdownOpen ? 'menu-list-grow' : undefined}
                                        aria-haspopup="true"
                                        onClick={this.handleToggle}
                                    >
                                        <ExpandMoreIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        </List>
                        <Popper className={classes.popper} open={this.state.dropdownOpen} anchorEl={this.anchorEl} transition disablePortal>
                            {({ TransitionProps, placement }) => (
                            <Grow
                                {...TransitionProps}
                                id="menu-list-grow"
                                style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                            >
                            <Paper>
                                <ClickAwayListener onClickAway={this.handleClose}>
                                    <MenuList
                                        className={classes.dropdownMenu}
                                    >
                                        <MenuItem onClick={this.handleOpenLogFileClick}>Open Log File</MenuItem>
                                        <MenuItem onClick={this.handleQuitWorldScribeClick}>Quit World Scribe</MenuItem>
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                        )}
                        </Popper>
                    </div>
                </div>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    autoHideDuration={6000}
                    open={this.state.snackbarMessage}
                    onClose={this.handleCloseSnackbar}
                    message={this.state.snackbarMessage}
                    action={[
                        <IconButton
                            key='close-snackbar'
                            color='inherit'
                            onClick={this.handleCloseSnackbar}
                        >
                            <CloseIcon />
                        </IconButton>
                    ]}
                />
            </div>
        );
    }
}

export default withStyles(styles, { withTheme: true })(AppInfoPanel);
