import { InputBase } from '@material-ui/core';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
import { withRouter } from 'react-router';
import ClearButton from '../ReusableComponents/clearButton';
import DeleteButton from '../ReusableComponents/deleteButton';
import DoneButton from '../ReusableComponents/doneButton';
import EditButton from '../ReusableComponents/editButton';

const styles = (theme) => ({
    actions: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
});

function ListItemEditActions(props) {
    return props.isEditable ? (
        <>
            <DoneButton onDone={props.onDone} />
            <ClearButton onClear={props.onClear} />
        </>
    ) : (
        <>
            <EditButton onEdit={props.onEdit} />
            <DeleteButton onDelete={props.onDelete} />
        </>
    );
}

function ListItemEditableText(props) {
    return props.isEditable ? (
        <form onSubmit={props.onDone}>
            <InputBase
                autoFocus
                type="input"
                placeholder={props.placeholder}
                value={props.value}
                onChange={props.onChange}
            />
        </form>
    ) : (
        <ListItemText primary={props.name} onClick={props.onClick} />
    );
}

function ListItemEditable(props) {
    const { classes } = props;
    const [isEditable, setIsEditable] = useState(false);
    const [newTitle, setNewTitle] = useState('');

    const onDone = function () {
        props.onDone(newTitle);
        setIsEditable(false);
        setNewTitle('');
    };

    return (
        <>
            <ListItemEditableText
                isEditable={isEditable}
                name={props.name}
                onChange={(e) => setNewTitle(e.target.value)}
                onDone={onDone}
                placeholder={props.name}
                value={newTitle}
                onClick={props.onClick}
            />
            <ListItemSecondaryAction className={classes.actions}>
                <ListItemEditActions
                    isEditable={isEditable}
                    onClear={() => setIsEditable(false)}
                    onDelete={props.onDelete}
                    onDone={onDone}
                    onEdit={() => setIsEditable(true)}
                />
            </ListItemSecondaryAction>
        </>
    );
}

export default withRouter(withStyles(styles)(ListItemEditable));
