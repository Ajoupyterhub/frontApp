import React, { useContext, useState, useEffect } from 'react';
import { Typography, Box, IconButton, Popover } from '@mui/material';
import { Login, HowToReg } from '@mui/icons-material';
import { AppContext } from '@lib/app-context';
import GoogleSignInBtn from '@components/Header/GoogleSignIn';
import RegisterForm from '@components/Header/Register';
import SignInForm from '@components/Header/SignIn';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleConfig from '@lib/authSecret';
import Server from '@lib/server';

const styles = {
  appTitle: {
    display: "flex",
    justifyContent: 'space-between',
    alignItems: 'center'
  },
};

const Auth = (props) => {
  let {snackbar, loginUser, dispatchUser, dispatchSnack } = useContext(AppContext);
  let [openRegister, setRegister] = useState(false);
  let [openSignIn, setSignIn] = useState(false);
  let [mode, setMode] = useState('Google');

  useEffect(() => {
    let pathname = window.location.pathname;
    console.log('SignInForm', pathname);
    setMode((pathname.startsWith('/dev')) ? 'dev' : 'Google');
  }, []);

  const handleGoogleLoginSuccess = (userProfile) => {

    Server.googleLogin(userProfile).then((d) => {
      if (d.msg === "OK") {
        loginUser(d.user);
      }
    }).catch(error => {
      console.log("Error Occurred when Sign In");
      console.log(error);
      if (error.startsWith('popup'))
        snackbar("warning", 'login이 취소되었습니다.');
    });

    return;
  }


  const handleLoginSuccess = (data) => {
    if (mode == 'dev') {
      setSignIn(false);
      //loginUser(data);
      dispatchUser({type: "LOGIN", user : data})
    }
  }

  return (
    <GoogleOAuthProvider clientId={GoogleConfig.clientId}>
      <Box sx={styles.appTitle}>
        <Typography variant="h6" color="primary"> 로그인 </Typography>
        {(mode == 'Google') ?
          <GoogleSignInBtn icon={<Login id="btn_signin" />}
            onSuccess={handleGoogleLoginSuccess} />
          :
          <IconButton onClick={() => { setSignIn(true) }}>
            <Login id="btn_signin" />
          </IconButton>
        }
        <Box sx={{ width: '10px', height: '100%' }}></Box>
        <Typography variant="h6" color="primary"> 가입 </Typography>
        <IconButton onClick={() => { setRegister(true) }}>
          <HowToReg id="btn_register" />
        </IconButton>
      </Box>
      <Popover  /* Popover for RegisterForm */
        open={openRegister}
        onClose={() => setRegister(false)}
        anchorEl={document.getElementById("__header__")}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <RegisterForm />
      </Popover>
      <Popover  /* Popover for id/password SignInForm */
        open={openSignIn}
        onClose={() => setSignIn(false)}
        anchorEl={document.getElementById("__header__")}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <SignInForm onUserSignIn={handleLoginSuccess} />
      </Popover>
    </GoogleOAuthProvider>
  )

}

export default Auth;