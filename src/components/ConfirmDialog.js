import React from 'react';
import {
  Button, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions
} from '@mui/material';

export default function ConfirmDialog(props) {
  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.handleClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{width : 300}}>{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.message}
          </DialogContentText>
          <DialogContentText id="alert-dialog-description">
            {props.children}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose(false)} color="primary" >
            Cancel
          </Button>
          <Button onClick={props.handleClose(true)} color="primary" autoFocus >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}


