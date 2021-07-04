import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = theme => ({
    listSheet: {
        padding: 20,
        display: "flex",
        flexDirection: "column",
    },
    buttonsWrapper: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
})

class Pages extends React.Component{
    render(){
        const {classes} = this.props;
        return(
        <div className={classes.listSheet}>
            {this.props.content}
            <div className={classes.buttonsWrapper}>
                <div className={classes.navigationButtonsWrapper}>
                    <Button color="primary" className={classes.previousButton} disabled={this.props.pageNumber === 1} onClick={this.props.decrementPage}>
                        Previous
                    </Button>
                    <Button color="primary" onClick={this.props.incrementPage} disabled={!this.props.hasMorePages}>
                        Next
                    </Button>
                </div>
                <div className={classes.bottomRightButtonWrapper}>
                    {this.props.bottomRightButton}
                </div>
            </div>
        </div>
        )
    }
}

export default withStyles(styles)(Pages)