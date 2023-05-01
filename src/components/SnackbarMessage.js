import React from 'react';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SnackbarMessage(props) {
  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={props.open}
        autoHideDuration={3000}
        onClose={props.onClose}
      >
        <Alert
          onClose={props.onClose}
          severity={props.variant} 
          sx={{width: '100%'}} >
            {props.message}
        </Alert>     
      </Snackbar>
    </div>
  );
}