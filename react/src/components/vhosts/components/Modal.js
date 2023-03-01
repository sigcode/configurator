import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

export default function ChildModal(props) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };


    return (
        <React.Fragment>
            <Button {...props} onClick={handleOpen}>{props.buttonText}</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={{ ...style, width: props.width }}>
                    <h2 id="child-modal-title">{props.title}</h2>
                    {props.content}
                    <div class="flex flex-row-reverse mt-10">
                        {props.confirmButton}
                        <Button variant="contained" color="primary" onClick={handleClose}>Close</Button>
                    </div>
                </Box>
            </Modal>
        </React.Fragment>
    );
}


