import React from 'react';
import { Avatar, Typography, Box, Popover} from '@mui/material';

import { AppContext } from '../../lib/app-context';

const style = {
  root: {
    margin: 'spacing(3)', //theme.spacing(3),
  },

  profileBox: {
    width: 400,
    minHeight: 175,
    margin: 'spacing(1)', //theme.spacing(1),
    padding: 'spacing(1)', //theme.spacing(1),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  myprofile: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: 350,
    margin: 'spacing(1)', //theme.spacing(1),
  },

  usageChart: {
    backgroundColor: 'background.default', //theme.palette.background.default,
    display: 'flex',
    flexGrow: 1,
    margin: 'spacing(1)', //theme.spacing(1),
    marginRight: 0,
    height: '100%',
    minHeight: 150,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 'spacing(1)', //theme.spacing(1),
  },

  profSet: {
    //position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    padding: 'spacing(1)', //theme.spacing(1),
    justifyContent: 'left',
    alignItems: 'left',
    //marginTop: 'auto',
    marginLeft: 'auto',
    //minHeight: 150,
  },
}

const MyProfile = (props) => {
  const context = React.useContext(AppContext);
  const { user } = props;

  return (
    <React.Fragment>
      <Popover sx={style.profileBox}
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
        <Box sx={style.myprofile} >
          <Avatar src={user && user.imageUrl} alt="your profile" />
          <Typography align="center" variant="body1"> {user && user.name} </Typography>
          <Typography align="center" variant="body1" > {user && user.email} </Typography>
          <Typography align="center" variant="body1"> {user && user.dept} </Typography>
        </Box>
      </Popover>
    </React.Fragment>
  );
}

export default MyProfile;