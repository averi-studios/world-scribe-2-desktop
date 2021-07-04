import React from 'react';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import ArticleSnippetListItem from './articleSnippetListItem';
import Paper from '@material-ui/core/Paper';
import Modal from '../../ReusableComponents/modal';
import Pages from '../../ReusableComponents/pages';
import { Typography } from '@material-ui/core';

const axios = require('axios');

const styles = theme => ({
    root: {
        padding: '30px 0',
        float: 'left',
        display: "flex",
        flexDirection: "column"
    },
    createSnippetButton: {
        marginTop: '20px',
        marginLeft: "95%",
    },
    modalDiv:{
        width:'300px',
    },
    snippetList: {
        padding: 20,
    },
    navigationButtonsWrapper: {
        alignSelf: "flex-start"
    },
});

class ArticleSnippetMainTab extends React.Component{
    constructor(props){
        super(props);
        this.articleId = props.articleId;
        this.state = {
            hasMorePages:false,
            pageNumber:1,
            snippets: [],
            modalIsOpen:false,
            createSnippetInputValue: '',
            createSnippetErrorMessage: '',
        };
        this.handleOpeningCreateSnippetDialog = this.handleOpeningCreateSnippetDialog.bind(this);
        this.handleClosingCreateSnippetDialog = this.handleClosingCreateSnippetDialog.bind(this);
        this.handleCreateSnippetSubmission = this.handleCreateSnippetSubmission.bind(this);
        this.handleModalTextChange = this.handleModalTextChange.bind(this);
        this.deleteSnippet = this.deleteSnippet.bind(this);
        this.getPage = this.getPage.bind(this);
        this.incrementPage = this.incrementPage.bind(this);
        this.decrementPage = this.decrementPage.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    componentDidMount() {
        this.getPage();
    }

    getPage() {
        axios.get(`/api/articles/${this.articleId}/snippets?page=${this.state.pageNumber}&size=10`, { withCredentials: true })
        .then((response) => {
            this.setState({
                snippets: response.data.snippets,
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
                this.getPage();
            });
        }
    }
    decrementPage(){
        if(this.state.pageNumber !== 1){
            this.setState({
                pageNumber: this.state.pageNumber-1
            }, ()=>{
                this.getPage();                
            });
        }
    }
    handleOpeningCreateSnippetDialog() {
        this.setState({
            modalIsOpen: true,
        });
    }

    handleClosingCreateSnippetDialog() {
        this.setState({
            modalIsOpen: false,
            createSnippetInputValue: '',
        });
    }
    handleCreateSnippetSubmission() {
        let name = this.state.createSnippetInputValue;
        if (name === '') {
            this.setState({
                createSnippetErrorMessage: 'Name cannot be empty',
            });
            return;
        }
        axios.post(`/api/articles/${this.articleId}/snippets/`, { name: name }, { withCredentials: true })
        .then((response) => {
            this.onSubmissionRedirect(response.data.name,response.data.id);
        })
        .catch((error) => {
            this.setState({
                createSnippetErrorMessage: error.response.data,
            });
        });
    }
    onSubmissionRedirect(AppBarName,snippetId){
        const { history } = this.props;
        this.props.updateAppBarTitle(AppBarName);
        history.push(`/articles/${this.articleId}/snippets/${snippetId}/content/`);
    }
    handleModalTextChange(e){
        let changedText = e.target.value;
        this.setState({createSnippetInputValue: changedText});
    }
    
    deleteSnippet(snippetId){
        axios.delete(`/api/articles/${this.articleId}/snippets/${snippetId}`,{withCredentials:true})
        .then((resonse) => {
            let pageNumber = this.state.pageNumber;
            if ((this.state.snippets.length === 1) && (pageNumber > 1)) {
                pageNumber = pageNumber - 1;
            }
            axios.get(`/api/articles/${this.articleId}/snippets?page=${pageNumber}&size=10`, { withCredentials: true })
            .then((response) => {
                this.setState({
                    snippets: response.data.snippets,
                    pageNumber: pageNumber,
                    hasMorePages: response.data.hasMore,
                });
            });
        });
    }

    handleKeyDown = (e) => {
        if (e.key === 'Enter') {
          this.handleCreateSnippetSubmission();
        }
      }

    render(){
        const {classes} = this.props;
        const bottomRightButton = (
            <Fab
                color='primary'
                className={classes.createSnippetButton}
                onClick={this.handleOpeningCreateSnippetDialog}
            >
                <AddIcon />
            </Fab>
        );
        return(
            <div>
                <Pages 
                pageNumber ={this.state.pageNumber}
                hasMorePages = {this.state.hasMorePages}
                incrementPage = {this.incrementPage}
                decrementPage = {this.decrementPage}
                bottomRightButton ={bottomRightButton}
                content={
                    <Paper className={classes.snippetList}>
                    {this.state.snippets.map((snippet) => (
                        <ArticleSnippetListItem articleId={this.articleId} updateAppBarTitle={this.props.updateAppBarTitle} key={snippet.id} onDelete={this.deleteSnippet} snippet={snippet}/>
                    ))}</Paper>
                    }
                />
                <div className={classes.modalDiv}>
                    <Modal
                        open={this.state.modalIsOpen}
                        header={"Create a new snippet"}
                        content={
                            <div>
                                <input type="text" value={this.state.createSnippetInputValue} onChange={this.handleModalTextChange} onKeyDown={this.handleKeyDown}/>
                                <Typography variant='caption' color='error'>{this.state.createSnippetErrorMessage}</Typography>
                            </div>
                        }
                        onClose={this.handleClosingCreateSnippetDialog}
                        onCreate={this.handleCreateSnippetSubmission}
                    />
                </div>
            </div>
        )
    }
}

export default withRouter(withStyles(styles)(ArticleSnippetMainTab));