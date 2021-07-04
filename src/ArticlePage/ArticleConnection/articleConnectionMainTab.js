import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import CreateConnectionDialog from './createConnectionDialog';
import ConnectionListItem from './connectionListItem';
import Pages from '../../ReusableComponents/pages';

const axios = require('axios');

const styles = theme => ({
    root: {
        padding: '30px 0',
        float: 'left',
        display: "flex",
        flexDirection: "column",
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    createConnectionButton: {
        marginTop: '20px',
        marginLeft: "95%",
    }
});

class ArticleConnectionsMainTab extends React.Component{
    constructor(props){
        super(props);

        this.articleId = props.articleId;

        this.state = {
            pageNumber: 1,
            hasMorePages: false,
            connections: [],
            availableConnections: [],
            createConnectionDialogErrorMessage: '',
            createConnectionDialogIsOpen:false,
        };

        this.refreshConnectionData = this.refreshConnectionData.bind(this);
        this.handleOpeningCreateConnectionDialog = this.handleOpeningCreateConnectionDialog.bind(this);
        this.handleClosingCreateConnectionDialog = this.handleClosingCreateConnectionDialog.bind(this);
        this.handleCreateConnectionSubmission = this.handleCreateConnectionSubmission.bind(this);
        this.deleteConnection = this.deleteConnection.bind(this);
        this.getPage = this.getPage.bind(this);
        this.incrementPage = this.incrementPage.bind(this);
        this.decrementPage = this.decrementPage.bind(this);
    }

    componentDidMount() {
        this.refreshConnectionData();
    };

    refreshConnectionData() {
        let getConnectionsRequest = axios.get(`/api/articles/${this.articleId}/connections?page=${this.state.pageNumber}&size=10`, { withCredentials: true });
        let getAvailableConnectionsRequest = axios.get(`/api/articles/${this.articleId}/connections/available/`, { withCredentials: true });
        Promise.all([getConnectionsRequest, getAvailableConnectionsRequest])
        .then((responses) => {
            let connections = responses[0].data.connections;
            let hasMorePages = responses[0].data.hasMore;
            let availableConnections = responses[1].data;
            this.setState({
                connections: connections,
                availableConnections: availableConnections,
                createConnectionDialogErrorMessage: '',
                createConnectionDialogIsOpen:false,
                hasMorePages: hasMorePages,
            });
        }, (error) => {
            //TODO: Handle error responses
        });
    }

    handleOpeningCreateConnectionDialog() {
        this.setState({
            createConnectionDialogIsOpen: true
        });
    }

    handleClosingCreateConnectionDialog() {
        this.setState({
            createConnectionDialogIsOpen: false
        });
    }

    handleCreateConnectionSubmission(otherArticleId, clearDialogSelection) {
        if (otherArticleId === -1) {
            this.setState({
                createConnectionDialogErrorMessage: 'Connected Article cannot be blank'
            });
        }
        else {
            let body = { otherArticleId: otherArticleId }
            axios.post(`/api/articles/${this.articleId}/connections/`, body, { withCredentials: true })
            .then((response) => {
                this.onSubmissionRedirect(response.data.id);
            }, (error) => {
                //TODO: Handle error response
            });
        }
    }
    onSubmissionRedirect(connectionId){
        const { history } = this.props;
        history.push(`/articles/${this.articleId}/connections/${connectionId}`);
    }

    getPage(){
        this.refreshConnectionData();
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

    deleteConnection(connectionId){
        axios.delete(`/api/articles/${this.articleId}/connections/${connectionId}/`,{withCredentials: true})
        .then((response) => {
            if ((this.state.connections.length === 1) && (this.state.pageNumber > 1)) {
                this.setState({
                    pageNumber: this.state.pageNumber - 1,
                });
            }
            this.refreshConnectionData();
        })
    }

    render(){
        const { classes } = this.props;

        const listItems = this.state.connections.map((connection) => {
            return (<ConnectionListItem
                key={connection.id}
                connection={connection}
                updateAppBarTitle={this.props.updateAppBarTitle}
                onDelete={this.deleteConnection}
            />);
        })

        return(
            <div>
                <Pages 
                pageNumber ={this.state.pageNumber}
                hasMorePages = {this.state.hasMorePages}
                incrementPage = {this.incrementPage}
                decrementPage = {this.decrementPage}
                content={<div>{listItems}</div>}
                bottomRightButton ={
                    <Fab
                        color='primary'
                        className={classes.createConnectionButton}
                        onClick={this.handleOpeningCreateConnectionDialog}
                    >
                        <AddIcon />
                    </Fab>
                    }/>

                <CreateConnectionDialog
                    availableConnections={this.state.availableConnections}
                    errorMessage={this.state.createConnectionDialogErrorMessage}
                    open={this.state.createConnectionDialogIsOpen}
                    onClose={this.handleClosingCreateConnectionDialog}
                    onCreate={this.handleCreateConnectionSubmission}
                />
            </div>
        )
    }
}

export default withRouter(withStyles(styles)(ArticleConnectionsMainTab));
