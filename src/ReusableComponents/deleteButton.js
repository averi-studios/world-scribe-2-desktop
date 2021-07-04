import React from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
import Modal from './modal';
import IconButton from '@material-ui/core/IconButton';
class DeleteButton extends React.Component{
    constructor(){
        super();
        this.state = {
            modalIsOpen:false,
        };
        this.ClosingDeleteConfirmation = this.ClosingDeleteConfirmation.bind(this);
        this.OpeningDeleteConfirmation = this.OpeningDeleteConfirmation.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }
    ClosingDeleteConfirmation() {
        this.setState({
            modalIsOpen: false
        });
    }
    OpeningDeleteConfirmation() {
        this.setState({
            modalIsOpen: true,
        });
    }
    handleDelete() {
        this.props.onDelete();
        this.ClosingDeleteConfirmation();
    }

    render(){
        return(
        <div>
            <IconButton color='primary' aria-label="Delete" onClick={this.OpeningDeleteConfirmation}>
                <DeleteIcon />
            </IconButton>
            <div className='pushToCenter'>
            <Modal open={this.state.modalIsOpen}
                   header={"Confirm Deletion?"}
                   content={"Are you sure you want to continue? This process can not be undone "}
                   onClose={this.ClosingDeleteConfirmation}
                   onCreate={this.handleDelete}
            />
            </div>
        </div>
        )
    }
}

export default DeleteButton;