import { Tooltip, withStyles } from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';

const styles = {
    editHint: {
        cursor: 'pointer'
    },
};

let TooltipTitle = withStyles(styles)((props) => {
    const Title = (
        <Typography
            variant="h6"
            className={props.canBeEdited && props.classes.editHint}
            color="inherit"
            onClick={props.canBeEdited && props.onClick}
        >
            {props.title}
        </Typography>
    );

    return props.canBeEdited ? (
        <Tooltip title={'Click to rename'}>{Title}</Tooltip>
    ) : (
        <> {Title} </>
    );
});

const EditableTitle = (props) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState('');

    const canBeEdited = props.editable && !isEditing;

    const toggleEditableTitle = () => {
        setIsEditing(!isEditing);
    };

    const handleTitleChange = () => {
        props.onTitleChange(newTitle);
        setIsEditing(false);
        setNewTitle('');
    };

    return isEditing && props.editable ? (
        <form onSubmit={handleTitleChange}>
            <InputBase
                autoFocus
                type="input"
                placeholder={props.title}
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onBlur={handleTitleChange}
            />
        </form>
    ) : (
        <TooltipTitle
            title={props.title}
            canBeEdited={canBeEdited}
            onClick={toggleEditableTitle}
        />
    );
};

export default withStyles(styles)(EditableTitle);
