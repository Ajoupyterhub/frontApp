import React, { Component, useState } from 'react';
import styled from 'styled-components';
import Posts from '@components/Posts'

const Banner = styled.img`
  width: 100%;
  height: 27rem;
  object-fit: cover;
`;

const PostsBox = styled.div`
  display : flex;
  flex-direction : 'row';
`
const Home = (props) => { 
    return (
      <>
      <Banner src="/static/images/background.png" alt="banner" />
      <PostsBox>
      <Posts title="최근 게시글" tag="all"/>
      <Posts title="가이드 게시글" tag="사용가이드"/>
      </PostsBox>
      </>
    )
}
  
export default Home;
  