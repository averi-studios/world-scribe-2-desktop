import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
    dialog: {
        maxWidth: "xl"
    },
    dialogContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '30px'
    },
    message: {
        fontSize: '5em'
    },
    loadingCircle: {
        color: 'primary',
        size: 100
    }
});

class LoadingDialog extends React.Component {
    render() {
        const { classes } = this.props;

        return (
            <Dialog
                className={classes.dialog}
                fullWidth
                open={this.props.open}
                onClose={()=> {
                    this.props.onClose() }
                }
            >
                <DialogTitle
                    className={classes.message}
                >
                    {this.props.message}
                </DialogTitle>
                <DialogContent
                    className={classes.dialogContent}
                >
                    <CircularProgress
                        className={classes.loadingCircle}
                    />
                </DialogContent>
            </Dialog>
        );
    }
}

export default withStyles(styles)(LoadingDialog);
