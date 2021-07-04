import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteButton from '../../ReusableComponents/deleteButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
const styles = theme => ({
    root: {
        padding: '30px 0',
        float: 'left',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(13),
        color: theme.palette.text.secondary,
    },
    createArticleButton: {
        alignSelf: "flex-end"
    }
});

class ArticleSnippetListItem extends React.Component{
    constructor(props){
        super(props);
        this.articleId = props.articleId;
        this.state = {
            key:props.key,
            snippet: props.snippet,
        };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.updateAppBarTitle(this.state.snippet.name);
        this.props.history.push(`/articles/${this.articleId}/snippets/${this.state.snippet.id}/content/`);
    }

    render(){
        return(
        <div>
            <List key={this.state.key}>
                <ListItem button onClick={this.handleClick}>
                    <ListItemText
                        primary={this.state.snippet.name}
                    />
                    <ListItemSecondaryAction>
                    <DeleteButton onDelete={()=> this.props.onDelete(this.state.snippet.id)}/>
                    </ListItemSecondaryAction>
                </ListItem>
            </List>
        </div>
        );
    }
}
export default withRouter(withStyles(styles)(ArticleSnippetListItem));