import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Box, IconButton, Popover } from '@mui/material';
import { Login, HowToReg, SettingsBackupRestoreOutlined } from '@mui/icons-material';
import { useSnackbar, useAuth, useConfirm } from '@lib/AppContext';
import GoogleSignInBtn from '@components/Header/GoogleSignIn';
import RegisterForm from '@components/Header/Register';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleConfig from '@lib/authSecret';
import Server from '@lib/server';
import config from '@lib/config';

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
  let [ loginUser, setLoginuser] = useState({});
  let navigate = useNavigate();
  let wannaRegistration = useConfirm();
  let userProfile = {}

  const handleGoogleLoginSuccess = (userProfile) => {
    if(!userProfile.email.endsWith(config.HOST_DOMAIN)) {
      snackbar('error', '등록된 도메인의 email이 아닙니다.');
      return;
    }
    Server.googleLogin(userProfile).then((d) => {
      if (d.msg === "OK") {
        login(d.user);
        navigate("/user", { replace: true });
        snackbar('success', 'Welcome to Ajoupyterhub');
      }
      else {
        console.log(`${d.user.id} : ${d.msg}`);
        if(d.msg.startsWith("No such user") || d.user.status == 'pending') {
          wannaRegistration("등록되지 않은 사용자", "가입하시겠습니까?").then(answer => {
            if(answer) {
              setLoginuser(d.user);
              setOpenRegister(true)
            }
            else {
              snackbar("error", `login에 실패하였습니다. (${d.msg})`)
            }
          })
        }
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

  const handleRegisterFormClose = (e) => {
    if (e) { // Dialog  바깥에 클릭한 경우
      snackbar("warning", "가입을 취소하였습니다.")
    }
    setOpenRegister(false)
  }

  const handleGoogleLoginFailed = (msg, level='error') => {
    snackbar(level, msg);
    console.log(`${level} : ${msg}`);
  }

  return (
    <GoogleOAuthProvider clientId={GoogleConfig.clientId}>
      <Box sx={styles.appTitle}>
        <Typography variant="h6" color="primary"> 로그인 </Typography>
          <GoogleSignInBtn icon={<Login id="btn_signin" />} 
            onSuccess={handleGoogleLoginSuccess} 
            onFailed={handleGoogleLoginFailed}/>
        {/* <Box sx={{ width: '10px', height: '100%' }}></Box>
        <Typography variant="h6" color="primary"> 가입 </Typography>
        <IconButton onClick={() => { setOpenRegister(true) }}>
          <HowToReg id="btn_register" />
        </IconButton> */}
      </Box>
      <Popover  /* Popover for RegisterForm */
        open={openRegister}
        onClose={handleRegisterFormClose}
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
        <RegisterForm onClose={handleRegisterFormClose} loginUser={loginUser}/>
      </Popover>
    </GoogleOAuthProvider>
  )
}

export default Auth;