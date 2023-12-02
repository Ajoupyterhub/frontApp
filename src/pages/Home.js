import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Posts from '@components/Posts'
import Server from '@lib/server';
import Banner from "@components/Banner";

const PostsBox = styled.div`
  display : flex;
  flex-direction : 'row';
`
const Home = (props) => {
  let [urgentNotice, setUrgent] = useState(null);
  
  useEffect(() => {
    Server.getNotice().then(n => {
      if (n.title.length > 0) {
        setUrgent(n)

        console.log(urgentNotice);
      }
    }) 
  }, [])

  return (
    <>
      <Banner src="/static/images/background.png" msg={urgentNotice} alt="banner" />
      <PostsBox>
        <Posts title="최근 게시글" tag="all" />
        <Posts title="가이드 게시글" tag="사용가이드" />
      </PostsBox>
    </>
  )
}

export default Home;
