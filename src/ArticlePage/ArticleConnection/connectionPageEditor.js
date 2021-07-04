import React from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Typography } from '@material-ui/core';

import LoadedAvatar from '../../ReusableComponents/loadedAvatar';

const axios = require('axios');

const WAIT_INTERVAL = 1000;

const styles = theme => ({
    contentContainer: {
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    articleCardsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    articleCard: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingLeft: '30px',
        paddingRight: '30px'
    },
    descriptionCard: {
        marginTop: '20px'
    },
    textInput: {
        marginTop: '15px'
    }
});

class ConnectionPageEditor extends React.Component {
    constructor(props){
        super(props);

        this.articleId = props.match.params.articleId;
        this.connectionId = props.match.params.connectionId;

        this.state = {
            mainArticleId: -1,
            mainArticleName: '',
            mainArticleRole: '',
            otherArticleId: -1,
            otherArticleName: '',
            otherArticleRole: '',
            connectionDescription: '',
        };

        this.handleMainArticleRoleChange = this.handleMainArticleRoleChange.bind(this);
        this.handleOtherArticleRoleChange = this.handleOtherArticleRoleChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.sendUpdate = this.sendUpdate.bind(this);
    }

    componentDidMount() {
        this.timer = null;
        this.props.updateAppBarTitle("Edit Connection");

        axios.get(`/api/articles/${this.articleId}/connections/${this.connectionId}/`, { withCredentials: true })
        .then((response) => {
            let connection = response.data;
            this.setState({
                mainArticleId: connection.mainArticleId,
                mainArticleName: connection.mainArticleName,
                mainArticleRole: connection.mainArticleRole,
                otherArticleId: connection.otherArticleId,
                otherArticleName: connection.otherArticleName,
                otherArticleRole: connection.otherArticleRole,
                connectionDescription: connection.description,
            });
        },
        //TODO: Handle error response from backend
        );
    }

    handleMainArticleRoleChange(e) {
        clearTimeout(this.timer);

        this.setState({
            mainArticleRole: e.target.value
        });

        this.timer = setTimeout(() => this.sendUpdate(), WAIT_INTERVAL);
    }

    handleOtherArticleRoleChange(e) {
        clearTimeout(this.timer);

        this.setState({
            otherArticleRole: e.target.value
        });

        this.timer = setTimeout(() => this.sendUpdate(), WAIT_INTERVAL);
    }

    handleDescriptionChange(e) {
        clearTimeout(this.timer);

        this.setState({
            connectionDescription: e.target.value
        });

        this.timer = setTimeout(() => this.sendUpdate(), WAIT_INTERVAL);
    }

    sendUpdate() {
        const body = {
            mainArticleRole: this.state.mainArticleRole,
            otherArticleRole: this.state.otherArticleRole,
            description: this.state.connectionDescription
        };
        axios.patch(`/api/articles/${this.articleId}/connections/${this.connectionId}/`, body, { withCredentials: true });
    }

    render() {
        const { classes } = this.props;

        let mainArticleAvatar;
        if (this.state.mainArticleId === -1) {
            mainArticleAvatar = null;
        }
        else {
            mainArticleAvatar = <LoadedAvatar
                altText={this.state.mainArticleName}
                imageUrl={`/api/articles/${this.state.mainArticleId}/image/`}
            />
        }

        let otherArticleAvatar;
        if (this.state.otherArticleId === -1) {
            otherArticleAvatar = null;
        }
        else {
            otherArticleAvatar = <LoadedAvatar
                altText={this.state.otherArticleName}
                imageUrl={`/api/articles/${this.state.otherArticleId}/image/`}
            />
        }

        return (
            <div className={classes.contentContainer}>
                <div className={classes.articleCardsContainer}>
                    <Card
                        key="mainArticleCard"
                    >
                        <CardContent
                            className={classes.articleCard}
                        >
                            {mainArticleAvatar}
                            <Typography
                                variant="h4"
                            >
                                {this.state.mainArticleName}
                            </Typography>
                            <input
                                className={classes.textInput}
                                type="text"
                                placeholder={`Role in relation to ${this.state.otherArticleName}`}
                                value={this.state.mainArticleRole}
                                onChange={this.handleMainArticleRoleChange}
                            />
                        </CardContent>
                    </Card>
                    <Card
                        key="otherArticleCard"
                    >
                        <CardContent
                            className={classes.articleCard}
                        >
                            {otherArticleAvatar}
                            <Typography
                                variant="h4"
                            >
                                {this.state.otherArticleName}
                            </Typography>
                            <input
                                className={classes.textInput}
                                type="text"
                                placeholder={`Role in relation to ${this.state.mainArticleName}`}
                                value={this.state.otherArticleRole}
                                onChange={this.handleOtherArticleRoleChange}
                            />
                        </CardContent>
                    </Card>
                </div>
                <Card
                    className={classes.descriptionCard}
                >
                    <CardContent>
                        <Typography
                            variant='h4'
                        >
                            Description of their Relationship
                        </Typography>
                        <textarea
                            className={classes.textInput}
                            value={this.state.connectionDescription}
                            onChange={this.handleDescriptionChange}
                        />
                    </CardContent>
                </Card>
            </div>
        );
    }
}

export default withRouter(withStyles(styles)(ConnectionPageEditor));
