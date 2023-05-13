import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Box, IconButton, Typography } from '@mui/material';
import { PowerSettingsNew } from '@mui/icons-material';
import MyProfile from './MyProfile';
import { useAuth, currentUser, useSnackbar } from '@lib/AppContext';
import Server from '@lib/server';

const Profile = (props) => {
  const { logout } = useAuth();
  const user = currentUser();
  const snackbar = useSnackbar(); 
  const navigate = useNavigate();

  let [bShowProfile, setbShowProfile] = useState(false);

  const onExit = () => {
    Server.logout().then((d) => {
      if (d.msg != 'OK') {
        snackbar(d.level, d.msg);
      }
      else
        snackbar('success', 'Goodbye');
    }).catch(error => {
      console.log(error);
    }).finally(() => {
      logout();
      navigate("/");
    });
  }

  return (
    <>
      <Box sx={{ justifyContent: 'flex-end', alignItems: 'center', }} >
        <Typography color="primary" display="inline" align="center"  >
          {user.name}
        </Typography>
        <IconButton aria-label="whoami"
          color="primary"
          onClick={() => { setbShowProfile(true) }}>
          {user != null && <Avatar src={user.picture || user.imageUrl} />}
        </IconButton>
        <IconButton aria-label="Exit" onClick={onExit}
          color="primary"  >
          <PowerSettingsNew id="button_exit" />
        </IconButton>
      </Box>
      <MyProfile user={user}
        open={bShowProfile}
        onClose={() => { setbShowProfile(false) }}
        anchor={document.getElementById("button_exit")} />
    </>
  );
}

export default Profile;
