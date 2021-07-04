import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';

import blueGrey from '@material-ui/core/colors/blueGrey';

import AddIcon from '@material-ui/icons/Add';
import NonExpandingList from '../ReusableComponents/nonExpandingList';
import Modal from '../ReusableComponents/modal';
import Pages from '../ReusableComponents/pages';
import CategoryFieldListItem from './categoryFieldListItem';

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
    fieldsList: {
        width: '100%'
    },
    createFieldButton: {
        alignSelf: "flex-end"
    }
});

class CategoryFieldsTab extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pageNumber:1,
            hasMorePages:false,
            createFieldDialogIsOpen: false,
            createFieldInputValue: '',
            createFieldDialogErrorMessage: ' ',
            renameFieldDialogIsOpen: false,
            fieldIdBeingRenamed: -1,
            renameFieldInputValue: '',
            renameFieldDialogErrorMessage: ' ',
            fields: []
        }

        this.handleOpeningCreateFieldDialog = this.handleOpeningCreateFieldDialog.bind(this);
        this.handleClosingCreateFieldDialog = this.handleClosingCreateFieldDialog.bind(this);
        this.handleCreateFieldTextChange = this.handleCreateFieldTextChange.bind(this);
        this.handleCreateFieldSubmission = this.handleCreateFieldSubmission.bind(this);
        this.handleOpeningRenameFieldDialog = this.handleOpeningRenameFieldDialog.bind(this);
        this.handleClosingRenameFieldDialog = this.handleClosingRenameFieldDialog.bind(this);
        this.handleRenameFieldTextChange = this.handleRenameFieldTextChange.bind(this);
        this.handleRenameFieldSubmission = this.handleRenameFieldSubmission.bind(this);
        this.handleDeleteField = this.handleDeleteField.bind(this);
        this.getPage = this.getPage.bind(this);
        this.incrementPage = this.incrementPage.bind(this);
        this.decrementPage = this.decrementPage.bind(this);
    }

    componentDidMount() {
        this.getPage();
    };

    getPage(){
        axios.get(`/api/categories/${this.props.categoryId}/fields?page=${this.state.pageNumber}&size=10`, { withCredentials: true })
        .then((response) => {
            this.setState({
                fields: response.data.fields,
                hasMorePages: response.data.hasMore,
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
    handleOpeningCreateFieldDialog() {
        this.setState({
            createFieldDialogErrorMessage: '',
            createFieldDialogIsOpen: true
        });
    }

    handleClosingCreateFieldDialog() {
        this.setState({
            createFieldInputValue:'',
            createFieldDialogIsOpen: false,
        });
    }

    handleDeleteField(fieldId){
        axios.delete(`/api/categories/${this.props.fieldId}/fields/${fieldId}/`,{withCredentials:true})
        .then((response) => {          
            let pageNumber = this.state.pageNumber;
            if ((this.state.fields.length === 1) && (pageNumber > 1)) {
                pageNumber = pageNumber - 1;
            }
            axios.get(`/api/categories/${this.props.categoryId}/fields?page=${pageNumber}&size=10`, { withCredentials: true })
            .then((response) => {
                this.setState({
                    fields: response.data.fields,
                    pageNumber: pageNumber,
                    hasMorePages: response.data.hasMore,
                });
            });
        })
    }

    handleCreateFieldTextChange(event) {
        this.setState({
            createFieldInputValue: event.target.value
        });
    }

    handleCreateFieldSubmission() {
        if (this.state.createFieldInputValue === '') {
            this.setState({
                createFieldDialogErrorMessage: 'Name cannot be empty'
            });
        }
        else {
            axios.post(`/api/categories/${this.props.categoryId}/fields/`, { name: this.state.createFieldInputValue }, { withCredentials: true })
            .then((response) => {
                this.setState({
                    createFieldInputValue: '',
                    createFieldDialogIsOpen: false
                });
                axios.get(`/api/categories/${this.props.categoryId}/fields?page=${this.state.pageNumber}&size=10`, { withCredentials: true })
                .then((response) => {
                    this.setState({
                        fields: response.data.fields,
                        hasMorePages: response.data.hasMore,
                    });
                });
            },
            (error) => {
                this.setState({
                    createFieldDialogErrorMessage: error.response.data
                });
            });
        }
    }

    handleOpeningRenameFieldDialog(field) {
        this.setState({
            renameFieldDialogIsOpen: true,
            fieldIdBeingRenamed: field.id,
            renameFieldInputValue: field.name
        });
    }

    handleClosingRenameFieldDialog() {
        this.setState({
            renameFieldDialogIsOpen: false,
            fieldIdBeingRenamed: -1
        });
    }

    handleRenameFieldTextChange(event) {
        this.setState({
            renameFieldInputValue: event.target.value
        });
    }

    handleRenameFieldSubmission(newFieldName) {
        axios.patch(`/api/categories/${this.props.categoryId}/fields/${this.state.fieldIdBeingRenamed}/name/`, { name: this.state.renameFieldInputValue }, { withCredentials: true })
        .then((response) => {
            this.setState({
                renameFieldDialogIsOpen: false
            });
            axios.get(`/api/categories/${this.props.categoryId}/fields/`, { withCredentials: true })
            .then((response) => {
                this.setState({
                    fields: response.data.fields,
                    hasMorePages: response.data.hasMore,
                });
            });
        },
        (error) => {
            this.setState({
                renameFieldDialogErrorMessage: error.response.data
            });
        });
    }

    render() {
        const { classes } = this.props;

        const listItems = this.state.fields.map((field) => {
            return (
                <CategoryFieldListItem
                    key={field.id}
                    field={field}
                    onRename={this.handleOpeningRenameFieldDialog}
                    onDelete={this.handleDeleteField}
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
                content={<NonExpandingList title={"Fields"} listItems={listItems} />}
                bottomRightButton ={
                    <Fab
                        color='primary'
                        className={classes.createFieldButton}
                        onClick={this.handleOpeningCreateFieldDialog}
                    >
                        <AddIcon />
                    </Fab>
                }
                />
                <div className={classes.modalDiv}>
                    <Modal
                        open={this.state.createFieldDialogIsOpen}
                        header={"Create a New Field"}
                        content={<input type="text" value={this.state.createFieldInputValue} onChange={this.handleCreateFieldTextChange}/>}
                        errorMessage={this.state.createFieldDialogErrorMessage}
                        onClose={this.handleClosingCreateFieldDialog}
                        onCreate={this.handleCreateFieldSubmission}
                    />
                </div>
                <div className={classes.modalDiv}>
                    <Modal
                        open={this.state.renameFieldDialogIsOpen}
                        header={"Rename Field"}
                        content={<input type="text" value={this.state.renameFieldInputValue} onChange={this.handleRenameFieldTextChange}/>}
                        errorMessage={this.state.renameFieldDialogErrorMessage}
                        onClose={this.handleClosingRenameFieldDialog}
                        onCreate={this.handleRenameFieldSubmission}
                    />
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(CategoryFieldsTab);

