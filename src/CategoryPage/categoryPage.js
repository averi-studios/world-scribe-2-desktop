import React from 'react';
import { withRouter } from "react-router";

import { withStyles } from "@material-ui/core/styles/index";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import ArticlesIcon from '@material-ui/icons/InsertDriveFile';
import FieldsIcon from '@material-ui/icons/Info';

import CategorySidePanel from './categorySidePanel';
import CategoryArticlesTab from './categoryArticlesTab';
import CategoryFieldsTab from './categoryFieldsTab';

const axios = require('axios');

const styles = theme => ({
    content: {
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

class CategoryPage extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            categoryName: '',
            categoryDescription: '',
            tabIndex: 0
        }

        this.categoryId = props.match.params.categoryId;

        this.handleTabChange = this.handleTabChange.bind(this);
        this.handleChangeDescription = this.handleChangeDescription.bind(this);
    }

    componentDidMount() {
        axios.get(`/api/categories/${this.categoryId}/metadata/`, { withCredentials: true })
        .then((response) => {
            this.props.updateAppBarTitle(response.data.name);
            this.setState({
                categoryName: response.data.name,
                categoryDescription: response.data.description
            });
        },
        (error) => {
            //TODO: Handle error response
        });
    }

    componentDidUpdate(prevProps, prevState) {
        const newCategoryId = this.props.match.params.categoryId;

        if (this.categoryId !== newCategoryId) {
            this.categoryId = newCategoryId;

            axios.get(`/api/categories/${newCategoryId}/metadata/`, { withCredentials: true })
            .then((response) => {
                this.props.updateAppBarTitle(response.data.name);
                this.setState({
                    categoryName: response.data.name
                });
            },
            (error) => {
                //TODO: Handle error response
            });
        }
    }
    
    handleTabChange(event, tabIndex) {
        this.setState({
            tabIndex: tabIndex
        });
    }

    handleChangeDescription(newDescription) {
        this.setState({ categoryDescription: newDescription });
        const requestBody = { description: newDescription };
        axios.patch(`/api/categories/${this.categoryId}/description/`, requestBody ,{ withCredentials: true });
    }

    render() {
        const { classes } = this.props;
        const { tabIndex } = this.state;

        return (
            <div>
                <CategorySidePanel
                    categoryId={this.categoryId}
                    categoryName={this.state.categoryName}
                    categoryDescription={this.state.categoryDescription}
                    onChangeDescription={this.handleChangeDescription}
                />
                <div
                    style={{
                    width: 'calc(100% - 300px)',
                }}>
                    <AppBar position="static">
                        <Tabs
                            value={tabIndex}
                            onChange={this.handleTabChange}
                            scrollButtons="on"
                        >
                            <Tab label="Articles" icon={<ArticlesIcon />} />
                            <Tab label="Fields" icon={<FieldsIcon />} />
                        </Tabs>
                    </AppBar>
                    <div className={classes.content}>
                        {tabIndex === 0 && <TabContainer>
                            <CategoryArticlesTab categoryId={this.categoryId} updateAppBarTitle={this.props.updateAppBarTitle} />
                        </TabContainer>}
                        {tabIndex === 1 && <TabContainer>
                            <CategoryFieldsTab categoryId={this.categoryId} />
                        </TabContainer>}
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(withStyles(styles)(CategoryPage));
