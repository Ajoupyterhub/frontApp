import React from 'react';
import PropTypes from 'prop-types';

import { Button,  Chip, TextField, Dialog, DialogActions, DialogContent, 
  DialogContentText, DialogTitle, CircularProgress, Paper } from '@material-ui/core/';
//import { makeStyles } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import { green } from '@material-ui/core/colors';
import Fetch from './fetch';
import config from './config';

const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2,
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
});

class AddMembersDlg extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      loading : false,
      bShowWrongID : false,
      invalidatedEmailList : [],
      emailAddrInputs : "",
    }
  }

  //let emailAddrInputs = "";
  //let emailList = [];
  //let invalidatedEmailList = [];
  
  handleTextChange = (e) => {
    this.setState({emailAddrInputs : e.target.value});
    return;
  }

  addMember = () => {
    //let reqData = [];
    const hostDomain = config.GoogleConfig.hosted_domain;
    let validEmails = [];
    let invalid_emails = [];
    this.state.emailAddrInputs.replace(/,/g, ' ').split(/[\s+]/)
      .map(e => {
        if (e.length == 0)
          return;
        let s = e.split('@');
        if (s.length <= 1) {
          invalid_emails.push(e);
          return;
        }
        if(s[1] === hostDomain) {
          validEmails.push(e);
        }
        else {
          invalid_emails.push(e)
        }
      });

    if(validEmails.length == 0) {
      this.cleanState();
      this.props.onClose([], invalid_emails);
      return;
    }
    console.log(invalid_emails);
    this.setState({loading : true});
    Fetch.addMembers(this.props.groupID, validEmails).then(data => {
      /*
      invalid_emails.push(...(
        validEmails.filter((e) => 
          {return e.length > 0 && -1 == data.validated.findIndex((v) => {return e == v.email})})
        ))
      console.log(invalid_emails); */
      invalid_emails.push(...data.data.alreadyMembers);

      this.props.onClose(data.data.addedMembers, invalid_emails);
      this.setState({emailAddrInputs : ''}); //, invalidatedEmailList: invalid_emails});
    }).finally(() => {
      this.setState({loading : false, invalidatedEmailList : invalid_emails});
    });
  }

  cleanState = () => {
    this.setState({ 
      loading : false,
      emailAddrInputs : "",
      invalidatedEmailList : [],
    });
  }

  render () {
    const {classes} =  this.props;

    return (
      <div>
        <Dialog maxWidth="md" open={this.props.open} onClose={this.props.onClose} aria-labelledby="form-dialog-title">
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
                value={this.state.emailAddrInputs}
                onChange={this.handleTextChange}/>            
            </form>
            {this.state.loading && <CircularProgress  className={classes.progress} />}
          </DialogContent>
          {/*
          <DialogContent>
            <Button onClick={this.addMember}> Add Member </Button>
          </DialogContent>
          */}
          { this.state.invalidatedEmailList.length > 0 &&
          <DialogContent>
            <DialogContentText>
              다음 email 주소는 이미 등록되어 있거나, 등록할 수 없는 이메일입니다. 다시 확인하여 주시기 바랍니다.
            </DialogContentText>
          </DialogContent>
          }
          <DialogActions>
            <Button onClick={() => {this.cleanState(); this.props.onClose(null, null)}} color="primary">
              Cancel
            </Button>
            <Button onClick={this.addMember} color="primary">
              Add Members
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

AddMembersDlg.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddMembersDlg);
