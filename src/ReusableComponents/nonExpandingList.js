import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
    sheet: {
        padding: 15
    },
    title:{
        paddingBottom: 15
    },
    list: {
        width: "100%",
    },
});


function NonExpandingList(props) {
    const { classes, headerComponent, title } = props;
    return(
            <Paper
                className={classes.sheet}
            >
                {
                    headerComponent
                    || (
                        <Typography className = {classes.title}
                            variant="h2"
                        >
                            {title}
                        </Typography>
                    )
                }
                <List className={classes.list} >
                    {props.listItems}
                </List>
            </Paper>
    )};

export default withStyles(styles)(NonExpandingList);