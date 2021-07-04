import React from 'react';
import ArticleFieldMainTab from './ArticleField/articleFieldMainTab';
import ArticleConnectionMainTab from './ArticleConnection/articleConnectionMainTab';
import ArticleSnippetMainTab from './ArticleSnippet/articleSnippetMainTab';
import SidePanel from '../ReusableComponents/sidePanel';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import { withRouter } from "react-router";
import blueGrey from '@material-ui/core/colors/blueGrey';
import {withStyles} from "@material-ui/core/styles/index";

import FieldsIcon from '@material-ui/icons/Info';
import ConnectionsIcon from '@material-ui/icons/CompareArrows';
import SnippetsIcon from '@material-ui/icons/Note';

const axios = require('axios');

const styles = theme => ({
    content: {
        backgroundColor: blueGrey[50],
        height: "calc(100vh - 120px)",
    },
});

function TabContainer(props) {
    return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
            {props.children}
        </Typography>
    );
}

class ArticlePage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            articleMetadata: {},
            articleId: props.match.params.articleId,
            value:0,
        }
    }
    handleChange = (event, value) => {
        this.setState({ value });
    };
    componentDidMount() {
        axios.get(`/api/articles/${this.state.articleId}/metadata/`, { withCredentials: true })
        .then((response) => {
            this.props.updateAppBarTitle(response.data.name);
            this.setState({
                articleMetadata: response.data
            });
        },
        (error) => {
            //TODO: Handle error response
        });
    }
    componentDidUpdate(prevProps, prevState) {
        const newArticleId = this.props.match.params.articleId;
        if (newArticleId !== prevState.articleId) {
            axios.get(`/api/articles/${newArticleId}/metadata/`, { withCredentials: true })
            .then((response) => {
                this.props.updateAppBarTitle(response.data.name);
                this.setState({
                    articleId: newArticleId,
                    articleMetadata: response.data
                });
            },
            (error) => {
                //TODO: Handle error response
            });
        }
    }
    render(){
        const { value } = this.state;
        const { classes } = this.props;
        return(
            <div>
                <SidePanel
                    articleName={this.state.articleMetadata.name}
                    categoryName={this.state.articleMetadata.categoryName}
                    categoryId={this.state.articleMetadata.categoryId}
                    creatorName={this.state.articleMetadata.creatorName}
                    lastUpdaterName={this.state.articleMetadata.lastUpdaterName}
                />
                <div
                    style={{
                    width: 'calc(100% - 300px)',
                }}>
                    <AppBar position="static">
                        <Tabs
                            value={value}
                            onChange={this.handleChange}
                            scrollButtons="on"
                        >
                            <Tab label="Fields" icon={<FieldsIcon />} />
                            <Tab label="Connections" icon={<ConnectionsIcon />} />
                            <Tab label="Snippets" icon={<SnippetsIcon />} />
                        </Tabs>
                    </AppBar>
                {/*TODO: get the paths to be the ones I clicked from*/}
                    <div className={classes.content}>
                        {value === 0 && <TabContainer>
                            <ArticleFieldMainTab articleId={this.state.articleId} />
                        </TabContainer>}
                        {value === 1 && <TabContainer>
                            <ArticleConnectionMainTab articleId={this.state.articleId} updateAppBarTitle={this.props.updateAppBarTitle} />
                        </TabContainer>}
                        {value === 2 && <TabContainer>
                            <ArticleSnippetMainTab articleId={this.state.articleId} updateAppBarTitle={this.props.updateAppBarTitle} />
                        </TabContainer>}
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(withStyles(styles)(ArticlePage));
