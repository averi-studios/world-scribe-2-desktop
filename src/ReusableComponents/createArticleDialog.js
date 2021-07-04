import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const styles = theme => ({
    dialogContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch'
    },
    categorySelect: {
        marginTop: '10px'
    }
});

class CreateArticleDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            newArticleName: '',
            newArticleCategoryId: props.categoryId || -1,
            errorMessage: props.errorMessage
        };

        this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
        this.handleCategorySelection = this.handleCategorySelection.bind(this);
        this.handleCreateButtonClick = this.handleCreateButtonClick.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    handleTextFieldChange(event) {
        this.setState({
            newArticleName: event.target.value
        });
    }

    handleCategorySelection(event) {
        this.setState({
            newArticleCategoryId: event.target.value
        });
    }
    handleKeyDown = (e) => {
        if (e.key === 'Enter') {
          this.handleCreateButtonClick();
        }
      }
    handleCreateButtonClick() {
        if (this.state.newArticleName === '') {
            this.setState({
                errorMessage: "Name cannot be empty"
            });
        }
        else if (this.state.newArticleCategoryId === -1) {
            this.setState({
                errorMessage: "Category cannot be blank"
            });
        }
        else {
            this.props.onCreate(this.state.newArticleName, this.state.newArticleCategoryId);
            this.setState({newArticleName:''})
        }
    }

    render() {
        const { classes } = this.props;

        return (
            <Dialog
                open={this.props.open}
                onClose={
                    ()=> {
                        this.setState({newArticleName: ''})
                        this.props.onClose()                        
                    }
                }
            >
                <DialogTitle id="form-dialog-title">Create a New Article</DialogTitle>
                <DialogContent
                    className={classes.dialogContent}
                >
                    <TextField
                    required
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Name"
                    type="text"
                    value={this.state.newArticleName}
                    onChange={this.handleTextFieldChange}
                    fullWidth
                    onKeyDown={this.handleKeyDown}
                    />
                    {
                        this.props.categoryId
                        ? null
                        : (<FormControl
                            required
                            className={classes.categorySelect}
                            onKeyDown={this.handleKeyDown}
                        >
                            <InputLabel>
                                Category
                            </InputLabel>
                            <Select
                                value={this.state.newArticleCategoryId}
                                onChange={this.handleCategorySelection}
                            >
                                {this.props.categories.map((category) => {
                                    return (
                                        <MenuItem
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>)
                    }
                    <Typography
                        variant="caption"
                        color='error'
                    >
                        {this.state.errorMessage}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={
                    ()=> {
                        this.setState({newArticleName: ''});
                        this.props.onClose();
                    }
                } color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.handleCreateButtonClick} color="primary">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(styles)(CreateArticleDialog);
