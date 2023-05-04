import React, { useState, useReducer, useEffect } from 'react';

import { Box, CssBaseline } from '@mui/material';
import Header from '@components/Header/Header';
import Home from '@pages/Home';
import MyPage from '@pages/MyPage';

import SnackbarMessage from '@components/SnackbarMessage';
import { AppContext } from '@lib/app-context';
import { userReducer, snackReducer, initialSnackState, initialUser } from '@hooks/reducers';


const styles = {
  mainPage: {
    position: 'fixed',
    top: '60px',
    width: '100%',
    //minHeight : `calc(100vh - 60px)`,
    height: '100vh',
    //display : 'flex',
    overflow: 'auto',
  },
};

const App = () => {
  let [snackState, dispatchSnack] = useReducer(snackReducer, initialSnackState);
  let [userState, dispatchUser] = useReducer(userReducer, initialUser);

  const snackbar = (variant, message) => {
    dispatchSnack({ type: "OPEN_SNACKBAR", variant, message })
  }

  const loginUser = (user) => {
    //setUser(user);
    dispatchUser({ type: "LOGIN", user : {...user} })
  }

  const logoutUser = () => {
    dispatchUser({ type: "LOGOUT", user: null });
  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway')
      return;
    dispatchSnack({ type: "CLOSE_SNACKBAR" })
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <AppContext.Provider value={{ snackbar, loginUser, logoutUser, dispatchUser, user: userState.user }}>
        <Header />
        <Box sx={styles.mainPage}>
          {(userState.user == null) ? <Home /> : <MyPage user={userState.user} />}
        </Box>
      </AppContext.Provider>
      <SnackbarMessage
        open={snackState.open}
        variant={snackState.variant}
        message={snackState.message}
        onClose={handleSnackbarClose}/>
    </React.Fragment>
  );
}

export default App;
