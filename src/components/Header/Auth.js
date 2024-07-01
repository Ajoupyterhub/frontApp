import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, IconButton, Popover } from '@mui/material';
import { Login, HowToReg } from '@mui/icons-material';
import { useSnackbar, useAuth } from '@lib/AppContext';
import GoogleSignInBtn from '@components/Header/GoogleSignIn';
import RegisterForm from '@components/Header/Register';
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
  let snackbar = useSnackbar();
  let { login, mode, setLoginMode } = useAuth();
  let [openRegister, setOpenRegister] = useState(false);
  let navigate = useNavigate();

  const handleGoogleLoginSuccess = (userProfile) => {

    Server.googleLogin(userProfile).then((d) => {
      if (d.msg === "OK") {
        login(d.user);
        navigate("/user", { replace: true });
        snackbar('success', 'Welcome to Ajoupyterhub');
      }
      else {
        console.log(`${d.user} : ${d.msg}`);
        snackbar("error", `login에 실패하였습니다. (${d.msg})`)
      }
    }).catch(error => {
      console.log("Error Occurred when Sign In");
      console.log(error);
      if (error.startsWith('popup')) {
        snackbar("warning", 'login이 취소되었습니다.');
      } else {
        snackbar("error", `login에 문제가 발생했습니다. (${error})`)
      }
    });

    return;
  }


  const handleGoogleLoginFailed = (msg, level='error') => {
    snackbar(level, msg);
    console.log(`[${level} : ${msg}`);
  }

  return (
    <GoogleOAuthProvider clientId={GoogleConfig.clientId}>
      <Box sx={styles.appTitle}>
        <Typography variant="h6" color="primary"> 로그인 </Typography>
          <GoogleSignInBtn icon={<Login id="btn_signin" />} 
            onSuccess={handleGoogleLoginSuccess} 
            onFailed={handleGoogleLoginFailed}/>
        <Box sx={{ width: '10px', height: '100%' }}></Box>
        <Typography variant="h6" color="primary"> 가입 </Typography>
        <IconButton onClick={() => { setOpenRegister(true) }}>
          <HowToReg id="btn_register" />
        </IconButton>
      </Box>
      <Popover  /* Popover for RegisterForm */
        open={openRegister}
        onClose={() => setOpenRegister(false)}
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
        <RegisterForm onClose={() => {setOpenRegister(false)}}/>
      </Popover>
    </GoogleOAuthProvider>
  )
}

export default Auth;