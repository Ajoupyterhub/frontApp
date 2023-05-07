import React, { Component, useState } from 'react';
import styled from 'styled-components';
import Posts from '@components/Posts'

const Banner = styled.img`
  width: 100%;
  height: 27rem;
  object-fit: cover;
`;
const Home = (props) => { 
    return (
      <>
      <Banner src="/static/images/background.png" alt="banner" />
      <Posts/>
      </>
    )
}
  
export default Home;
  