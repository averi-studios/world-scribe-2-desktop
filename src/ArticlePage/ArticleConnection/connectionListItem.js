import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import IconButton from '@material-ui/core/IconButton';
import LoadedAvatar from '../../ReusableComponents/loadedAvatar';
import { withRouter } from "react-router";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditIcon from '@material-ui/icons/Edit';
import DeleteButton from "../../ReusableComponents/deleteButton";

const styles = theme => ({
    actionButtons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    rightButtons: {
        display: 'flex',
        flexDirection: 'row'
    }
});

function ConnectionListItem(props) {
    const { classes, history } = props;

    const otherArticleId = props.connection.otherArticleId;
    const imageUrl = `/api/articles/${otherArticleId}/image/`;

    let handleGoToArticleClick = function() {
        props.updateAppBarTitle(props.connection.otherArticleName);
        history.push(`/articles/${otherArticleId}/`);
    };

    let handleEditClick = function() {
        history.push(`/articles/${props.connection.mainArticleId}/connections/${props.connection.id}/`);
    }

    return (
        <ExpansionPanel>
            <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
            >
                <ListItem>
                    <ListItemAvatar>
                        <LoadedAvatar
                            imageUrl={imageUrl}
                            altText={props.connection.otherArticleName}
                        />
                    </ListItemAvatar>
                    <ListItemText
                        primary={props.connection.otherArticleName}
                        secondary={props.connection.otherArticleRole}
                    />
                </ListItem>
            </ExpansionPanelSummary
            >
            <ExpansionPanelDetails>
                {props.connection.description}
            </ExpansionPanelDetails>
            <ExpansionPanelActions
                className={classes.actionButtons}
            >
                <Button
                    color='primary'
                    onClick={handleGoToArticleClick}
                >
                    Go to Article
                </Button>
                <div
                    className={classes.rightButtons}
                >
                    <IconButton
                        color='primary'
                        onClick={handleEditClick}
                    >
                        <EditIcon />
                    </IconButton>
                    <DeleteButton onDelete={() => props.onDelete(props.connection.id)}/>
                </div>
            </ExpansionPanelActions>
        </ExpansionPanel>
    );
}

export default withRouter(withStyles(styles)(ConnectionListItem));
