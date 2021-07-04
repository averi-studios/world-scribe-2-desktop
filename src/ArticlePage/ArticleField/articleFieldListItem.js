import React from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import InputField from '../../ReusableComponents/inputField';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';


const axios = require('axios');

const styles = theme => ({
    root: {
        padding: '30px 0',
        float: 'left',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
       fontWeight: theme.typography.fontWeightRegular,
    }
});

class ArticleFieldListItem extends React.Component{
    constructor(props){
        super(props);
        this.articleId = props.match.params.articleId;
        this.state = {
            field: props.field,
            value: props.field.value
        };
        this.changeValue = this.changeValue.bind(this);
    }

    changeValue(newContent){
        this.setState({value: newContent});
        const sendValue = {value:newContent};
        axios.patch(`/api/articles/${this.articleId}/fields/${this.state.field.id}`,sendValue,{ withCredentials: true });
    };
    render(){
        const { classes } = this.props;
        return(
            <ExpansionPanel defaultExpanded key={this.state.field.id}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>{this.state.field.name}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <InputField value={this.state.value} name={this.state.field.id.toString()}
                            onChange={this.changeValue}/>
            </ExpansionPanelDetails>
        </ExpansionPanel>
        )
    }
}

export default withRouter(withStyles(styles)(ArticleFieldListItem));