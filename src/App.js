import React, { useState, useReducer } from 'react';

import { Box, CssBaseline} from '@mui/material';
import Header from '@components/Header/Header';
import Home from '@pages/Home';
import MyPage from '@pages/MyPage';

import SnackbarMessage from '@components/SnackbarMessage';
import {AppContext} from '@lib/app-context';
import {userReducer, snackReducer, initialSnackState, initialUser} from '@hooks/reducers';


const styles = {
  mainPage : {
    position: 'fixed',
    top: '60px',
    width : '100%',
    //minHeight : `calc(100vh - 60px)`,
    height : '100vh',
    //display : 'flex',
    overflow : 'auto',
  },
};

const App = () => {
  //let [user, setUser] = useState(null);
  //let [snackState, setSnackState] = useState({open : false, variant : "success", message : ""});
  let [snackState, dispatchSnack] = useReducer(snackReducer, initialSnackState);
  let [user, dispatchUser] = useReducer(userReducer, initialUser);
  
  
  const snackbar = (variant, message) => {
    setSnackState({open : true, variant, message})
  }
  
  const loginUser = (user) => {
    //setUser(user);
    dispatchUser({type : "LOGIN", user})
  }

  const logoutUser = () => {
    setUser(null);
  }
  
  const handleSnackbarClose = (event, reason) => {
    if(reason === 'clickaway')
	    return;
    //setSnackState({...snackState, open : false})
    dispatchSnack({type : "CLOSE_SNACKBAR"})
  }
  
    return (
      <React.Fragment>
        <CssBaseline />
        <AppContext.Provider value={{snackbar,  currentUser: user, loginUser, logoutUser, dispatchUser, user, dispatchSnack, snackState }} > 
          <Header/>
          <Box sx = {styles.mainPage}>
            { (user == null) ? <Home /> : <MyPage user = {user}/>}
          </Box>
	      </AppContext.Provider>
	      <SnackbarMessage 
          open={snackState.open}
	        variant = {snackState.variant}
	        message = {snackState.message}
	        onClose = {handleSnackbarClose}/>
      </React.Fragment>
    );
  }

export default App;
