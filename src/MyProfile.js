import React from 'react';
import PropTypes from 'prop-types';
import {
  Avatar, Button, CssBaseline, Paper, Typography, IconButton, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions, Grid, Card, CardContent, CircularProgress, TextField,
  Popover,
} from '@material-ui/core';
import { SettingsOutlined, LaptopMacOutlined, 
  PlayArrow, Stop, AddCircleOutline, DeleteOutlined } from '@material-ui/icons';
import withStyles from '@material-ui/core/styles/withStyles';
import { makeStyles } from '@material-ui/core/styles';
import { green, blue, yellow, red } from '@material-ui/core/colors';

import { AppContext } from './app-context';

const useStyles = makeStyles( theme => (
    {
    root: {
        margin: theme.spacing(3),
    },
  
    profileBox: {
        width: 400,
        minHeight: 175,
        margin: theme.spacing(1),
        padding: theme.spacing(1),
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },

    myprofile: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent : 'center',
        alignItems: 'center',
        width: 350,
        margin: theme.spacing(1),
    },

    usageChart: {
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        flexGrow: 1,
        margin: theme.spacing(1),
        marginRight: 0,
        height: '100%',
        minHeight: 150,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing(1),
    },

    profSet: {
        //position: 'absolute',
        display: 'flex',
        flexDirection : 'row',
        width: '100%',
        padding: theme.spacing(1),
        justifyContent : 'left',
        alignItems : 'left',
        //marginTop: 'auto',
        marginLeft: 'auto',
        //minHeight: 150,
    },
}));

function MyProfile(props) {
    const classes = useStyles(props);
    //const [open, setOpen] = React.useState(false);
    let context = React.useContext(AppContext);
    //const [anchorEl, setAnchorEl] = React.useState(null);
    const user = context.currentUser; //{name : props.name, email: props.email, dept: props.dept};
  /*
    function handleProfileOpen() {
      console.log("Profile page Open");
      setOpen(true);
    }
  
    function handleClose(rv) {
      return function () {
        if (rv) {
            context.changeUserInfo(rv);
            console.log(`MyProfile: handleClose()${rv.toString()}`);
        }
        setOpen(false);
      }
    }
  */
 
    //console.log("_MyProfile");
    return (
      <React.Fragment>
        {/* <Paper className={classes.root}> */}
          <Popover className={classes.profileBox}
            /*
            anchorReference="anchorPosition"
            anchorPosition={{ top: 60, left: `calc(100%-350)` }}
            */
            open={props.open}
            onClose={props.onClose}
            anchorEl={props.anchor}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
            <div className={classes.myprofile}>
              <Avatar src={user && user.imageUrl} alt="your profile"/>
              <Typography align="center" variant="body1"> {user && user.name} </Typography>
              <Typography align="center" variant="body1" > {user && user.email} </Typography>
              <Typography align="center" variant="body1"> {user && user.dept} </Typography>
              {/*
                  <Button style={{ marginLeft: 'auto' }} onClick={handleProfileOpen}>
                    <SettingsOutlined /></Button>
              </div>
              */}
            </div>
            {/* <div className={classes.usageChart}>
                Usage Chart Area (Comming soon ...)
                </div> */}
          </Popover>
        {/* </Paper> */}
      </React.Fragment>
    );
}
  
export default MyProfile;