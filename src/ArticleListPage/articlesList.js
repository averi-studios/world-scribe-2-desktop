import React from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import blueGrey from '@material-ui/core/colors/blueGrey';
import AddIcon from '@material-ui/icons/Add';
import NonExpandingList from '../ReusableComponents/nonExpandingList';
import CreateArticleDialog from '../ReusableComponents/createArticleDialog';
import ArticleListItem from './articleListItem';
import Pages from '../ReusableComponents/pages';
import { apiHelper } from '../helpers/apiHelper';

const axios = require('axios');

const styles = theme => ({
    pageBackground: {
        paddingTop: 50,
        paddingLeft: 50,
        paddingRight: 50,
        backgroundColor: blueGrey[50],
        display: "flex",
        flexDirection: "column"
    },
    articlesList: {
        width: '100%'
    },
    createArticleButton: {
        alignSelf: "flex-end"
    },
});

class ArticlesList extends React.Component {
    constructor(props) {
        super(props);

        //TODO: Load Article data from the backend
        this.state = {
            pageNumber: 1,
            hasMorePages:false,
            createArticleDialogIsOpen: false,
            createArticleDialogErrorMessage: ' ',
            categories: [],
            articles: []
        }

        this.handleOpeningCreateArticleDialog = this.handleOpeningCreateArticleDialog.bind(this);
        this.handleClosingCreateArticleDialog = this.handleClosingCreateArticleDialog.bind(this);
        this.handleCreateArticleSubmission = this.handleCreateArticleSubmission.bind(this);
        this.handleDeleteArticleButtonClick = this.handleDeleteArticleButtonClick.bind(this);
        this.deleteArticle = this.deleteArticle.bind(this);
        this.getArticlePage = this.getArticlePage.bind(this);
        this.incrementPage = this.incrementPage.bind(this);
        this.decrementPage = this.decrementPage.bind(this);
    }

    componentDidMount() {
        this.props.updateAppBarTitle('All Articles');
        this.getArticlePage();
        axios.get(`/api/categories?page=1&size=999`, { withCredentials: true })
        .then((response) => {
            this.setState({
                categories: response.data.categories
            });
        },
        //TODO: Handle error response from backend
        );
    };
    getArticlePage(){
        axios.get(`/api/articles?page=${this.state.pageNumber}&size=10`, { withCredentials: true })
        .then((response) => {
            this.setState({
                articles: response.data.articles,
                hasMorePages:response.data.hasMore,
            });
        },
        //TODO: Handle error response from backend
        );
    }
    incrementPage(){
        if(this.state.hasMorePages){
            this.setState({
                pageNumber: this.state.pageNumber+1
            }, () => {
                this.getArticlePage();
            });
        }
    }
    decrementPage(){
        if(this.state.pageNumber !== 1){
            this.setState({
                pageNumber: this.state.pageNumber-1
            }, ()=>{
                this.getArticlePage();
            });
        }
    }

    handleOpeningCreateArticleDialog() {
        this.setState({
            createArticleDialogErrorMessage: ' ',
            createArticleDialogIsOpen: true
        });
    }

    handleClosingCreateArticleDialog() {
        this.setState({
            createArticleDialogIsOpen: false
        });
    }

    handleDeleteArticleButtonClick() {
        //TODO: Call delete Article endpoint on backend
    }
    deleteArticle(articleId){
        axios.delete(`/api/articles/${articleId}/`,{withCredentials:true})
        .then((response) => {
            let pageNumber = this.state.pageNumber;
            if ((this.state.articles.length === 1) && (pageNumber > 1)) {
                pageNumber = pageNumber - 1
            }
            axios.get(`/api/articles?page=${pageNumber}&size=10`, { withCredentials: true })
            .then((response) => {
                this.setState({
                    articles: response.data.articles,
                    pageNumber: pageNumber,
                    hasMorePages: response.data.hasMore,
                });
            });
        })
    }
    handleCreateArticleSubmission(newArticleName, categoryId) {
        axios.post(`/api/articles/`, { name: newArticleName, categoryId: categoryId }, { withCredentials: true })
        .then((response) => {
            this.onSubmissionRedirect(response.data.name,response.data.id);
        },
        (error) => {
            this.setState({
                createWorldDialogErrorMessage: error.message
            });
        });
    }
    onSubmissionRedirect(AppBarName,ArticleId){
        const { history } = this.props;
        this.props.updateAppBarTitle(AppBarName);
        history.push(`/articles/${ArticleId}`);
    }

    async changeTitle(articleIndex, newTitle) {
        const newArticles = [...this.state.articles];
        const article = newArticles[articleIndex];
        try {
            const response = await apiHelper.renameArticle(newTitle, article.id);
            article.name = response.data.name;
            this.setState({articles: newArticles});
        } catch(error) {
            // TODO: Display error message
        };
    }


    render() {
        const { classes } = this.props;

        const listItems = this.state.articles.map((article, index) => {
            return (
                <ArticleListItem
                    key={article.id}
                    article={article}
                    onDelete={this.deleteArticle}
                    onDone={async (newTitle) => await this.changeTitle(index, newTitle)}
                    updateAppBarTitle={(newTitle) => this.props.updateAppBarTitle(newTitle, index)}
                />
            );
        });

        return (
            <div
                className={classes.pageBackground}
            >
            <Pages
                pageNumber ={this.state.pageNumber}
                hasMorePages = {this.state.hasMorePages}
                incrementPage = {this.incrementPage}
                decrementPage = {this.decrementPage}
                content={<NonExpandingList title={"Articles"} listItems={listItems} />}
            />
                <Fab
                    color='primary'
                    className={classes.createArticleButton}
                    onClick={this.handleOpeningCreateArticleDialog}
                >
                    <AddIcon />
                </Fab>
                <CreateArticleDialog
                    categories={this.state.categories}
                    errorMessage={this.state.createArticleDialogErrorMessage}
                    open={this.state.createArticleDialogIsOpen}
                    onClose={this.handleClosingCreateArticleDialog}
                    onCreate={this.handleCreateArticleSubmission}
                />
            </div>
        );
    }
}

export default withRouter(withStyles(styles)(ArticlesList));

