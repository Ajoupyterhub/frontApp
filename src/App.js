import React, { useState, useRef, useEffect, useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import Header from '@components/Header/Header';
import Home from '@pages/Home';
import MyPage from '@pages/MyPage';

import AppContext from '@lib/AppContext';


const styles = {
  mainPage: {
    position: 'fixed',
    top: '60px',
    width: '100%',
    height: '100vh',
    overflow: 'auto',
  },
};

const App = () => {

  return (
    <React.Fragment>
      <CssBaseline />
      <AppContext>
        <BrowserRouter>
          <Header />
          <Box sx={styles.mainPage}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dev" element={<Home />} />
              <Route path="/user" element={<MyPage />} />
            </Routes>
          </Box>
        </BrowserRouter>
      </AppContext>
    </React.Fragment>
  );
}

export default App;
