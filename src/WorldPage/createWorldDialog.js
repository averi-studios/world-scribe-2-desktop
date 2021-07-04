import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
});

const forbiddenCharactersString = ['/', '\\', '.', '<', '>', ':', '"', '|', '?', '*'].join(' ');

class CreateWorldDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            newWorldName: ''
        };

        this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    handleTextFieldChange(event) {
        this.setState({
            newWorldName: event.target.value
        });
    }
    handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            this.props.onCreate(this.state.newWorldName)
            this.setState({newWorldName: ''});
        }
      }
    render() {
        return (
            <Dialog
                open={this.props.open}
                onClose={()=> {
                    this.setState({newWorldName: ''});
                    this.props.onClose() }
                }
            >
            <DialogTitle id="form-dialog-title">Create a New World</DialogTitle>
                <DialogContent>
                    <Typography>
                        The name entered below will be used to create a folder on your computer.<br />
                        Because of that, you may NOT include any of the following characters:<br />
                        <b>{forbiddenCharactersString}</b><br />
                        Also, you may NOT use a space as the last character.
                    </Typography>
                    <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Name"
                    type="text"
                    value={this.state.newWorldName}
                    onChange={this.handleTextFieldChange}
                    fullWidth
                    onKeyDown={this.handleKeyDown}
                    />
                    <Typography
                        variant="caption"
                        color='error'
                    >
                        {this.props.errorMessage}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={
                        ()=> {
                            this.setState({newWorldName: ''});
                            this.props.onClose()
                            
                        }
                    } color="primary">
                        Cancel
                    </Button>
                    <Button onClick={
                        () => {
                            this.props.onCreate(this.state.newWorldName)
                            this.setState({newWorldName: ''});
                        }
                    } color="primary">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(styles)(CreateWorldDialog);