import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';


const styles = theme => ({
    sheet: {
        paddingBottom: 15
    },
    list: {
        width: "100%"
    },
});
function ListDisplayer(props) {
    const { classes } = props;
    return(
            <ExpansionPanel
                className={classes.sheet}
                defaultExpanded={true}
            >
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                >
                    <Typography
                        variant="h2"
                    >
                        {props.title}
                    </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <List className={classes.list} >
                        {props.listItems}
                    </List>
                </ExpansionPanelDetails>
            </ExpansionPanel>
    )};

export default withStyles(styles)(ListDisplayer);