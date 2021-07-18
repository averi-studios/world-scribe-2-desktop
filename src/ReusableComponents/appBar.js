import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import BackIcon from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton';
import classNames from 'classnames';
import { InputBase } from '@material-ui/core';

const styles = {
    root: {
        flexGrow: 1,
    },
    grow: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
        textAlign: 'left',
    },
    menuButtonIcon: {
        color: 'white'
    },
    hide: {
        display: 'none',
    },
    backButton: {
        marginRight: 10
    },
    backButtonIcon: {
        color: 'white',
    },
};

class ButtonAppBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isTitleEditable: false,
            newTitle: '',
        };
    }

    toggleEditableTitle = () => {
        this.setState({
            isTitleEditable: !this.state.isTitleEditable
        });
    }

    handleTitleChange = () => {
        this.props.handleTitleChange(this.state.newTitle);
        this.setState({
            isTitleEditable: false,
            newTitle: ''
        })
    }

    render(){
        const { classes,open,history } = this.props;
        const { isTitleEditable } = this.state;
        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            aria-label="Open drawer"
                            onClick={this.props.handleDrawerOpen}
                            className={classNames(classes.menuButton, open)}
                        >
                            <MenuIcon
                                className={classes.menuButtonIcon}
                            />
                        </IconButton>
                        <div className={classes.grow}>
                            <IconButton
                                aria-label="Go back one page"
                                onClick={history.goBack}
                                className={classes.backButton}
                            >
                                <BackIcon className={classes.backButtonIcon} />
                            </IconButton>
                            {isTitleEditable && this.props.editable ? (
                                <form onSubmit={this.handleTitleChange} >
                                    <InputBase
                                        autoFocus
                                        type="input"
                                        placeholder={this.props.title}
                                        value={this.state.newTitle}
                                        onChange={(e) => this.setState({ newTitle: e.target.value })}
                                        onBlur={this.handleTitleChange}
                                    />
                                </form>
                            ) : (
                                <Typography variant="h6" color="inherit" onClick={this.toggleEditableTitle}>
                                    {this.props.title}
                                </Typography>
                            )}
                        </div>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

ButtonAppBar.propTypes = {
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
};

export default withRouter(withStyles(styles)(ButtonAppBar));
