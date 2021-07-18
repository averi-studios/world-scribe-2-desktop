import React from 'react';
import ClearIcon from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';

class ClearButton extends React.Component{

    render(){
        return(
            <IconButton color='primary' aria-label="Clear" onClick={this.props.onClear}>
                <ClearIcon />
            </IconButton>
        )
    }
}

export default ClearButton;
