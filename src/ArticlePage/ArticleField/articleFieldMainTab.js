import React from 'react';
import { withRouter } from 'react-router-dom';
import ArticleFieldListItem from './articleFieldListItem';
import Pages from '../../ReusableComponents/pages';

const axios = require('axios');

class ArticleFieldsMainTab extends React.Component{
    constructor(props){
        super(props);
        this.articleId = props.articleId;
        this.state = {
            pageNumber: 1,
            hasMorePages:false,
            fields: []
        };
        this.getArticlePage = this.getArticlePage.bind(this);
        this.incrementPage = this.incrementPage.bind(this);
        this.decrementPage = this.decrementPage.bind(this);
    }

    componentDidMount() {
        this.getArticlePage()
    }

    getArticlePage(){
        axios.get(`/api/articles/${this.articleId}/fields?page=${this.state.pageNumber}&size=10`, { withCredentials: true })
        .then((response) => {
            this.setState({
                fields: response.data.fields,
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


    render(){
        return(
            <div>
                <Pages 
                    pageNumber ={this.state.pageNumber}
                    hasMorePages = {this.state.hasMorePages}
                    incrementPage = {this.incrementPage}
                    decrementPage = {this.decrementPage}
                    content={
                        this.state.fields.map((field) => (
                        <ArticleFieldListItem key={field.id} field={field} />
                    ))}
                />
                
            </div>
        )
    }
}


export default withRouter(ArticleFieldsMainTab);