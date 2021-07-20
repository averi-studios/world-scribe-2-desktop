import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import LoadedAvatar from '../ReusableComponents/loadedAvatar';
import { withRouter } from "react-router";
import ListItemEditable from '../ReusableComponents/listItemEditable';

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
        <ListItem button >
            <ListItemAvatar>
                <LoadedAvatar
                    imageUrl={imageUrl}
                    altText={props.category.name}
                />
            </ListItemAvatar>
            <ListItemEditable
                onClick={handleClick}
                name={props.category.name}
                placeholder={props.category.name}
                onDelete={() => props.onDelete(props.category.id)}
                onDone={props.onDone}
            />
        </ListItem>
    );
}

export default withRouter(withStyles(styles)(CategoryListItem));
