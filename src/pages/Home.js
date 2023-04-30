import React, { Component, useState } from 'react';
import styled from 'styled-components';
import Posts from '@components/Posts'

const Banner = styled.img`
  width: 100%;
  height: 27rem;
  object-fit: cover;
`;
/*
const styles = {
    homePaper: {
        //maxWidth : '800px',
        minHeight: `calc(100%-60px)`, //'calc(100vh-60px)',
        //marginTop : '60px',
        display: 'flex',
        //flex : 'space-around',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        //overflowY : 'auto',
      },
      content: {
        flex: 1,
        maxWidth: 568,
        maxHeight: 284,
        //minWidth : 0,
        //height : 'auto',
        objectFit: 'contain',
      },
};
*/
const Home = (props) => { 
    return (
      <>
      <Banner src="/static/images/background.png" alt="banner" />
      <Posts/>
      </>
    )
}
  
export default Home;
  