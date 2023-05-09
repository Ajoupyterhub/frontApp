import React from 'react';

const context = {
    snackbar : () => {},
    currentUser : null, 
    changeUserInfo: () => {},
    loginUser: () => {},
    logoutUser: () => {},
    //changeUserProjectsInfo: () => {},
    //onSnackbarClose : () => {},
    //variant : "error",
    //message : "",
    //open : false,
};

export const AppContext = React.createContext(context);
