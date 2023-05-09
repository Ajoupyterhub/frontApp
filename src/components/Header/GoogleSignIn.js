import React, { useContext } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import { AppContext } from '@lib/app-context';
import { Button, IconButton } from '@mui/material';
import GoogleConfig from '@lib/authSecret';
import Server from '@lib/server';

const GoogleSignInBtn = (props) => {
  let context = useContext(AppContext);

  /*  For credentialResponse, use the following.
        const base64Payload = credentials.credential.split('.')[1]; //value 0 -> header, 1 -> payload, 2 -> VERIFY SIGNATURE
        const payload = decodeURIComponent(escape(atob(base64Payload))); 
        const data = JSON.parse(payload);
        console.log(data);
  */

  const handleGoogleLoginSuccess = (userProfile) => {

    Server.googleLogin(userProfile).then((d) => {
      if (d.msg === "OK") {
        context.loginUser(d.user);
      }
    }).catch(error => {
      console.log("Error Occurred when Sign In");
      console.log(error);
      if (error.startsWith('popup'))
        context.snackbar("warning", 'login이 취소되었습니다.');
    });

    return;
  }


  const handleGoogleSignIn =
    useGoogleLogin({
      onSuccess: async tokenResp => {
        const data = await fetch('https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${tokenResp.access_token}` } })
          .then(r => { return r.json() }).catch(e => {
            context.snackbar('error', "Error가 발생하였습니다.")
            console.log(e);
          });

        handleGoogleLoginSuccess(data);
        context.snackbar('success', 'Welcome to Ajoupyterhub');
      },

      onError: e => {
        console.log(e);
        if (e.startsWith('popup')) {
          context.snackbar('warning', '로그인이 취소되었습니다.');
          return;
        }
        context.snackbar('error', '로그인 과정에 에러가 발생했습니다.');
      },
      hosted_domain: GoogleConfig.hosted_domain, //'ajou.ac.kr', 
      prompt: 'select_account',
      flow: 'implicit',
      scope: 'profile email',
    });

  return ( (props.icon) ? 
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
