import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Posts from '@components/Posts'
import Server from '@lib/server';
import Banner from "@components/Banner";
import { useSnackbar, useAuth } from '@lib/AppContext';
import SignInForm from '@components/Header/SignIn';

const PostsBox = styled.div`
  display : flex;
  flex-direction : 'row';
`
const Home = (props) => {
  let [urgentNotice, setUrgent] = useState(null);
  let { login, mode, setLoginMode } = useAuth(); 
  let navigate = useNavigate();
  
  useEffect(() => {
    Server.getNotice().then(n => {
      if (n.title?.length > 0) {
        setUrgent(n)
        console.log(urgentNotice);
      }
    })
  }, [])

  const handleLoginSuccess = (data) => {
    if (props.mode == 'dev') {
      login(data);
      navigate("/user");
    }
  }


  return (
    <>
      <div style={{display : 'flex', flexDirection : 'row'}}>
        <Banner src="/static/images/background.png" msg={urgentNotice} alt="banner" />
        { props.mode == 'dev' && 
          <SignInForm style={{border : "2px solid blue", width: "30%"}} 
              onUserSignIn={handleLoginSuccess} />
        }
      </div>
      
      <PostsBox>
        <Posts title="최근 게시글" tag="all" />
        <Posts title="가이드 게시글" tag="사용가이드" />
      </PostsBox>
    </>
  )
}

export default Home;
