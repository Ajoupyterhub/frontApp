import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, CssBaseline, Paper, Typography, IconButton, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions, Grid, Card, CardContent, CircularProgress, TextField,
  Tabs, Tab,
} from '@material-ui/core';
import { SettingsOutlined, LaptopMacOutlined, 
  PlayArrow, Stop, AddCircleOutline, DeleteOutlined, Group, ListAlt } from '@material-ui/icons';
import withStyles from '@material-ui/core/styles/withStyles';
import { green, blue, yellow, red } from '@material-ui/core/colors';

export default function ConfirmDialog (props) {
    return (
      <div>
        <Dialog
          open={props.open}
          onClose={props.handleClose(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {props.message}
            </DialogContentText>
            <DialogContentText id="alert-dialog-description">
              {props.children}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={props.handleClose(false)} color="primary" autofocus>
              Cancel
            </Button>
            <Button onClick={props.handleClose(true)} color="primary" >
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
  

  