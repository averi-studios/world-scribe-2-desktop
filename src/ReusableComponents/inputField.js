import React from 'react';
import PropTypes from 'prop-types';
import '../css/input.css';

const WAIT_INTERVAL = 1000;

export default class InputField extends React.Component{
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.timer = null;
    }

    handleChange(e) {
        let value = e.target.value;
        clearTimeout(this.timer);

        this.props.onChange(value);

        this.timer = setTimeout(() => this.props.onChange(value), WAIT_INTERVAL);
    }

    render(){
        const {name} = this.props;
        return(
            <textarea
                value={this.props.value} name={name} 
                onChange={(e)=> this.handleChange(e)}
            />
        );
    }
}
InputField.propTypes = {
    value: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
};