import React from 'react';

const context = {
    snackbar : () => {},
    onProgress : () => {},
    currentUser : null, 
    changeUserInfo: () => {},
    //changeUserProjectsInfo: () => {},
    //onSnackbarClose : () => {},
    //variant : "error",
    //message : "",
    //open : false,
};

export const AppContext = React.createContext(context);
