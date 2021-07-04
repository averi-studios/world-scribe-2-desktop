import React from 'react';
import { withStyles } from "@material-ui/core/styles/index";

import { Typography } from '@material-ui/core';

import UpdateIcon from '@material-ui/icons/Update';

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
    content: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    instructions: {
        marginBottom: '20px',
        textAlign: 'left',
    },
    checkbox: {
        marginLeft: '50px',
        height: '50px',
        transform: 'scale(2.5)'
    }
});

class EnableAutoUpdate extends React.Component {
    render() {
        const { classes, isChecked, onToggleCheckbox } = this.props;

        return (
            <div
                className={classes.wrapper}
            >
                <div
                    className={classes.titleRow}
                >
                    <UpdateIcon
                        className={classes.titleIcon}
                    />
                    <Typography
                        variant='h3'
                    >
                        Enable Auto-Update
                    </Typography>
                </div>
                <div
                    className={classes.content}
                >
                    <Typography
                        className={classes.instructions}
                        variant='body1'
                    >
                        Check the box if you would like the app to automatically download updates in the background, and then install them when the app closes.<br />
                        Leave the box unchecked if you do not want the app to update automatically. (You will have to download and install new versions manually.)<br />
                        NOTE: If this option is changed from unchecked to checked, auto-update will start applying the next time you launch the app. (The current app session is not affected.)
                    </Typography>
                    <input
                        className={classes.checkbox}
                        type='checkbox'
                        onClick={onToggleCheckbox}
                        checked={isChecked}
                    />
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(EnableAutoUpdate);
