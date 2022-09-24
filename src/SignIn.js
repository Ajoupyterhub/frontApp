import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {
  Avatar, Button, CssBaseline, FormControl, Input, InputLabel, Checkbox,
  Paper, Typography, Tabs, Tab, FormControlLabel, FormLabel, RadioGroup, Radio
} from '@material-ui/core';
import LockIcon from '@material-ui/icons/LockOutlined';
import withStyles from '@material-ui/core/styles/withStyles';
import {AppContext} from './app-context';
import Fetch from './fetch';
import GoogleSignInBtn from './GoogleSignIn';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleConfig from './authSecret';

const styles = theme => ({
  layout: {
    width: 'auto',
    position : 'relative',
    top : '60px',
    //display: 'flex', // Fix IE11 issue.
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    //marginTop : '60px',
    //marginBottom : 'auto',
    [theme.breakpoints.up(400 + theme.spacing(3) * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
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
    //marginTop: theme.spacing(3),
    width : '400px', //'100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent : 'center',
    alignItems: 'center',
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px ${theme.spacing(2)}px`,
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'row',
    margin: 'auto',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE11 issue.
  },
  submit: {
    display : 'flex',
    justifyContent : 'center',
    marginTop: theme.spacing(2),
  },
});


const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

class _SignIn extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state ={
      email : "",
      password : "",
      remember : false,
      errorMsg : "",
    };
  }

  handleInputChange = (controlName) => (event) => {
    this.setState({[controlName] : event.target.value});
  }

  handleForgotPassword = (e) => {
    e.preventDefault();
    let context = this.context;

    const data = {
      email : this.state.email,
    };

    if(!emailRegex.test(data.email)) {
      context.snackbar("error", "Invalid email. Please, give me a valid email");
      return;
    }
    Fetch.forgotPassword(data).then((rv) => {
      if(rv.msg == "OK") {
        context.snackbar("success", "Please refer to your email");
      }
      else {
        context.snackbar("error", rv.reason);
      }
    });
  }

  onSuccessGoogleSignIn = (userProfile) => {
    let context = this.context;
    
    Fetch.googleLogin(userProfile).then((d) => {
      if(d.msg === "OK") {
        context.snackbar("success", "Login Success");
        //d.user.imageUrl = imageUrl;
        this.props.onUserSignIn(d.user);
        //console.log(d);
      }
    }).catch(error => {
      console.log("Error Occurred when Sign In");
      console.log(error);
      if(error.startsWith('popup'))
        context.snackbar("warning", 'login이 취소되었습니다.');
    });
    
    return;
  }

  onFailureGoogleSignIn = (error) => {
    let context = this.context
    console.log("Error Occurred when Sign In");
    console.log(error);
    if(error.startsWith('popup'))
      context.snackbar("warning", 'login이 취소되었습니다.');
    console.log("Google SignIn Failed");
  }

  handleSignInBtn = (e) => {
    e.preventDefault();
    let context = this.context;
    
    const data = {
      email: this.state.email,
      password: this.state.password,
      remember: this.state.remember, 
    };

    Fetch.login(data).then((d) => {
      if(d.msg === "OK") {
        context.snackbar("success", "Login Success");
        this.props.onUserSignIn(d.user);
        console.log(d);
      }
      else {
        context.snackbar("error", d.msg);
      }
    });
  }
  render () {
    const { classes, signInMode } = this.props;
  
    return (
      <React.Fragment>
        <CssBaseline />
        {/*<main className={classes.layout}>*/}
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockIcon />
          </Avatar>
          <Typography >아주대학교 이메일 계정으로 Login 하세요.</Typography>
          <br/>
          
          {/*  <FormControl margin="normal" required fullWidth> */}
          {signInMode == 'Google' && 
          <div style={{marginBottom: 15}}>
            <img src="/static/images/intro_ajou_symbol.png" 
              style={{objectFit : 'contain'}}/> 
          </div>
          }
          {/*  </FormControl> */}
          
          <form className={classes.form} /* onSubmit={this.handleSignInBtn} */ > 
          {signInMode == 'dev' && <div>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Email Address</InputLabel>
              <Input id="email" name="email" autoComplete="email" autoFocus onChange={this.handleInputChange("email")}/>
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                name="password"
                type="password"
                id="password"
                autoComplete="current-password" onChange={this.handleInputChange("password")}
              />
            </FormControl>
            <FormControl component="fieldset" margin="normal" required fullWidth>
                <FormControlLabel style={{ margin: 'auto' }} value="remember" 
                    control={<Checkbox name = "remember" color="primary" onChange={this.handleInputChange("remember")}/>}
                    label="Remember me" labelPlacement="end" />
            </FormControl>
           <Button 
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={(signInMode == 'dev') ? this.handleSignInBtn : this.handleGoogleSignInBtn} 
              disabled={ false }
              >
              Sign in
            </Button> </div>}
            {signInMode == 'Google' && <div className={classes.submit}>
            {/* <Typography className={classes.submit} fullWidth centered alignItems='center'> 
              <Button onClick={this.handleForgotPassword} > Login With Google</Button> 
              Google 인증(OAuth)으로 Login 합니다.
            </Typography>
            <GoogleSignInBtn style = {{marginTop : 20}}
              hostedDomain={GoogleConfig.hosted_domain} onUserSignIn={this.props.onUserSignIn}/>*/}
              <GoogleSignInBtn onSuccess = {this.onSuccessGoogleSignIn} onError={this.onFailureGoogleSignIn}
                onUserSignIn={this.props.onUserSignIn} >
              </GoogleSignInBtn>
              <div>
            <Typography className={classes.submit} fullWidth centered alignItems='center'> 
              {this.state.errorMsg}
            </Typography></div>
            </div>}
          </form>
        </div>
        {/*</main>*/}
      </React.Fragment>
    );
  }
}


class _Register extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      academicID : "",
      dept : "",
      primary_role : "U",
      errorMsg : "",
      confirmPrivacy : false,
    };
  }

  handleInputChange = (controlName) => (event) => {
    if(controlName == 'confirmPrivacy') {
      this.setState({[controlName] : event.target.checked});
    }
    else
      this.setState({[controlName] : event.target.value});
  }

  verifyInputData = (e) => {
    const {academicID, dept, primary_role} = this.state;

    const academicIDRegex = /^2[0-9]{8}$/g;
    if(academicIDRegex.test(academicID)) {
      let first4 = parseInt(academicID.slice(0, 4));
      let thisYear = parseInt((new Date()).getFullYear());
      if (first4 > thisYear) {
        let errorMsg = "Invalid academic ID. Please, give me a valid academic ID.";
        this.setState({errorMsg})
        return false;
      }
    }
    else {
      let errorMsg = "Invalid academic ID. Please, give me a valid academic ID";
      this.setState({errorMsg})
      return false;
    } 

    return true;
  }

  handleRegisterBtn = (res) => {
    //e.preventDefault();
    let context = this.context;
    
    this.setState({errorMsg : ''});
    let data = {}
    data["academicID"] = this.state.academicID;
    data["dept"] = this.state.dept;
    data["primary_role"] = this.state.primary_role;
    data["email"] = res.email; //getEmail();
    data["name"] = res.name; //getName();
    data["picture"] = res.picture; //getImageUrl();
    data["loginType"] = "Google";
    console.log(data)
    Fetch.registerUser(data).then((d) => {
      if(d.msg != "OK")
        context.snackbar("error", d.msg);
      else {
        context.snackbar("success", "회원 가입이 완료되었습니다.");
        this.props.onMoveTab(0);   
      }
    }).catch(e => {
      console.log("Fetch.registerUser Error", e);
      context.snackbar("error", "Fetch.registerUser Error")
    });
    return;
  }

  render () {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <CssBaseline />
        {/*<main className={classes.layout}>*/}
        <div className={classes.paper}>
          {/* <Typography variant="headline">Register</Typography> */}
          <form className={classes.form} onSubmit={this.handleRegisterBtn} > {/* action="/account" method="POST"> */}
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
            <FormControl margin="normal" required >
              <InputLabel htmlFor="academicID">학번 (또는 임용번호)</InputLabel>
              <Input id="academicID" name="academicID" onChange={this.handleInputChange("academicID")}/>
            </FormControl>


            <FormControl margin="normal" required >
              <InputLabel htmlFor="dept">학과</InputLabel>
              <Input id="dept" name="dept" onChange={this.handleInputChange("dept")}/>
            </FormControl>

            {/*
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="deptName">학과</InputLabel>
                <Select value={this.state.dept}
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
              <FormLabel component="legend">역할</FormLabel>
              <RadioGroup className={classes.radioGroup} aria-label="role" name="role" 
  	  	        value={this.state.primary_role} onChange={this.handleInputChange("primary_role")}>
                <FormControlLabel style={{ margin: 'auto' }} value="O" control={<Radio color="primary" />}
                  label="교수" labelPlacement="end" />
                <FormControlLabel style={{ margin: 'auto' }} value="U" control={<Radio color="primary" />}
                  label="학생" labelPlacement="end" />
              </RadioGroup>
            </FormControl>
            {/* 학생은 교과목 그룹에 속해야 사용할 수 있으며, 교수 역할은 학과 및 임용번호 확인 후 가입이 완료됩니다.*/}
            <Typography className={classes.submit} fullWidth centered variant='body2'>  
              귀하의 암호는 Google이 보관합니다.
            </Typography>

            <Typography className={classes.submit} fullWidth centered variant='body1' > 
              개인정보 수집 및 이용 동의
            </Typography>
            <Typography className={classes.submit} fullWidth centered variant='body2'> 
              귀하의 개인정보 (학번 또는 임용번호, 이메일, 소속학과, 이름) 수집에 동의합니다.
            </Typography>

            <FormControl component="fieldset" margin="normal" required fullWidth>
                <FormControlLabel style={{ margin: 'auto' }} value={this.state.confirmPrivacy}
                    control={<Checkbox name = "confirmPrivacy" color="primary" 
                    /*checked={this.state.confirmPrivacy}*/
                    onChange={this.handleInputChange("confirmPrivacy")}/>}
                    label="동의합니다." labelPlacement="end" />
            </FormControl>
            <GoogleSignInBtn onSuccess={this.handleRegisterBtn} 
              beforeSignIn={this.verifyInputData}
              disabled={this.state.academicID.length < 9  || this.state.dept.length < 1 || !this.state.confirmPrivacy}/>

            {/*
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              //onClick={this.handleRegisterBtn} // Must remove to get FormData. FormData uses Form submit
              disabled={this.state.academicID.length < 9  || this.state.dept.length < 1 || !this.state.confirmPrivacy}
            >
              Register
            </Button>
            */}
            {/*
            <Typography className={classes.submit} fullWidth centered> 
               Google 인증(OAuth)으로 Ajou Email Address와 이름을 확인합니다. 
            </Typography>
            */}
            <Typography className={classes.submit} fullWidth centered> 
              {this.state.errorMsg}
            </Typography>
          </form>
        </div>
        {/*</main>*/}
      </React.Fragment>
    );
  }
}

_Register.propTypes = {
  classes: PropTypes.object.isRequired,
};

_SignIn.propTypes = {
  classes: PropTypes.object.isRequired,
};

_SignIn.contextType = AppContext;
_Register.contextType = AppContext;

const SignIn = withStyles(styles)(_SignIn);
const Register = withStyles(styles)(_Register);


class SignInForm extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      selectedTab: 0,
      signInMode : 'Google',
    };
  }

  componentDidMount () {
    let pathname = window.location.pathname;
    console.log('SignInForm', pathname );
    this.setState({signInMode : (pathname.startsWith('/dev')) ? 'dev' : 'Google'});
  }

  handleTabChange = (event, selectedTab) => {
    this.setState({ selectedTab });
  };

  forceTabChange = (selectedTab) =>  {
    this.setState({ selectedTab });
  }

  render() {

    const { classes} = this.props;

    return (
      <React.Fragment>
        {/* <CssBaseline />*/}
        {/* <div className={classes.layout}> */}
        <GoogleOAuthProvider clientId={GoogleConfig.clientId}>
          <Paper className={classes.paper}>
            <Tabs
              /* className_={classes.tabs} */
              value={this.state.selectedTab}
              onChange={this.handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              centered
            >
              <Tab label="Sign In" />
              <Tab label="Register" />
            </Tabs>
            {this.state.selectedTab == 0 && 
              <SignIn onUserSignIn={this.props.onUserSignIn} 
                  signInMode={this.state.signInMode}/>}
            {this.state.selectedTab == 1 && 
              <Register onMoveTab={this.forceTabChange} />}
          </Paper>
          <div style={{width: '100%', minHeight: '60px'}}></div>
        </GoogleOAuthProvider>;

        {/* </div> */}
      </React.Fragment>
    );
  }
}

SignInForm.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignInForm);

