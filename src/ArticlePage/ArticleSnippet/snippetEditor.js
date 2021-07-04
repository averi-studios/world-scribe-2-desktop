import React from 'react';
import InputField from '../../ReusableComponents/inputField';
import { withRouter } from 'react-router-dom';
import { withStyles } from "@material-ui/core/styles/index";

const styles = theme => ({
    content: {
        height: "100vh",
        margin: "50px 20px 20px 20px"
    }
});

const axios = require('axios');
class SnippetEditor extends React.Component {
    constructor(props){
        super(props);

        this.articleId = props.match.params.articleId;
        this.snippetId = props.match.params.snippetId;
        this.state ={ 
            content:'',
    }
        this.changeValue = this.changeValue.bind(this);
    }

    componentDidMount() {
        axios.get(`/api/articles/${this.articleId}/snippets/${this.snippetId}/content/`, { withCredentials: true })
        .then((response) => {
            this.setState({
                content: response.data.content,
            });
        },
        //TODO: Handle error response from backend
        );
    }

    changeValue(content){
        this.setState({content: content});
        const sendValue = {content: content};
        axios.patch(`/api/articles/${this.articleId}/snippets/${this.snippetId}/content/`,sendValue,{ withCredentials: true });
    }
    
    render(){
        const { classes } = this.props;
        return(
            <div
                className={classes.content}
            >
                <InputField value={this.state.content} name={"Snippet Value"} onChange={this.changeValue} />
            </div>
        )
    }
}


export default withRouter(withStyles(styles)(SnippetEditor));