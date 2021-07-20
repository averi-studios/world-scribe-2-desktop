import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import LoadedAvatar from '../ReusableComponents/loadedAvatar';
import { withRouter } from 'react-router';
import ListItemEditable from '../ReusableComponents/listItemEditable';

const styles = (theme) => ({

});

function ArticleListItem(props) {
    const { history } = props;

    const imageUrl = `/api/articles/${props.article.id}/image/`;

    let handleClick = function() {
        props.updateAppBarTitle(props.article.name);
        history.push(`/articles/${props.article.id}/`);
    };
    return (
        <ListItem button>
            <ListItemAvatar>
                <LoadedAvatar
                    imageUrl={imageUrl}
                    altText={props.article.name}
                />
            </ListItemAvatar>
            <ListItemEditable
                onClick={handleClick}
                name={props.article.name}
                placeholder={props.article.name}
                onDelete={() => props.onDelete(props.article.id)}
                onDone={props.onDone}
            />
        </ListItem>
    );
}

export default withRouter(withStyles(styles)(ArticleListItem));
