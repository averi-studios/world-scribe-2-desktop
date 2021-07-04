import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AppSettingsIcon from '@material-ui/icons/Settings';
import WorldsIcon from '@material-ui/icons/Language';
import ArticlesIcon from '@material-ui/icons/InsertDriveFile';
import CategoriesIcon from '@material-ui/icons/Category';
import { withRouter } from "react-router";

import AppInfoPanel from './appInfoPanel';
import { Typography } from '@material-ui/core';

const drawerWidth = 300;

const styles = theme => ({
    root: {
        display: 'flex',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerHeader: {
        width: drawerWidth,
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    drawerList: {
        width: drawerWidth,
        display: 'flex',
        flexDirection: 'column'
    },
    worldName: {
        alignSelf: 'flex-start',
        marginTop: 10,
        marginLeft: 16
    }
});
class NavigationModule extends React.Component {
    render() {
        const { classes,open,history } = this.props;
        return (
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <AppInfoPanel handleDrawerClose={this.props.handleDrawerClose} />
                <Divider />
                <List className={classes.drawerList}>
                        <ListItem button onClick={() => history.push('/appSettings')}  >
                            <ListItemIcon><AppSettingsIcon /></ListItemIcon>
                            <ListItemText primary={'App Settings'} />
                        </ListItem>
                        <ListItem button onClick={() => history.push('/worlds')}  >
                            <ListItemIcon><WorldsIcon /></ListItemIcon>
                            <ListItemText primary={'Worlds'} />
                        </ListItem>
                        <Divider />
                        <Typography
                            variant='h5'
                            className={classes.worldName}
                        >
                            {this.props.worldName}
                        </Typography>
                        {
                            this.props.worldName
                            ? <ListItem button onClick={() => history.push('/articles/')}  >
                                  <ListItemIcon><ArticlesIcon /></ListItemIcon>
                                  <ListItemText primary={'Articles'} />
                              </ListItem>
                            : null
                        }
                        {
                            this.props.worldName
                            ? <ListItem button onClick={() => history.push('/categories/')}  >
                                  <ListItemIcon><CategoriesIcon /></ListItemIcon>
                                  <ListItemText primary={'Categories'} />
                              </ListItem>
                            : null
                        }
                </List>
            </Drawer>
        );
    }
}

NavigationModule.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
};

export default withRouter(withStyles(styles, { withTheme: true })(NavigationModule));