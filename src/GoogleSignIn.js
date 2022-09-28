import React, {useContext} from 'react'
import {useGoogleLogin} from '@react-oauth/google'
import { AppContext } from './app-context';
import {Button} from '@material-ui/core';
import GoogleConfig from './authSecret';

const GoogleSignInBtn = (props) => {
    let context = useContext(AppContext);

    /*  For credentialResponse, use the following.
          const base64Payload = credentials.credential.split('.')[1]; //value 0 -> header, 1 -> payload, 2 -> VERIFY SIGNATURE
          const payload = decodeURIComponent(escape(atob(base64Payload))); 
          const data = JSON.parse(payload);
          console.log(data);
    */
      
    const handleGoogleSignIn = 
      useGoogleLogin({
        onSuccess : async tokenResp => {
          const data = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', 
            {headers : { Authorization: `Bearer ${tokenResp.access_token}` }})
                  .then(r => {return r.json()}).catch(e => {
                    context.snackbar('error', "Error가 발생하였습니다.")
                    console.log(e);
                  });
          
          if (props.onSuccess) {
            console.log("Calling OnSuccess");
            props.onSuccess(data)
            context.snackbar('success', 'Welcome to Ajoupyterhub')
          }
        },
      
        onError :  e => {
          console.log(e);
          if(e.startsWith('popup')) {
            context.snackbar('warning', '로긴이 취소되었습니다.')
          }
          if(props.onFailure) {
            props.onFailure(e)
          }
        },
        hosted_domain: GoogleConfig.hosted_domain, //'ajou.ac.kr', 
        prompt: 'select_account', 
        flow: 'implicit',
        scope: 'profile email',
      });
  
    const OnClick = (e, ...others) => {
      if (props.beforeSignIn) {
        if (! props.beforeSignIn(e, ...others)) {
          console.log("Validation failed.")
          return;  
        }
      }
      handleGoogleSignIn();
    }
  
    return (
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={OnClick}
        disabled={props.disabled}
      >
        Sign in By Google
      </Button>
    )
  }

  export default GoogleSignInBtn;
  