import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

const DialogTitle = withStyles(theme => ({
    root: {
        'min-width':'400px',
        borderBottom: `1px solid ${theme.palette.divider}`,
        margin: 0,
        padding: theme.spacing.unit * 2,
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing.unit,
        top: theme.spacing.unit,
        color: theme.palette.grey[500],
    },
}))(props => {
    const { children, classes, onClose } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles(theme => ({
    root: {
        margin: 0,
        padding: theme.spacing.unit * 2,
    },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
    root: {
        borderTop: `1px solid ${theme.palette.divider}`,
        margin: 0,
        padding: theme.spacing.unit,
    },
}))(MuiDialogActions);

const Modal = (props) =>{
        return (
            <div>
                <Dialog
                    onClose={props.onClose}
                    aria-labelledby="dialog-title"
                    open={props.open}
                >
                    <DialogTitle id="dialog-title" onClose={props.onClose}>
                        {props.header}
                    </DialogTitle>
                    <DialogContent>
                        {props.content}
                        <span style={{color: 'red'}}>{props.errorMessage || ''}</span>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={props.onClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={props.onCreate} color="primary">
                            Continue
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    };

export default Modal;