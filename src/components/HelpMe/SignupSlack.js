import React, { useState, useContext } from 'react';
import { Paper, Button, SvgIcon, TextField, FormControl, Typography } from '@mui/material';
import { currentUser } from '@lib/AppContext';
import { UIContext } from '@lib/AppContext';
import config from '@lib/config';
import Slack_logo from '@assets/images/Slack_icon_2019.svg';

const styles = {
  messageBox: {
    padding: '12px',
    //width: '27%',
    minWidth: 250,
    backgroundColor: '#efefef',
    height: '100%',
    margin: 'auto',
    marginTop : 1,
    marginBottom: 1,
  }
}
const SignupSlack = (props) => {
  let [text, setText] = useState("")
  let user = currentUser();
  let { slackState, setSlack } = useContext(UIContext);

  const handleTextChange = (e) => {
    setText(e.target.value)
  }

  const handleSendMessage = (e) => {
    e.preventDefault();

    fetch(`/user/${user.id}/send`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: `${text}` })
      }).then(d => {
      }).catch(e => { console.log(e) }).finally(() => {
        setText('');
        setSlack(false);
        setTimeout(() => setSlack(true), config.SLACK_DURATION);
      });
    return
  }

  const handleSignup = (e) => {
    e.preventDefault();

    window.open("http://join.slack.com/t/ajoupyterhub/signup", "slack_signup");
    return;
  }

  return (
    <React.Fragment>
      <Paper sx={styles.messageBox}>
        <form /* style={{backgroundColor : '#efefef'}} */>
            <Typography variant="h6" >
              Ajoupyterhub 채널에 가입하기
            </Typography>

          {/* <FormControl margin="normal" required fullWidth>
            <Typography variant="body1">
              Slack 채널에 가입하면, 문제가 발생할 때, 더 빠르고 자세하게 지원받을 수 있습니다.
              </Typography>
              <Typography variant="body1">
              가입한 회원끼리 서로 도울 수 있습니다.
            </Typography>
            <Typography variant="body1">
              가입하려면 아래 버튼을 클릭하세요.
            </Typography>
          </FormControl> */}
          <FormControl margin="normal" required fullWidth>
            <div style={{margin : 'auto'}}>
          <a href="http://join.slack.com/t/ajoupyterhub/signup" target="slack_signup" rel="noreferrer noopener">
            <SvgIcon sx={{width : 100, height: 100}} component={Slack_logo}  
              viewBox="0 0 127 127"/> 
          </a>
          </div>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSignup}
            sx={{ marginTop: 2 }}
          >
            가입하고 질문하기
          </Button>
        </form>
      </Paper>
    </React.Fragment>
  );
}

export default SignupSlack;