import React from 'react';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';

class EditButton extends React.Component{

    render(){
        return(
            <IconButton color='primary' aria-label="Edit" onClick={this.props.onEdit}>
                <EditIcon />
            </IconButton>
        )
    }
}

export default EditButton;
