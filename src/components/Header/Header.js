
import React, {useContext, useState, useEffect} from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Popover} from '@mui/material';
import {currentUser} from '@lib/AppContext';
import Profile from './Profile';
import Auth from './Auth';

const styles = {
    top: {
      position: 'fixed', 
      top: '0px',
      left: '0px',
      width: '100%',
      display: 'flex',
      height: '60px',
      backgroundColor : 'white',
      justifyContent : 'space-between',
      overflow : 'hidden',
    },
  
    appTitle : {
      display: "flex", 
      justifyContent: 'space-between', 
      alignItems : 'center'
    },

    logo_symbol : {
      height : 50,
      width : 'auto',
      marginRight: 10,
    },
  };
  
const Header = (props) => {
    let user = currentUser(); //useContext(AppContext);

    return (
      <AppBar sx={styles.top} id = "__header__">
        <Toolbar sx = {styles.top} >
          <Box sx = {styles.appTitle} >
            <img src= "./static/images/intro_ajou_symbol.png" style={styles.logo_symbol} />
        
            <Typography variant="h5" color="primary" align="center" >
              AjoupyterHub - 아주대학교 코딩 놀이 공간
            </Typography> 
          </Box>  
          { (user) ? <Profile /> : <Auth /> }
        </Toolbar>
      </AppBar>
    );
}

export default Header;