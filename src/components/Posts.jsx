import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Text from '@components/typography/Text';
import config from '@lib/config';
import Server from '../lib/server';

const BLOG_URL = config.BLOG_URL;

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: start;
  align-items: flex-start;
  width: 100%;
  min-height: 155px;
  margin: 5px;
  gap: 2%;
  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 20px;
    margin: 20px;
  }
`;

const Content = styled.div`
  width: 100%; 
  margin: 5px;
  @media screen and (max-width: 768px) {
    width: 90%;
    margin: 20px 0;
  }
`;

const PostHeader = styled.span`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid #707070;
`;

const PostList = styled.ul`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Post = styled.a`
  text-decoration: none;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  min-height: 2rem;
`;

const PostContent = styled.span`
  display: flex;
  align-items: flex-start;
  gap: 10px;
`;

const PostTag = styled(Text)`
  padding: 2px 20px;
  border: 1px solid #4a7ec9;
  border-radius: 20px;
  color: #4a7ec9;
  font-weight: 600;
`;

const PostDate = styled(Text)`
  color: #505050;
  margin: 8px;
`;

const Posts = (props) => {
  let [posts, setPosts] = useState([]);

  useEffect(() => {
    (async function () {
      if (props.tag == 'all') {
        setPosts(await Server.getAllPosts())
      }
      else {
        setPosts(await Server.getPostsByTag(props.tag));
      }
    })();
  }, []);

  return (
    <Container>
      <Content>
        <PostHeader>
          <Text fontWeight={600} fontSize={1.125}>
            {props.title}
          </Text>
          <a href={`${BLOG_URL}`} target="ajoupyterhub_blog">
            <Text fontSize={1.125} color="#707070">
              더보기 &gt;
            </Text>
          </a>
        </PostHeader>
        <PostList>
          {posts?.slice(0, 3).map(({ title, slug, date }) => (
            <Post key={title} href={`${BLOG_URL}/${slug}`} target="ajoupyterhub_blog">
              <PostContent>
                <PostTag wordBreak="keep-all">주요</PostTag>
                <Text lineHeight={1.1} color="#272727">
                  {title}
                </Text>
              </PostContent>
              <PostDate wordBreak="keep-all">{date}</PostDate>
            </Post>
          ))}
        </PostList>
      </Content>
    </Container>
  );
};

export default Posts;