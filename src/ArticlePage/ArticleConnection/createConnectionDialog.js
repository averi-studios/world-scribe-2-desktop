import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
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

class CreateConnectionDialog extends React.Component {
    constructor(props) {
        super(props);

        this.availableConnections = this.props.availableConnections;

        this.state = {
            currentlyDisplayedCategoryId: -1,
            selectedArticleId: -1,
            displayedArticles: []
        };

        this.handleCategorySelection = this.handleCategorySelection.bind(this);
        this.handleArticleSelection = this.handleArticleSelection.bind(this);
        this.clearSelection = this.clearSelection.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    handleCategorySelection(event) {
        let categorySelection = event.target.value;

        let displayedArticles = [];
        for (let categoryObject of this.props.availableConnections) {
            if (categoryObject.name === categorySelection) {
                displayedArticles = categoryObject.articles;
                break;
            }
        }

        this.setState({
            currentlyDisplayedCategoryId: categorySelection,
            displayedArticles: displayedArticles,
            selectedArticleId: displayedArticles.length > 0 ? displayedArticles[0].id : -1
        });
    }

    handleArticleSelection(event) {
        let articleSelection = event.target.value;

        this.setState({
            selectedArticleId: articleSelection
        });
    }

    clearSelection() {
        this.setState({
            currentlyDisplayedCategoryId: -1,
            selectedArticleId: -1,
        });
    }

    handleKeyDown = (e) => {
        if (e.key === 'Enter') {
          this.props.onCreate(this.state.selectedArticleId, this.clearSelection);
        }
      }

    render() {
        const { classes } = this.props;

        return (
            <Dialog
                open={this.props.open}
                onClose={this.props.onClose}
            >
                <DialogTitle id="form-dialog-title">Create a New Connection</DialogTitle>
                <DialogContent
                    className={classes.dialogContent}
                >
                    <FormControl
                        required
                        className={classes.categorySelect}
                        onKeyDown={this.handleKeyDown}
                    >
                        <InputLabel>
                            Category
                        </InputLabel>
                        <Select
                            value={this.state.currentlyDisplayedCategoryId}
                            onChange={this.handleCategorySelection}
                        >
                            {this.props.availableConnections.map((categoryObject) => {
                                return (
                                    <MenuItem
                                        key={categoryObject.name}
                                        value={categoryObject.name}
                                    >
                                        {categoryObject.name}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                    <FormControl
                        required
                        className={classes.articleSelect}
                        onKeyDown={this.handleKeyDown}
                    >
                        <InputLabel>
                            Connected Article
                        </InputLabel>
                        <Select
                            value={this.state.selectedArticleId}
                            onChange={this.handleArticleSelection}
                        >
                            {this.state.displayedArticles.map((article) => {
                                return (
                                    <MenuItem
                                        key={article.id}
                                        value={article.id}
                                    >
                                        {article.name}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </FormControl>
                    <Typography
                        variant="caption"
                        color='error'
                    >
                        {this.props.errorMessage}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.onClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => this.props.onCreate(this.state.selectedArticleId, this.clearSelection)} color="primary">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(styles)(CreateConnectionDialog);
