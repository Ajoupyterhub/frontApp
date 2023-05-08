import React, { useState, useRef, useEffect } from 'react';

import { Box, CssBaseline } from '@mui/material';
import Header from '@components/Header/Header';
import Home from '@pages/Home';
import MyPage from '@pages/MyPage';

import SnackbarMessage from '@components/SnackbarMessage';
import ConfirmDialog from '@components/ConfirmDialog';

import { AppContext } from '@lib/app-context';
import Server from '@lib/server';


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
  let [user, setUser] = useState(null);
  let [snackState, setSnackState] = useState({open : false, variant : 'success', message : ''});
  let [openConfirmationStop, setConfirmationStop] = useState({
    open : false, title : '', message : ''});

  let resolveRef = useRef(() => {});
  let usageRef = useRef(null)

  useEffect(() => {
    Server.getAllUsage().then(d => {
      usageRef.current = [...d];
    })
  }, []);

  const getConfirm = (title, message) => {
    return new Promise((resolve, reject) => {
      setConfirmationStop({open: true, title, message});
      resolveRef.current = resolve;
    })
  }

  const handleConfirmationStop = (boolStop) => (e) => {
    resolveRef.current(boolStop);
    setConfirmationStop({open: false, title: '', message: ''});
  }

  const snackbar = (variant, message) => {
    setSnackState({open : true, variant, message});
  }

  const loginUser = (user) => {
    setUser(user);
  }

  const logoutUser = () => {
    setUser(null);
  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway')
      return;
    setSnackState({...snackState, open : false, message : ''});
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <AppContext.Provider value={{ snackbar, loginUser, logoutUser, 
          user: user, getConfirm : getConfirm, allUsage : usageRef.current }}>
        <Header />
        <Box sx={styles.mainPage}>
          {(user == null) ? <Home /> : <MyPage user={user} />}
        </Box>
      </AppContext.Provider>
      <SnackbarMessage
        open={snackState.open}
        variant={snackState.variant}
        message={snackState.message}
        onClose={handleSnackbarClose}/>

      <ConfirmDialog open={openConfirmationStop.open}
        handleClose={handleConfirmationStop}
        title={openConfirmationStop.title} /* "Do you really want to stop the container?" */
        message={openConfirmationStop.message} /* {"Press \"OK\" to stop the container."} */ />

    </React.Fragment>
  );
}

export default App;
