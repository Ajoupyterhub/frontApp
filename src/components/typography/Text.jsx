import React from 'react';
import styled from 'styled-components';

const Component = styled.span`
  display: ${(props) => props.display};
  color: ${(props) => props.color};
  font-weight: ${(props) => props.fontWeight};
  text-align: ${(props) => props.textAlign};
  word-break: ${(props) => props.wordBreak};
  line-height: ${(props) => `${props.lineHeight}rem`};

  font-family: ${(props) =>
    props.lang === 'kr' ? 'Noto Sans KR' : 'Open Sans'};

  font-size: ${(props) => `${props.fontSize}rem`};
`;

function Text(props) {
  const {
    children,
    fontSize = 1,
    fontWeight = 'normal',
    color = 'black',
    display = 'inline-block',
    textAlign = 'left',
    wordBreak = 'break-all',
    language = 'kr',
    role = 'text',
    lineHeight = 1,
    ...rest
  } = props;

  return (
    <Component
      fontSize={fontSize}
      fontWeight={fontWeight}
      color={color}
      display={display}
      textAlign={textAlign}
      wordBreak={wordBreak}
      language={language}
      role={role}
      lineHeight={lineHeight}
      {...rest}
    >
      {children}
    </Component>
  );
}

export default Text;
