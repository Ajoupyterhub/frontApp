import React, {useState, useContext, useMemo} from 'react';
import { Paper, Button, TextField, FormControl, Typography } from '@mui/material';
import {AppContext} from '@lib/app-context';

const styles = {
  messageBox : {
    padding : '8px',
    width : '25%',
    minWidth : 250,
    backgroundColor : 'inherit',
    height : '100%',
  }
}
const HelpMeMessage = (props) => {
  let [text, setText] = useState("")
  let context = useContext(AppContext);
  let [lastMsgTime, setLastMsgTime] = useState(null);

  const handleTextChange = (e) => {
    setText(e.target.value)
  }

  const handleSendMessage = (e) => {
      e.preventDefault();

      fetch(`/user/${context.user.id}/send`,
        { method : 'POST',
          headers : {'Content-Type': 'application/json'},
          body : JSON.stringify({text : `${text}`})
        }).then(d  => {
          console.log(d.data);
          setLastMsgTime(new Date());
        }).catch(e => { console.log(e)}).finally(() => {
          setText('');
        }); 
    return
  }

  const checkTime = (limitInMinutes = 1) => {
    let current = new Date();
    if(lastMsgTime) {
      console.log(current, lastMsgTime);
      return (current - lastMsgTime) < limitInMinutes*60000;
    }
    return false; 
  }

  return (
    <React.Fragment>
      <Paper sx={styles.messageBox}>
      <form /* style={{backgroundColor : '#efefef'}} */> 
        <Typography variant="body2" >
        뭐가 잘 안될때, 알려주세요. 
        </Typography>
        <FormControl margin="normal" required fullWidth>
        <TextField
          id="helpMe"
          label="질문하기"
          multiline
          rows={4}
          value={text}
          onChange = {handleTextChange}
        />
        </FormControl>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleSendMessage}
          sx={{ marginTop: 2 }}
          disabled={checkTime()}
        >
          메시지 보내기
        </Button>
      </form>
      </Paper>
    </React.Fragment>
  );
} 

export default HelpMeMessage;