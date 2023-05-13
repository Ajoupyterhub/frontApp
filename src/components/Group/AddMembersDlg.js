import React, { useState } from 'react';
import {
  Button, TextField, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, CircularProgress
} from '@mui/material';
import { green } from '@mui/material/colors';
import Server from '@lib/server';
import config from '@lib/config';

const styles = {
  progress: {
    margin: 2, //theme.spacing.unit * 2,
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
};

const AddMembersDlg = (props) => {
  let [state, setState] = useState({
    loading: false,
    bShowWrongID: false,
    invalidatedEmailList: [],
    emailAddrInputs: "",
  });

  const handleTextChange = (e) => {
    setState({ ...state, emailAddrInputs: e.target.value });
    return;
  }

  const addMember = () => {
    //let reqData = [];
    const hostDomain = config.HOST_DOMAIN;
    let validEmails = [];
    let invalid_emails = [];
    state.emailAddrInputs.replace(/,/g, ' ').split(/[\s+]/)
      .map(e => {
        if (e.length == 0)
          return;
        let s = e.split('@');
        if (s.length <= 1) {
          invalid_emails.push(e);
          return;
        }
        if (s[1] === hostDomain) {
          validEmails.push(e);
        }
        else {
          invalid_emails.push(e)
        }
      });

    if (validEmails.length == 0) {
      cleanState();
      props.onClose([], invalid_emails);
      return;
    }
    console.log(invalid_emails);
    setState({ ...state, loading: true });
    Server.addMembers(props.groupID, validEmails).then(data => {
      /*
      invalid_emails.push(...(
        validEmails.filter((e) => 
          {return e.length > 0 && -1 == data.validated.findIndex((v) => {return e == v.email})})
        ))
      console.log(invalid_emails); */
      //      invalid_emails.push(...data.alreadyMembers);
      console.log(data);
      invalid_emails.push(...data.validated);

      props.onClose(data.validated, invalid_emails);
      setState({ ...state, emailAddrInputs: '' }); //, invalidatedEmailList: invalid_emails});
    }).finally(() => {
      setState({ ...state, loading: false, invalidatedEmailList: invalid_emails });
    });
  }

  const cleanState = () => {
    setState({
      ...state,
      loading: false,
      emailAddrInputs: "",
      invalidatedEmailList: [],
    });
  }

  return (
    <div>
      <Dialog maxWidth="md" open={props.open} onClose={props.onClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">그룹 멤버 추가</DialogTitle>
        <DialogContent>
          <DialogContentText>
            가입 대상자의 email 주소를 공백 또는 ','로 구분하여 입력하세요.
          </DialogContentText>
          <form style={{ display: 'flex', flexWrap: 'wrap', width: 700 }}>
            <TextField
              autoFocus
              multiline
              style={{ margin: 8 }}
              rows="7"
              fullWidth
              margin="normal"
              variant="outlined"
              id="name"
              label="Email Addresses"
              type="email"
              value={state.emailAddrInputs}
              onChange={handleTextChange} />
          </form>
          {state.loading && <CircularProgress sx={styles.progress} />}
        </DialogContent>
        {state.invalidatedEmailList.length > 0 &&
          <DialogContent>
            <DialogContentText>
              다음 email 주소는 이미 등록되어 있거나, 등록할 수 없는 이메일입니다. 다시 확인하여 주시기 바랍니다.
            </DialogContentText>
          </DialogContent>
        }
        <DialogActions>
          <Button onClick={() => { cleanState(); props.onClose([], []) }} color="primary">
            Cancel
          </Button>
          <Button onClick={addMember} color="primary">
            Add Members
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AddMembersDlg;
