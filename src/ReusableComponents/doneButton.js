import React from 'react';
import DoneIcon from '@material-ui/icons/Done';
import IconButton from '@material-ui/core/IconButton';

const DoneButton = (props) => (
    <IconButton color="primary" aria-label="done" onMouseDown={props.onDone} >
        <DoneIcon />
    </IconButton>
);

export default DoneButton;
