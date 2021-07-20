import React from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import blueGrey from '@material-ui/core/colors/blueGrey';
import AddIcon from '@material-ui/icons/Add';

import CategoryListItem from './categoryListItem';
import  Modal  from '../ReusableComponents/modal';
import NonExpandingList from '../ReusableComponents/nonExpandingList';
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
    CategoriesList: {
        width: '100%'
    },
    createCategoryButton: {
        alignSelf: "flex-end"
    }
});

class CategoryList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNumber: 1,
            hasMorePages:false,
            createCategoryDialogIsOpen: false,
            categories: [],
            newCategoryName: '',
        }
        this.handleOpeningCreateCategoryDialog = this.handleOpeningCreateCategoryDialog.bind(this);
        this.handleClosingCreateCategoryDialog = this.handleClosingCreateCategoryDialog.bind(this);
        this.handleCreateCategorySubmission = this.handleCreateCategorySubmission.bind(this);
        this.handleModalTextChange = this.handleModalTextChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.deleteCategory = this.deleteCategory.bind(this);
        this.getPage = this.getPage.bind(this);
        this.incrementPage = this.incrementPage.bind(this);
        this.decrementPage = this.decrementPage.bind(this);
    }

    componentDidMount() {
        this.props.updateAppBarTitle('All Categories');
        this.getPage();
    };


    getPage() {
        axios.get(`/api/categories?page=${this.state.pageNumber}&size=10`, { withCredentials: true })
        .then((response) => {
            this.setState({
                categories: response.data.categories,
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
    handleOpeningCreateCategoryDialog() {
        this.setState({
            createCategoryDialogIsOpen: true
        });
    }

    handleClosingCreateCategoryDialog() {
        this.setState({
            createCategoryDialogIsOpen: false,
            newCategoryName:''
        });
    }

    deleteCategory(categoryId){
        axios.delete(`/api/categories/${categoryId}/`,{withCredentials:true})
        .then((response) => {
            let pageNumber = this.state.pageNumber;
            if ((this.state.categories.length === 1) && (this.state.pageNumber > 1)) {
                pageNumber = pageNumber - 1;
            }
            axios.get(`/api/categories?page=${pageNumber}&size=10`, { withCredentials: true })
            .then((response) => {
                this.setState({
                    categories: response.data.categories,
                    pageNumber: pageNumber,
                    hasMorePages: response.data.hasMore,
                });
            });
        })
    }
    handleCreateCategorySubmission() {
        this.setState({createCategoryDialogIsOpen: false});
        if(this.state.newCategoryName){
            axios.post(`/api/categories/`,{name:this.state.newCategoryName}, {withCredentials:true})
            .then((response) => {
                this.onSubmissionRedirect(response.data.name,response.data.id);
            })
        }
    }
    onSubmissionRedirect(AppBarName,categoryId){
        const { history } = this.props;
        this.props.updateAppBarTitle(AppBarName);
        history.push(`/categories/${categoryId}`);
    }

    handleModalTextChange(e) {
        let changedText = e.target.value;
        this.setState({newCategoryName: changedText});
    }
    handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            this.handleCreateCategorySubmission();
        }
      }

    async changeTitle(categoryIndex, newTitle) {
        const newCategories = [...this.state.categories];
        const category = newCategories[categoryIndex];
        try {
            const response = await apiHelper.renameCategory(newTitle, category.id);
            category.name = response.data.name;
            this.setState({categories: newCategories});
        } catch(error) {
            // TODO: Display error message
        };
    }

    render() {
        const { classes } = this.props;
        const onDelete = this.deleteCategory;

        const listItems = this.state.categories.map((category, index) => {
            return (
                <CategoryListItem
                    key={category.id}
                    category={category}
                    onDelete={onDelete}
                    onDone={async (newTitle) => await this.changeTitle(index, newTitle)}
                    updateAppBarTitle={this.props.updateAppBarTitle}
                />
            );
        })
        return (
            <div
                className={classes.pageBackground}
            >
                <Pages
                    pageNumber ={this.state.pageNumber}
                    hasMorePages = {this.state.hasMorePages}
                    incrementPage = {this.incrementPage}
                    decrementPage = {this.decrementPage}
                    content={<NonExpandingList title={"Categories"} listItems={listItems} />}
                    bottomRightButton = {
                        <Fab
                            color='primary'
                            className={classes.createCategoryButton}
                            onClick={this.handleOpeningCreateCategoryDialog}
                        >
                            <AddIcon />
                        </Fab>
                    }
                />
                <Modal
                header={"Create a new category"}
                content={<input type="text" value={this.state.newCategoryName} onKeyDown={this.handleKeyDown} onChange={this.handleModalTextChange} />}
                open={this.state.createCategoryDialogIsOpen}
                onClose={this.handleClosingCreateCategoryDialog}
                onCreate={this.handleCreateCategorySubmission}
                />
            </div>
        );
    }
}

export default withRouter(withStyles(styles)(CategoryList));

