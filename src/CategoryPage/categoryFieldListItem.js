import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';

import EditIcon from '@material-ui/icons/Edit';

import DeleteButton from "../ReusableComponents/deleteButton";

const styles = theme => ({
    buttons: {
        display: 'flex',
        flexDirection: 'row'
    }
});

function CategoryFieldListItem(props) {
    const { classes } = props;

    return (
        <ListItem>
            <ListItemText
                primary={props.field.name}
            />
            <ListItemSecondaryAction
                className={classes.buttons}
            >
                <IconButton
                    color='primary'
                    onClick={() => props.onRename(props.field)}
                >
                    <EditIcon />
                </IconButton>
                <DeleteButton onDelete={()=>props.onDelete(props.field.id)}/>
            </ListItemSecondaryAction>
        </ListItem>
    );
}

export default withStyles(styles)(CategoryFieldListItem);
