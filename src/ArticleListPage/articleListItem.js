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

function ArticleListItem(props) {
    const { history } = props;

    const imageUrl = `/api/articles/${props.article.id}/image/`;

    let handleClick = function() {
        props.updateAppBarTitle(props.article.name);
        history.push(`/articles/${props.article.id}/`);
    };
    return (
        <ListItem button onClick={handleClick} >
            <ListItemAvatar>
                <LoadedAvatar
                    imageUrl={imageUrl}
                    altText={props.article.name}
                />
            </ListItemAvatar>
            <ListItemText
                primary={props.article.name}
            />
            <ListItemSecondaryAction>
                <DeleteButton onDelete={()=>props.onDelete(props.article.id)}/>
            </ListItemSecondaryAction>
        </ListItem>
    );
}

export default withRouter(withStyles(styles)(ArticleListItem));
