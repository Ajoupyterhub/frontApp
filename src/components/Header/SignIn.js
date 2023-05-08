import React, {useContext, useState} from 'react';
import { Avatar, Box, Button, FormControl, Input, InputLabel, Checkbox,
  Typography,  FormControlLabel} from '@mui/material';
import LockIcon from '@mui/icons-material/LockOutlined';
import {AppContext} from '@lib/app-context';
import Server from '@lib/server';

const styles = {
  layout: {
    width: 'auto',
    position : 'relative',
    top : '60px',
    //display: 'flex', // Fix IE11 issue.
    marginLeft: 'spacing(3)', //theme.spacing(3),
    marginRight: 'spacing(3)', //theme.spacing(3),
    //marginTop : '60px',
    //marginBottom : 'auto',
    //[theme.breakpoints.up(400 + theme.spacing(3) * 2)]: {
    //  width: 400,
    //  marginLeft: 'auto',
    //  marginRight: 'auto',
    //},
  },
  root: {
    flexGrow: 1,
    width: '400px',
  },
  tabs: {
    border: '1px solid #CCC',
    margin: '5px',
  },
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
    padding: 1,
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'row',
    margin: 'auto',
  },
  avatar: {
    margin: 1, //theme.spacing(1),
    backgroundColor: 'secondary.main', //theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE11 issue.
    gap : "5px",
    display : 'flex',
    flexDirection: 'column',
  },
  submit: {
    display : 'flex',
    width: '100%',
    justifyContent : 'center',
    marginTop: 2, 
  },
}

const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const SignInForm = (props) => {
  const { signInMode } = props;
  let [login, setLogin] = useState({email: '', password: '', remember: false, errorMsg: ''});
  let context = useContext(AppContext); 
  
  const handleInputChange = (controlName) => (event) => {
    setLogin({...login, [controlName] : event.target.value});
  }

  /*
  const handleForgotPassword = (e) => {
    e.preventDefault();

    const data = {
      email : login.email,
    };

    if(!emailRegex.test(data.email)) {
      context.snackbar("error", "Invalid email. Please, give me a valid email");
      return;
    }
    Server.forgotPassword(data).then((rv) => {
      if(rv.msg == "OK") {
        context.snackbar("success", "Please refer to your email");
      }
      else {
        context.snackbar("error", rv.reason);
      }
    });
  }
  */
 
  const handleSignInBtn = (e) => {
    e.preventDefault();
    
    const data = {
      email: login.email,
      password: login.password,
      remember: login.remember, 
    };

    Server.login(data).then((d) => {
      if(d.msg === "OK") {
        context.snackbar("success", "Welcome to Ajoupyterhub")
        // console.log(d.user)
        props.onUserSignIn(d.user);
      }
      else {
        context.snackbar("error", d.msg);
      }
    });
  }

  return (
    <React.Fragment>
      <Box sx={styles.paper}>
        <Avatar sx={styles.avatar}>
          <LockIcon />
        </Avatar>
        <Typography >아주대학교 이메일 계정으로 Login 하세요.</Typography>
        <br />

        <form sx={styles.form} >
            <FormControl margin="normal" required fullWidth >
              <InputLabel htmlFor="email">Email Address</InputLabel>
              <Input id="email" name="email" autoComplete="email" autoFocus onChange={handleInputChange("email")} />
            </FormControl>
            <FormControl margin="normal" required fullWidth >
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                name="password"
                type="password"
                id="password"
                autoComplete="current-password" onChange={handleInputChange("password")}
              />
            </FormControl>
            <FormControl component="fieldset" margin="normal" required fullWidth>
              <FormControlLabel style={{ margin: 'auto' }} value="remember"
                control={<Checkbox name="remember" color="primary" onChange={handleInputChange("remember")} />}
                label="Remember me" labelPlacement="end" />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={styles.submit}
              onClick={ handleSignInBtn }
              disabled={false}
            >
              Sign in
            </Button>
        </form>
      </Box>
    </React.Fragment>
  );
}

export default SignInForm; 

