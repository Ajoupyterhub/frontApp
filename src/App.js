import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';
import { Avatar, CssBaseline, Grid, AppBar, Toolbar, IconButton, Typography} from '@material-ui/core';
import { PowerSettingsNew, ExpandMore, MenuIcon, /* HomeIcon, RestoreIcon, FavoriteIcon, LocationOnIcon, ExitToApp, LockIcon */
  } from '@material-ui/icons';
import SignInForm from './SignIn';
import MyPage from './MyPage';
import MyProfile from './MyProfile';
//import RenewPassword from './RenewPassword';
import SnackbarMessage from './SnackbarMessage';
import {AppContext} from './app-context';
import { green } from '@material-ui/core/colors';
import ConfirmDialog from './ConfirmDialog';
import Fetch from './fetch';

const styles = theme => ({
  top: {
    position: 'fixed', // should try 'fixed' later
    top: '0px',
    left: '0px',
    width: '100%',
    display: 'flex',
    height: '60px',
    backgroundColor : 'white',
    justifyContent : 'space-between',
    overflow : 'hidden',
  },

  appTitle : {
    display: "flex", 
    justifyContent: 'flex-start', 
    alignItems : 'center'
  },

  whoami : {
      display: "inline-flex", 
      //justifyContent: 'flex-end', 
      alignItems : 'center'
  },

  mainPage : {
    position: 'fixed',
    top: '60px',
    width : '100%',
    //minHeight : `calc(100vh - 60px)`,
    height : '100vh',
    //display : 'flex',
    overflow : 'auto',
  },

  homePaper: {
    //maxWidth : '800px',
    minHeight: `calc(100%-60px)`, //'calc(100vh-60px)',
    //marginTop : '60px',
    display: 'flex',
    //flex : 'space-around',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    //overflowY : 'auto',
  },

  content: {
    flex: 1,
    maxWidth: 568,
    maxHeight: 284,
    //minWidth : 0,
    //height : 'auto',
    objectFit: 'contain',
  },

  notice: {
    display : 'flex',
    //flex: 1,
    width: '100%',
    justifyContent : 'space-evenly',
    alignItems : 'center',

    minHeight: 65,
    backgroundColor : theme.backgroundColor,
    //minWidth : 0,
    //height : 'auto',
    margin : 'auto',
    padding : '20px 5px', // 5px 5px 5px',
    //objectFit: 'contain',
  },
/*
  bottom: {
    width: '100%',
    position: 'fixed',
    bottom: '0px',
    display: 'flex',
    justifyContent: 'center',
    background: 'rgb(0, 212, 188)',
    height: '55px',
  },

  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  }, */
});


class _Home extends React.Component { //}= (props) => {
  //const { classes } = props;
  //const context = React.useContext(AppContext);    
  constructor (props) {
    super(props);

    this.state = {
      notice : null,
    }
  }

  componentDidMount () {
    Fetch.getNotice().then(d => {
      console.log(d[0].title);
      console.log(d[0].message);
      this.setState({notice : {title : d[0].title, message : d[0].message}});
    })
    .catch((e) => {console.log(`Fetch Error: ${e}`)});
  }
  

  render () {
    const {classes} = this.props;
    const {notice} = this.state;
  return (
    <>
      <div className={classes.notice} style={(notice) ? {backgroundColor : '#EEEEEE'} : {}}>
        <Typography variant='h4' color='primary' display = "inline" >{notice && notice.title}</Typography>
        <Typography variant='h6' color='inherit' display = "inline" >{notice && notice.message}</Typography>
      </div>
        
      <Grid container
        spacing={5}
        direction="row"
        alignContent="center"
        justifyContent="center"
        style={{ marginTop: '5px'}} >
        <Grid item lg={8}>
          <div className={classes.homePaper}>
            <img src="/static/images/jupyter.png" className={classes.content} /><br />
            <Typography align='center' variant="h3" color="inherit" >
              아주대학교 Jupyterhub
            </Typography><br />
            {/*<img src="/static/images/intro_ajou_symbol.png"/><br/>*/}
            {/*<img src="/static/images/slogan.png" style={{maxWidth: '327px', width: '100%'}} /><br/>*/}
            <img src="/static/images/slogan.png" className={classes.content} />
            <img src="/static/images/A01_SW_Oriented_Univ_V_1024x512.png"
              className={classes.content} /><br />
          </div>
        </Grid>
        <Grid item lg={4}>
            <SignInForm  onUserSignIn = {this.props.onUserSignIn} /> 
        </Grid>
      </Grid>
    </>
  );
  }
};

_Home.propTypes = {
  classes: PropTypes.object.isRequired,
};

const Home = withStyles(styles)(_Home);


class App extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      menuOpen: false,
      selectedMenuItem: -1,
      menuType: 'general',
      menuNode: null,
      mainForm: "home",
      user: null,
      token : "",
      bShowProfile: false,

      value: null,
      snackbarOpen : false,
	    snackbarVariant: "success",
      snackbarMessage : "Login Success",
    };
  }

  componentDidMount() {
    /*
      var _home_href = window.location.href;
      var _bPageLoaded = false;
      var _bAtHome = true;
      window.history.pushState({"href": _home_href}, null, _home_href);
    
      // 2. Now attach the popstate handler.
      window.onpopstate = function(ev) {
      // Raised on page load this event will still contain no state.
        if (_bPageLoaded) {
          window.history.go(_home_href);
            window.location.href = _home_href;
        }
        else{
          _bPageLoaded = true;
          window.history.pushState({"href": _home_href}, null, _home_href);
        }
      }; */
    console.log(`PathName: ${this.props.pathname}`);
    let path = this.props.pathname;

    if(path.startsWith("/account/RenewPassword")) {
      let params = (new URL(document.location)).searchParams;
      let userID = params.get('user'); // is the string "Jonathan Smith".
      //let userID = path.split("=")[1];
      history.pushState({}, "Reset Password", "/");
      /*if(token.length < 40) {
        this.onMessage("error", "Invalid token");
        window.location.href = "/";
        return;
      }*/
      console.log(path, userID);
      //this.setState({mainForm: "renew", userID});
      return;
    }
    else {
      history.pushState({}, '', '/');
    }
    /*
    if (this.state.user) {
      this.setState({mainForm : "mypage"})
      return;
    }*/


    /*
    let cookie = window.document.cookie;
    if (cookie) {
      //remember_token=<username>|af7cc9b124548883a77abf56914556916f.... 
      let ck_lines = cookie.split(';');
      let token = ck_lines.find((ck) => {
	      return (ck.split('=')[0].includes('remember_token'));});
      //console.log(token);
      if (token) {
      	let userID= token.split('=')[1].split('|')[0];
      	if (userID) {
		      // Must retrieve user Info.
        	this.setState({ mainForm: "mypage", userID});
		      return;
      	}
      }
      this.setState({mainForm: "home"});
      return;
    }
    */
  }

  snackbar = (variant, message) => {
    this.setState({snackbarOpen : true, snackbarVariant : variant, snackbarMessage : message});
  }

  handleSnackbarClose = (event, reason) => {
    if(reason === 'clickaway')
	    return;
    this.setState({snackbarOpen : false});
  }

  toggleMenu = (menuOpen) => () => {
    this.setState({ menuOpen});
  };

  handleSelectMenu = (type, idx) => (e) => {
    this.setState({ selectedMenuItem: idx, menuType: type, menuOpen: false });
  };

  onUserSignIn = (user) => {
    //console.log(user.imageUrl);
    Fetch.getNotebooks(user.id).then(d => {
      let firstOne = [] // (user.primary_role == 'O') ? [{projID : 0}] : [];
      //let notebooks = firstOne.concat(d);
      user.notebooks = d //[...notebooks];
      //console.log(user.notebooks)
      //this.setState({notebooks});
      this.setState({mainForm : "mypage", user});
    });
  }

  /*
  handleChangeTab = (mainForm) => () =>{
    this.setState({mainForm});
  }
  */
 
  handleShowProfile = (e) => {
    this.setState({bShowProfile : this.state.bShowProfile ? null : e.currentTarget});
  }

  changeUserInfo = (u) => {
    // It only alters user's profile.
    let {user} = this.state;
    user.name = u.name;
    user.dept = u.dept;
    user.academicID = u.academicID;
    this.setState({user});
  }
  
  /* changeUserProjectsInfo = (project, action) => {
    let {user} = this.state;
    if(action === 'ADD') {
      user.notebooks = [...user.notebooks, project]
    }
    else { // action === 'DELETE' {
      user.notebooks = user.notebooks.filter((n) => {return (n.projID != project.projID)})
    }
    this.setState({user})
  } */

  getTabButtonColor = (tab) => {
    return (this.state.mainForm == tab) ? "primary" : "default"
  }

  onExit = () => {
    Fetch.logout().then((d) => {
      if(d.msg != 'OK') {
        this.snackbar(d.level, d.msg);
      }
      else
        this.snackbar('success', 'Goodbye');
    }).catch(error => {
      console.log(error);
    }).finally(() => {
      this.setState({ mainForm: "home", user : null});
    });
  }

  getExitButtonVisibility = () => {
    console.log(this.state.mainForm);
    return (this.state.mainForm == "mypage") ? "visible" : "hidden";
  }

  render() {
    const { classes } = this.props;
    console.log(this.state.mainForm);

    return (
      <React.Fragment>
        <CssBaseline />
        <AppBar className={classes.top}>
        <Toolbar className={classes.top}>
          <div className={classes.appTitle} >
            <img src="./static/images/intro_ajou_symbol.png" style={{ height: 50, width: 'auto'}}/>
        
            <Typography variant="h5" color="primary" align="center" style={{ flexGrow: 1, marginLeft: 10 }} >
              AjoupyterHub - 아주대학교 코딩 놀이 공간
            </Typography> 
            </div>  
            {this.state.mainForm != "home" && this.state.user != null &&
            <div style={{justifyContent : 'flex-end', alignItems : 'center'}}>
            <Typography color="primary" display="inline" /* justifyContent="flex-end"*/ align="center"  >
              {this.state.user.name}
            </Typography>
            <IconButton aria-label="whoami" /* edge="end" */
              color="primary" disabled={this.state.mainForm != "mypage"}  /* justifyContent="flex-end"*/
              onClick={this.handleShowProfile}>
                {this.state.user != null && <Avatar src={this.state.user.imageUrl} />}
                {/*
              <ExpandMore visibility={this.state.mainForm != "home" && "visible" || "hidden"}/>
                */}              
            </IconButton>
            <IconButton aria-label="Exit" onClick={this.onExit} /* edge="end"*/
              color="primary"  /*justifyContent="flex-end"*/>
              <PowerSettingsNew id="Btn_exit"/>              
            </IconButton>
            {/*  <IconButton aria-label="Exit" onClick={this.onExit} edge="end"
              color="primary" disabled={this.state.mainForm == "home"}  justifyContent="flex-end">
              <PowerSettingsNew id="Btn_exit" visibility={this.state.mainForm != "home"}/>              
              </IconButton> */}
            </div> 
          }
          </Toolbar>
        </AppBar>
        <AppContext.Provider value={{snackbar : this.snackbar,  currentUser: this.state.user, 
           changeUserInfo : this.changeUserInfo, }} >
        <MyProfile  {...this.state.user} open={this.state.bShowProfile}  onClose={() => {this.setState({bShowProfile : false})}}
          anchor={document.getElementById("Btn_exit")}/>
	      </AppContext.Provider>

        <div className={classes.mainPage}>
        <AppContext.Provider value={{snackbar : this.snackbar, currentUser: this.state.user,
             /* changeUserProjectsInfo : this.changeUserProjectsInfo,*/ }} >
          {this.state.mainForm == "home" && <Home onUserSignIn={this.onUserSignIn} />}
          {this.state.mainForm == "mypage" && <MyPage user={this.state.user} />}
          {/* this.state.mainForm == "renew" && <RenewPassword userID={this.state.userID} />*/}
	      </AppContext.Provider>
        </div>
	      <SnackbarMessage open={this.state.snackbarOpen}
	        variant = {this.state.snackbarVariant}
	        message = {this.state.snackbarMessage}
	        onClose = {this.handleSnackbarClose}/>
      </React.Fragment>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
