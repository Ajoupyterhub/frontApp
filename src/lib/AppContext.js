import React, { createContext, useContext, useReducer, useRef, useEffect } from 'react';
import SnackbarMessage from '@components/SnackbarMessage';
import ConfirmDialog from '@components/ConfirmDialog';
import Server from '@lib/server';

export const UserContext = createContext(null);
export const UIContext = createContext(null);
export const SlackContext = createContext(null);

const userReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...action.user }
    case 'LOGOUT':
      return null
  }
}

const snackReducer = (state, action) => {
  switch (action.type) {
    case 'OPEN':
      return { open: true, variant: action.variant, message: action.message }
    case 'CLOSE':
      return { ...state, open: false }
  }
}

const confirmReducer = (state, action) => {
  switch (action.type) {
    case 'OPEN':
      return {
        open: true,
        title: action.title,
        message: action.message,
        resolve: action.resolve,
      }
    case 'CLOSE':
      return { ...state, open: false }
  }
}

const slackReducer = (state, action) => {
  return action.type;
}

export const currentUser = () => {
  let context = useContext(UserContext);
  return (context) ? context.user : null;
}

export const useAuth = () => {
  let { login, logout} = useContext(UserContext);
  return { login, logout};
}

export const useSnackbar = () => {
  let { snackbar } = useContext(UIContext);
  return snackbar;
}

export const useConfirm = () => {
  let { getConfirm } = useContext(UIContext);
  return getConfirm;
}

const AppContext = ({ children }) => {
  let [user, loginDispatcher] = useReducer(userReducer, null);
  let [snackState, snackbarDispatcher] = useReducer(snackReducer,
    { open: false, variant: 'success', message: '' })
  let [confirm, openCloseConfirm] = useReducer(confirmReducer,
    { open: false, title: '', message: '', resolve: null })
  let [slackState, slackDispatcher] = useReducer(slackReducer, true);

  let usageRef = useRef(null)

  useEffect(() => {
    Server.getAllUsage().then(d => {
      usageRef.current = [...d.data];
    })
  }, []);

  const login = (newUser) => {
    loginDispatcher({ type: 'LOGIN', user: newUser });
  }

  const logout = () => {
    loginDispatcher({ type: 'LOGOUT' })
  }

  const snackbar = (variant, message) => {
    snackbarDispatcher({ type: 'OPEN', variant, message })
  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway')
      return;

    snackbarDispatcher({ type: 'CLOSE' });
  }

  const getConfirm = (title, message) => {
    return new Promise((resolve, reject) => {
      openCloseConfirm({ type: 'OPEN', title, message, resolve });
    })
  }

  const handleConfirmationStop = (boolStop) => (e) => {
    confirm.resolve(boolStop);
    openCloseConfirm({ type: 'CLOSE', title: '', message: '' });
  }

  const setSlack = (onoff) => {
    slackDispatcher({ type: onoff });
  }

  return (
    <UserContext.Provider value={{ user: user, login, logout}}>
      <UIContext.Provider value={{
        snackbar, getConfirm, slackState, setSlack,
        allUsage: usageRef.current
      }}>

        {children}

        <SnackbarMessage
          open={snackState.open}
          variant={snackState.variant}
          message={snackState.message}
          onClose={handleSnackbarClose} />

        <ConfirmDialog open={confirm.open}
          handleClose={handleConfirmationStop}
          title={confirm.title} /* "Do you really want to stop the container?" */
          message={confirm.message} /* {"Press \"OK\" to stop the container."} */ />

      </UIContext.Provider>
    </UserContext.Provider>
  )
}

export default AppContext;