import React from 'react';
import '../css/sidePanel.css';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import InputField from '../ReusableComponents/inputField';
import Tooltip from '@material-ui/core/Tooltip';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';

import CloseIcon from '@material-ui/icons/Close';

const globals = require('../globals');
const axios = require("axios");
const styles = {
    bigAvatar: {
        margin: 20,
        width: 250,
        height: 250,
    },
    input: {
        display: 'none',
    },
    categoryDescription: {
        marginTop: 20
    },
    imageHintTooltip: {
        fontSize: '1.5em',
    },
};

class CategorySidePanel extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            emptyImage: true,
            lastImageLoadTimestamp: Date.now(),
            snackbarMessage: '',
        };
        this.saveImage = this.saveImage.bind(this);
        this.handleCloseSnackbar = this.handleCloseSnackbar.bind(this);
    }
    componentDidMount() {
        axios.get(`/api/categories/${this.props.categoryId}/image/`, { withCredentials: true })
        .then((response) => {
            this.setState({
                emptyImage: false,
                lastImageLoadTimestamp: Date.now(),
            });
        },
        (error) => {
            if (error.response.status === 404) {
                this.setState({
                    emptyImage: true
                });
            }
            else {
                //TODO: Handle error response
            }
        });
    }
    saveImage(e){
        const file = e.target.files[0];

        const formData = new FormData();
        formData.append('picture', file);

        axios.put(
            `/api/categories/${this.props.categoryId}/image/`,
            formData,
            {
                headers: {
                    'content-type': 'multipart/form-data'
                },
                withCredentials: true
            })
        .then((response) => {
            this.setState({
                emptyImage: false,
                lastImageLoadTimestamp: Date.now(),
            });
        })
        .catch((error) => {
            if (error.response && error.response.data && error.response.data.includes('File too large')) {
                this.setState({
                    snackbarMessage: 'Image file size is too large. Please select an image under 2MB.',
                });
            }
            else {
                console.log(error);
                this.setState({
                    snackbarMessage: 'An unexpected error occurred.',
                });
            }
        });
    }

    handleCloseSnackbar() {
        this.setState({
            snackbarMessage: '',
        });
    }

     render() {
         const { classes } = this.props;
         let avatar;
         if(this.state.emptyImage){
            avatar = <Avatar className={classes.bigAvatar}>{this.props.categoryName}</Avatar>
         } else{
            avatar = <Avatar className={classes.bigAvatar} src={`${globals.requestPrefix}/api/categories/${this.props.categoryId}/image?timestamp=${this.state.lastImageLoadTimestamp}`} />
         }
        return (
            <div>
                <Paper className='sidePanel'>
                    <Grid container justify="center" alignItems="center">
                        <input
                            accept="image/*"
                            className={classes.input}
                            id="text-button-file"
                            type="file"
                            onChange={this.saveImage}
                        />
                        <label htmlFor="text-button-file">
                            <Tooltip
                                classes={{ tooltip: classes.imageHintTooltip }}
                                title='Click to upload an image (max size: 2MB)'
                                placement='left'
                            >
                                {avatar}
                            </Tooltip>
                        </label>
                    </Grid>
                    <Divider />
                    <InputField
                        className={classes.categoryDescription}
                        value={this.props.categoryDescription}
                        name={this.props.categoryName}
                        onChange={this.props.onChangeDescription}
                    />
                </Paper>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    autoHideDuration={6000}
                    open={this.state.snackbarMessage}
                    onClose={this.handleCloseSnackbar}
                    message={this.state.snackbarMessage}
                    action={[
                        <IconButton
                            key='close-snackbar'
                            color='inherit'
                            onClick={this.handleCloseSnackbar}
                        >
                            <CloseIcon />
                        </IconButton>
                    ]}
                />
            </div>
        )
    }
}

export default withStyles(styles)(CategorySidePanel);