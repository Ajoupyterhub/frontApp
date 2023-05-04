import {useContext} from 'react';
import { AppContext } from '../lib/app-context';
import Server from '../lib/server';

export const initialUser = {user : null, status : 'LOGOUT'};
export const initialSnackState = {
  open : false,
  variant : "success",
  message : "",
}

export const userReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {user : action.user};
    case "LOGOUT":
      return {user : null};
    default: 
      throw Error("Unknow action: " + action.type)
  }  
}

export const snackReducer = (state, action) => {
  switch (action.type) {
    case "OPEN_SNACKBAR": {
      return { open : true, variant: action.variant, message: action.message};
    }
    case "CLOSE_SNACKBAR": {
        return { open : false, variant : 'success', message: ''};
    }
    default: 
      throw Error("Unknow action: " + action.type)
  }
}