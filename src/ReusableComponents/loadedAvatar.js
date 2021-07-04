import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';

const axios = require('axios');
const globals = require('../globals');

const styles = {
    bigAvatar: {
        margin: 10,
        width: 80,
        height: 80,
    }
};

class LoadedAvatar extends React.Component {
    constructor(props) {
        super(props);

        this.imageUrl = this.props.imageUrl;

        this.state = {
            imageExists: false
        }
    }

    componentDidMount() {
        axios.get(this.imageUrl, { withCredentials: true })
        .then((response) => {
            this.setState({
                imageExists: true
            });
        })
    }

    render() {
        const { classes } = this.props;

        let avatar;
        if (this.state.imageExists){
            avatar = <Avatar src={globals.requestPrefix + this.imageUrl} className={classes.bigAvatar}/>
        } else{
            avatar = <Avatar className={classes.bigAvatar}>{this.props.altText.slice(0, 1)}</Avatar>
        }

         return avatar;
    }
}

export default withStyles(styles)(LoadedAvatar);
