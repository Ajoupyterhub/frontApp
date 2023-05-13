import React from 'react';
import { Avatar, Typography, Box, Popover} from '@mui/material';

const style = {

  profileBox: {
    width: 400,
    minHeight: 175,
    margin: 1, //'spacing(1)', //theme.spacing(1),
    padding: 1, //'spacing(1)', //theme.spacing(1),
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
    margin: 2, //'spacing(1)', //theme.spacing(1),
  },
}

const MyProfile = (props) => {
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