import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import NonExpandingList from '../ReusableComponents/nonExpandingList';
import Pages from '../ReusableComponents/pages';

import blueGrey from '@material-ui/core/colors/blueGrey';

import AddIcon from '@material-ui/icons/Add';

import CreateArticleDialog from '../ReusableComponents/createArticleDialog';
import ArticleListItem from '../ArticleListPage/articleListItem';

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
    }
});

class CategoryArticlesTab extends React.Component {
    constructor(props) {
        super(props);

        //TODO: Load Article data from the backend
        this.state = {
            pageNumber: 1,
            hasMorePages:false,
            createArticleDialogIsOpen: false,
            createArticleDialogErrorMessage: ' ',
            articles: []
        }

        this.handleOpeningCreateArticleDialog = this.handleOpeningCreateArticleDialog.bind(this);
        this.handleClosingCreateArticleDialog = this.handleClosingCreateArticleDialog.bind(this);
        this.handleCreateArticleSubmission = this.handleCreateArticleSubmission.bind(this);
        this.deleteArticle = this.deleteArticle.bind(this);
        this.getArticlePage = this.getArticlePage.bind(this);
        this.incrementPage = this.incrementPage.bind(this);
        this.decrementPage = this.decrementPage.bind(this);
    }

    componentDidMount() {
        this.getArticlePage();
    };

    getArticlePage(){
        axios.get(`/api/categories/${this.props.categoryId}/articles?page=${this.state.pageNumber}&size=10`, { withCredentials: true })
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

    deleteArticle(articleId){
        axios.delete(`/api/articles/${articleId}/`,{withCredentials:true})
        .then((response) => {          
            let pageNumber = this.state.pageNumber;
            if ((this.state.articles.length === 1) && (pageNumber > 1)) {
                pageNumber = pageNumber - 1;
            }
            axios.get(`/api/categories/${this.props.categoryId}/articles?page=${pageNumber}&size=10`, { withCredentials: true })
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
            this.setState({
                createArticleDialogIsOpen: false
            });
            axios.get(`/api/categories/${this.props.categoryId}/articles?page=${this.state.pageNumber}&size=10`, { withCredentials: true })
            .then((response) => {
                this.setState({
                    articles: response.data.articles,
                    hasMorePages: response.data.hasMore,
                });
            });
        },
        (error) => {
            this.setState({
                createArticleDialogErrorMessage: error.response.data
            });
        });
    }

    render() {
        const { classes } = this.props;

        const listItems = this.state.articles.map((article) => {
            return (
                <ArticleListItem
                    key={article.id}
                    article={article}
                    onDelete={this.deleteArticle}
                    updateAppBarTitle={this.props.updateAppBarTitle}
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
                    bottomRightButton ={
                        <Fab
                            color='primary'
                            className={classes.createArticleButton}
                            onClick={this.handleOpeningCreateArticleDialog}
                        >
                            <AddIcon />
                        </Fab>
                    }   
                />

                <CreateArticleDialog
                    categoryId={this.props.categoryId}
                    categories={[]}
                    errorMessage={this.state.createArticleDialogErrorMessage}
                    open={this.state.createArticleDialogIsOpen}
                    onClose={this.handleClosingCreateArticleDialog}
                    onCreate={this.handleCreateArticleSubmission}
                />
            </div>
        );
    }
}

export default withStyles(styles)(CategoryArticlesTab);

