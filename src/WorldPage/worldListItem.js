import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

function WorldListItem(props) {
    return (
        <ListItem button onClick={() => props.onOpenWorld(props.worldName)} >
            <ListItemAvatar>
                <Avatar>{props.worldName.substring(0, 1)}</Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={props.worldName}
            />
        </ListItem>
    );
}

export default WorldListItem;
