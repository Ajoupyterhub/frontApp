import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google'
import { useSnackbar, useAuth } from '@lib/AppContext';
import { Button, IconButton } from '@mui/material';
import GoogleConfig from '@lib/authSecret';
import Server from '@lib/server';

const GoogleSignInBtn = (props) => {
  let snackbar = useSnackbar();

  const handleGoogleSignIn =
    useGoogleLogin({
      onSuccess: async tokenResp => {
        const data = await fetch('https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${tokenResp.access_token}` } })
          .then(r => r.json()).then((data) => {
            props.onSuccess(data);    
          }).catch(e => {
            props.onFailed(e)
          });
      },

      onError: e => {
        if (e.startsWith('popup')) {
          props.onFailed('로그인이 취소되었습니다.', 'warning');
          return;
        }
        props.onFailed('로그인 과정에 에러가 발생했습니다.');
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
