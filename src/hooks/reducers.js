import {useContext} from 'react';
import { AppContext } from '../lib/app-context';
import Server from '../lib/server';

export const initialUser = null;
export const initialSnackState = {
  open : false,
  variant : "success",
  message : "",
}

const SignIn = async (loginInfo, mode) => {
  //let context = useContext(AppContext);
  Server.login(loginInfo).then((d) => {
    if (d.msg === "OK") {
      //context.snackbar("success", "Welcome to Ajoupyterhub");
      //props.onUserSignIn(d.user);
      return d.user;
    }
    else {
      //context.snackbar("error", d.msg);
      return null;
    }
  });
}

export const userReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      let userProfile = SignIn(action.loginInfo, 'dev');
      return {user : userProfile}

    default: 
      throw Error("Unknow action: " + action.type)
  }  
}

export const snackReducer = (state, action) => {
  switch (action.type) {
    case "OPEN_SNACKBAR": {
      console.log(state);
      console.log(action);
      return {...state, open : true, variant: action.variant, message: action.message};
    }
    case "CLOSE_SNACKBAR": {
        console.log(state);
        console.log(action);
        return {...state, open : false, variant : 'success', message: ''};
    }
    default: 
      throw Error("Unknow action: " + action.type)
  }
}