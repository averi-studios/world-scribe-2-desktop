import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import LoadedAvatar from '../ReusableComponents/loadedAvatar';
import { withRouter } from "react-router";
import DeleteButton from "../ReusableComponents/deleteButton";

const styles = theme => ({
});

function CategoryListItem(props) {
    const { history } = props;

    const imageUrl = `/api/categories/${props.category.id}/image/`;

    let handleClick = function() {
        props.updateAppBarTitle(props.category.name);
        history.push(`/categories/${props.category.id}/`);
    };
    
    return (
        <ListItem button onClick={handleClick} >
            <ListItemAvatar>
                <LoadedAvatar
                    imageUrl={imageUrl}
                    altText={props.category.name}
                />
            </ListItemAvatar>
            <ListItemText
                primary={props.category.name}
            />
            {
                props.onDelete
                ? (
                    <ListItemSecondaryAction>
                        <DeleteButton onDelete={()=>props.onDelete(props.category.id)}/>
                    </ListItemSecondaryAction>
                )
                : null
            }
        </ListItem>
    );
}

export default withRouter(withStyles(styles)(CategoryListItem));
