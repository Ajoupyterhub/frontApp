import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google'
import { useSnackbar, useAuth } from '@lib/AppContext';
import { Button, IconButton } from '@mui/material';
import GoogleConfig from '@lib/authSecret';
import Server from '@lib/server';

const GoogleSignInBtn = (props) => {
  let snackbar = useSnackbar();
  let { login } = useAuth();
  let navigate = useNavigate();

  const handleGoogleLoginSuccess = (userProfile) => {

    Server.googleLogin(userProfile).then((d) => {
      if (d.msg === "OK") {
        login(d.user);
        navigate("/user", { replace: true });
      }
    }).catch(error => {
      console.log("Error Occurred when Sign In");
      console.log(error);
      if (error.startsWith('popup'))
        snackbar("warning", 'login이 취소되었습니다.');
    });

    return;
  }


  const handleGoogleSignIn =
    useGoogleLogin({
      onSuccess: async tokenResp => {
        const data = await fetch('https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${tokenResp.access_token}` } })
          .then(r => { return r.json() }).catch(e => {
            snackbar('error', "Error가 발생하였습니다.")
            console.log(e);
          });

        handleGoogleLoginSuccess(data);
        snackbar('success', 'Welcome to Ajoupyterhub');
      },

      onError: e => {
        console.log(e);
        if (e.startsWith('popup')) {
          snackbar('warning', '로그인이 취소되었습니다.');
          return;
        }
        snackbar('error', '로그인 과정에 에러가 발생했습니다.');
      },
      hosted_domain: GoogleConfig.hosted_domain, 
      prompt: 'select_account',
      flow: 'implicit',
      scope: 'profile email',
    });

  return ((props.icon) ?
    <IconButton
      variant="contained"
      onClick={handleGoogleSignIn}
      disabled={props.disabled}
    >
      {props.icon}
    </IconButton>
    :
    <Button
      sx={{ width: '100%' }}
      variant="contained"
      color="primary"
      onClick={handleGoogleSignIn}
      disabled={props.disabled}>
      {props.children || 'Sign In with Google'}
    </Button>
  )
}

export default GoogleSignInBtn;
