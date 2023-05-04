import React from 'react';
import { IconButton, Snackbar, SnackbarContent } from '@mui/material';
import {styled} from '@mui/material/styles';
import { CheckCircle, Error, Info, Close, Warning } from '@mui/icons-material';
import { amber, green } from '@mui/material/colors';

const variantIcon = {
  success: CheckCircle,
  warning: Warning,
  error: Error,
  info: Info,
};

const styles = {
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: 'error.dark', //theme.palette.error.dark,
  },
  info: {
    backgroundColor: 'primary.main', //theme.palette.primary.main,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
    margin: 1,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: 1, //theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
    fontSize: `1.5rem`,
  },
};

const Span = styled('span')({
  display : 'flex',
  alignItems: 'center',
});

function SnackbarMessage({ open, onClose, variant, message }) {
  const classes = styles;
  const Icon = variantIcon[variant];
  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={open}
        autoHideDuration={3000}
        onClose={onClose}
      >
        <SnackbarContent
          sx={classes[variant]}
          aria-describedby="client-snackbar"
          message={
            <Span id="client-snackbar" /*sx={classes.message}*/>
              <Icon sx={classes.iconVariant} />
              {message}
            </Span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="close"
              color="inherit"
              onClick={onClose}
            >
              <Close sx={classes.icon} />
            </IconButton>,
          ]}
        />
      </Snackbar>
    </div>
  );
}

export default SnackbarMessage;