import React, { useContext, useState } from 'react';
import {
  Avatar, Box, Button, FormControl, Input, InputLabel, Checkbox,
  Typography, FormControlLabel
} from '@mui/material';
import LockIcon from '@mui/icons-material/LockOutlined';
import { useSnackbar } from '@lib/AppContext';
import Server from '@lib/server';

const styles = {
  paper: {
    width: '400px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    //marginTop: 1,
    //marginBottom: 1,
    //marginLeft: 1,
    //marginRight: 1,
    padding: 1,
  },
  avatar: {
    margin: 1, //theme.spacing(1),
    backgroundColor: 'secondary.main', //theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE11 issue.
    gap: "5px",
    display: 'flex',
    flexDirection: 'column',
  },
  submit: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    marginTop: 2,
  },
}

const SignInForm = (props) => {
  let [login, setLogin] = useState({ email: '', password: '', remember: false, errorMsg: '' });
  let snackbar = useSnackbar(); 

  const handleInputChange = (controlName) => (event) => {
    setLogin({ ...login, [controlName]: event.target.value });
  }

  /*
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  const handleForgotPassword = (e) => {
    e.preventDefault();

    const data = {
      email : login.email,
    };

    if(!emailRegex.test(data.email)) {
      snackbar("error", "Invalid email. Please, give me a valid email");
      return;
    }
    Server.forgotPassword(data).then((rv) => {
      if(rv.msg == "OK") {
        snackbar("success", "Please refer to your email");
      }
      else {
        snackbar("error", rv.reason);
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
      if (d.msg === "OK") {
        snackbar("success", "Welcome to Ajoupyterhub")
        props.onUserSignIn(d.user);
      }
      else {
        snackbar("error", d.msg);
      }
    });
  }

  return (
    <React.Fragment>
      <Box sx={styles.paper}>
        <Avatar sx={styles.avatar}>
          <LockIcon />
        </Avatar>
        <Typography > ID와 Password로 Login 하세요.</Typography>
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
          {/*
          <FormControl component="fieldset" margin="normal" required fullWidth>
            <FormControlLabel style={{ margin: 'auto' }} value="remember"
              control={<Checkbox name="remember" color="primary" onChange={handleInputChange("remember")} />}
              label="Remember me" labelPlacement="end" />
          </FormControl>
          */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={styles.submit}
            onClick={handleSignInBtn}
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

