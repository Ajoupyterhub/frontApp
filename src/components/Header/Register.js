import React, {useContext, useState} from 'react';
import { Box, FormControl, Input, InputLabel, Checkbox, 
  Typography, FormControlLabel, FormLabel, RadioGroup, Radio
} from '@mui/material';
import {AppContext} from '@lib/app-context';
import Server from '@lib/server';
import GoogleSignInBtn from '@components/Header/GoogleSignIn';

const styles = {
  paper: {
    width : '400px', 
    display: 'flex',
    flexDirection: 'column',
    justifyContent : 'center',
    alignItems: 'center',
    marginTop: 1, 
    marginBottom: 1,
    marginLeft: 1,
    marginRight: 1, 
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'row',
    margin: 'auto',
  },
  form: {
    width: '100%', // Fix IE11 issue.
    gap : "5px",
    display : 'flex',
    flexDirection: 'column',
    justifyContent : 'center',
    alignItems: 'center',

  },
  submit: {
    display : 'flex',
    width: '100%',
    justifyContent : 'center',
    marginTop: 2, 
  },
}

const RegisterForm = (props) => {
  const context = useContext(AppContext);
  let [registerData, setRegisterData] = useState(
    {academicID: '', 
     dept: '', 
     primary_role: 'U', 
     errorMsg: '', 
     confirmPrivacy : false,
    }
  );
  let [verified, setVerify] = useState(false);
  let [errorMsg, setErrorMsg] = useState('');

  const handleInputChange = (controlName) => (event) => {
    //event.preventDefault();
    let value = (controlName == 'confirmPrivacy') ? event.target.checked : event.target.value;

    let newData = {...registerData, [controlName] : value}

    setRegisterData(newData);
    setVerify(verifyInputData(newData));
  }

  const verifyInputData = (data) => {
    const {academicID, dept, confirmPrivacy} = data;

    const academicIDRegex = /^[0-9]{9}$/g;
    if(academicIDRegex.test(academicID)) {
      let first4 = parseInt(academicID.slice(0, 4));
      let thisYear = parseInt((new Date()).getFullYear());
      if (first4 < 1980 || first4 > thisYear) {
        setErrorMsg("Invalid academic ID. Please, give me a valid academic ID.")
        return false;
      }
    }
    else {
      if(academicID.length == 9) {
        setErrorMsg("Invalid academic ID. Please, give me a valid academic ID")
      }
      else {
        setErrorMsg('');
      }
      return false;
    } 

    if(dept.length < 1) {
      return false;
    }

    if(!confirmPrivacy) {
      return false;
    }
    setErrorMsg('');
    return true;
  }

  const handleRegisterBtn = (res) => {
    
    //setRegisterData({...registerData, errorMsg: ''});
    let data = {}
    data["academicID"] = registerData.academicID;
    data["dept"] = registerData.dept;
    data["primary_role"] = registerData.primary_role;
    data["email"] = res.email; //getEmail();
    data["name"] = res.name; //getName();
    data["picture"] = res.picture; //getImageUrl();
    data["loginType"] = "Google";
    console.log(data)
    Server.registerUser(data).then((d) => {
      if(d.msg != "OK")
        context.snackbar("error", d.msg);
      else {
        context.snackbar("success", "회원 가입이 완료되었습니다.");
        //props.onMoveTab(0);   
      }
    }).catch(e => {
      console.log("Server.registerUser Error", e);
      context.snackbar("error", "Server.registerUser Error")
    });
    return;
  }

  return (
    <React.Fragment>
      <Box sx={styles.paper}>
          <Typography variant="h6">
              가입하고 코딩하기 (Register)
          </Typography>
        <form sx={styles.form} onSubmit={handleRegisterBtn} > 
          {/*
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Ajou Email Address</InputLabel>
              <Input id="email" name="email" autoComplete="email" autoFocus />
            </FormControl>

            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="username">이름</InputLabel>
              <Input id="username" name="username" />
            </FormControl>
            */}
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="academicID">학번 (또는 임용번호)</InputLabel>
            <Input id="academicID" name="academicID" onChange={handleInputChange("academicID")} />
          </FormControl>


          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="dept">학과</InputLabel>
            <Input id="dept" name="dept" onChange={handleInputChange("dept")} />
          </FormControl>

          {/*
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="deptName">학과</InputLabel>
                <Select value={registerData.dept}
                  onChange={this.handleChange('dept')}
                  inputProps={{ name: 'deptName', id: 'deptName' }} >
                  {deptist.map((n) => { return <MenuItem value={n}> {n}</MenuItem> })}
                </Select>
            </FormControl>

            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="passwd">Password</InputLabel>
              <Input id="passwd" name="passwd" type="password" />
            </FormControl>

            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="passwd_confirm">Confirm Password</InputLabel>
              <Input id="passwd_confirm" name="passwd_confirm" type="password" />
            </FormControl>
            */}

          <FormControl component="fieldset" margin="normal" required fullWidth>
            <FormLabel component="legend" margin="normal" >역할</FormLabel>
            <RadioGroup sx={styles.radioGroup} aria-label="role" name="role"
              value={registerData.primary_role} onChange={handleInputChange("primary_role")}>
              <FormControlLabel style={{ margin: 'auto' }} value="O" control={<Radio color="primary" />}
                label="교수" labelPlacement="end" />
              <FormControlLabel style={{ margin: 'auto' }} value="U" control={<Radio color="primary" />}
                label="학생" labelPlacement="end" />
            </RadioGroup>
          </FormControl>
          {/* 학생은 교과목 그룹에 속해야 사용할 수 있으며, 교수 역할은 학과 및 임용번호 확인 후 가입이 완료됩니다.*/}
          <Typography sx={styles.submit} /* fullWidth centered="true" */ variant='body2'>
            Ajoupyterhub는 귀하의 암호를 보관하지 않습니다. 학교 이메일에 의한 Google 로그인으로 바로 사용할 수 있습니다.
          </Typography>

          <br/>

          <Typography sx={styles.submit} /* fullWidth centered="true" */ variant='body1' >
            개인정보 수집 및 이용 동의
          </Typography>
          <Typography sx={styles.submit} /* fullWidth centered="true" */ variant='body2'>
            귀하의 개인정보 (학번 또는 임용번호, 이메일, 소속학과, 이름) 수집에 동의합니다.
          </Typography>

          <FormControl component="fieldset" margin="normal" required fullWidth>
            <FormControlLabel style={{ margin: 'auto' }} value={registerData.confirmPrivacy}
              control={<Checkbox name="confirmPrivacy" color="primary"
                /*checked={registerData.confirmPrivacy}*/
                onChange={handleInputChange("confirmPrivacy")} />}
              label="동의합니다." labelPlacement="end" />
          </FormControl>
          <FormControl component="fieldset" margin="normal" required fullWidth>
            <GoogleSignInBtn onSuccess={handleRegisterBtn}
              disabled={!verified} />
          </FormControl>

          {/*
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              //onClick={this.handleRegisterBtn} // Must remove to get FormData. FormData uses Form submit
              disabled={registerData.academicID.length < 9  || registerData.dept.length < 1 || !registerData.confirmPrivacy}
            >
              Register
            </Button>
            */}
          {/*
            <Typography className={classes.submit} fullWidth centered> 
               Google 인증(OAuth)으로 Ajou Email Address와 이름을 확인합니다. 
            </Typography>
            */}
          <Typography sx={styles.submit} color="red" >
            {errorMsg}
          </Typography>
        </form>
      </Box>
    </React.Fragment>
  );
}

export default RegisterForm; 

