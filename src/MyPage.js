import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, CssBaseline, Paper, Typography, IconButton, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions, Grid, Card, CardContent, CircularProgress, TextField,
  Tabs, Tab, 
} from '@material-ui/core';

import { createStyles, makeStyles } from '@material-ui/core/styles';
import { SettingsOutlined, LaptopMacOutlined, 
  PlayArrow, Stop, AddCircleOutline, FileCopyOutlined, DeleteOutlined, Group, ListAlt,
  VisibilityOffOutlined, VisibilityOutlined, HomeOutlined, CloseOutlined, } from '@material-ui/icons';
import withStyles from '@material-ui/core/styles/withStyles';
import { green, blue, yellow, red } from '@material-ui/core/colors';
import GroupList from './GroupList';
//import ProjectPage from './ProjectPage';
//import RegisterProjectForm from './RegisterProjectForm';
import { AppContext } from './app-context';
import ConfirmDialog from './ConfirmDialog';
import Fetch from './fetch';
import config from './config';

const styles = theme => ({
  root: {
    display : 'flex',
    flexDirection : 'row',
    padding: 0,
  },

  notebookPaper: {
    padding: theme.spacing.unit,
    width : '100%', 
    height : `calc(100vh - 20px)`,
    overflow : 'auto',
  },

  tabs : {
    height : `calc(100vh - 20px)`,
    border : '1px solid lightgray',
    width : 48,
  },
});

/*
class ConfirmDeleteProject extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      text : '',
      projectName : props.projectName,
    }
  }

  textChange = (e) => {
    this.setState({text: e.target.value});
    e.preventDefault();
  }

  handleClose = (boolDelete) => () => {
    console.log("ConfirmDeleteProject: ", this.state.text, this.props.projectName);
    if (boolDelete && this.state.text == this.props.projectName) {
      this.props.handleClose(true)();
    }
    else
      this.props.handleClose(false)();
  }

  componentDidUpdate(prevProps) {
    if(prevProps.projectData != this.props.projectData) {
      this.setState({projectName : this.props.projectName})      
    }
  }

  render () {
    return(
      <Dialog
        open={this.props.open}
        onClose={this.props.handleClose(false)}>
          <DialogTitle id="alert-dialog-title">{"Do you really want to delete this project?"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Type the name of the project:
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Project Name"
              type="text"
              helperText={this.props.projectName}
              fullWidth
              onChange={this.textChange}
            />
          </DialogContent>
          <DialogActions>
          <Button onClick={this.props.handleClose(false)} color="primary" autofocus>
              Cancel
            </Button>
            <Button onClick={this.handleClose(true)} color="primary" >
              OK
            </Button>
          </DialogActions>

      </Dialog>
    );
  }
}
*/

function ConfirmStopNotebook (props) {
  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.handleClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Do you really want to stop the notebook?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Press "OK" to stop the notebook.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose(false)} color="primary" autofocus>
            Cancel
          </Button>
          <Button onClick={props.handleClose(true)} color="primary" >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const useStylesContainerPlayer = makeStyles((theme) =>
  createStyles({
    buttonProgress: {
      color: green[500],
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -19,
      marginLeft: -19,
    },
    card: {
      backgroundColor: '#FEFEFE',
      height: 175,
    },
    actingCard: {
      borderRadius: '5px',
      border : '2px solid #4A90E2', 
      height: 175,
    },
  
    progressWrapper: {
      margin: theme.spacing(1),
      position: 'relative',
    },
    controls: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: theme.spacing(1),
    },
    playIcon: {
      height: 24,
      width: 24,
    },
    jupyter : {
      top : 0,
      left : 0,
    }
    }),
);

function ContanierPlayer (props) {

  let con = props.container;
  const classes = useStylesContainerPlayer();

  return (
    <Card className={(con.status === "running") ? classes.actingCard : classes.card}>
      <div className={classes.progressWrapper}>
        <CardContent>
        <Typography align="center" noWrap>
          { con.displayName }
        </Typography>
        <Typography align="center" noWrap>
          {/* config.notebookName[con.notebookName] */}
          {con.description}
          </Typography>                      
        </CardContent> 
        <div className={classes.controls}>
          <IconButton aria-label = "play/pause"
            onClick={props.onClickPlayBtn(con)} >
              {con.status !== "running" &&
                <PlayArrow className={classes.playIcon} />}
              {con.status === "running" &&
                <Stop className={classes.playIcon} />} 
              {con.progress != undefined && con.progress && 
                <CircularProgress size={38} className={classes.buttonProgress} />}
          </IconButton>
              
          <IconButton aria-label = "open jupyter notebook"
            onClick={props.onClickWindowBtn(con)} disabled = {con.status !== "running"}>
            <LaptopMacOutlined className={classes.playIcon}/>
          </IconButton>
        </div> 
        {con.status === "running" && con.passcode !== undefined && con.passcode !== null &&
        <div className={classes.controls}>
        <Typography align='center' variant="body2" style={{paddingRight : 8}} > 
          Passcode: { (con.passcodeVisibility) ? con.passcode : "*******"}</Typography>
        <IconButton aria-label = "copy the passcode to open jupyter notebook"
          onClick = { () => {navigator.clipboard.writeText(con.passcode)}} size="small">
            <FileCopyOutlined className={classes.playIcon}/>
        </IconButton>
        {
        <IconButton onClick={props.onClickVisibility(con) }>
          {con.passcodeVisibility && <VisibilityOffOutlined className={classes.playIcon}/>}
          {!con.passcodeVisibility && <VisibilityOutlined className={classes.playIcon}/>}
        </IconButton> }
        </div>}
        </div>
    </Card>
  )
}

const VerticalIconTab = withStyles( (theme) => ({
  root : {
    width : 48,
    minWidth : 36,
    '&:selected' : {
      color : '#0000FF', 
    },
    '&:hover' : {
      color : '#40a9ff',
    },
    '&:focus' : {
      color : '#40a9ff',
    },
    padding : 0,
    margin : 'auto',
  },
  
  indicator: {
    display: 'flex',
    justifycontent: 'center',
    backgroundColor: 'transparent',
    '& > div': {
      backgroundColor: '#635ee7',
    },
  },
}))((props) => <Tab {...props} tabindicatorprops={{ children: <div /> }}/>);


class MyPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      user: props.user, 
      notebooks: null,
      currentProject: null,
      loading: false,
      isProjectPageOpen: false,
      isRegisterProjectFormOpen: false,
      openConfirmationStop: false,
      openConfirmationDelete: false,
      openStopNotice : false,
      currentTab: 0,
    };

    this.mainPaperRef = React.createRef();
  }

  /* Needs DB Update */
  handleChangeUserInfo = (u) => {
    let { user } = this.state;
    user.name = u.name;
    user.dept = u.dept;
    //user.email = u.email;
    this.setState({ user });
  }

  countRunningNotebooks = () => {
    return this.props.user.notebooks.filter(notebook => {
      return notebook.status != null
    }).length;
  }

  handleNotebookBtnClick = (notebook) => () => {
    let context = this.context;
    let st = notebook.status;

    if (st === "running") {
      this.setState({openConfirmationStop: true, currentProject: notebook});
    }
    else if (st === null) { 
      if (this.countRunningNotebooks() > 1) {
        context.snackbar('warning', '동시에 최대 2개 프로젝트를 구동할 수 있습니다. 덜 필요한 프로젝트를 중지하고, 다시 시도하세요.');
        return;
      }
      notebook.progress = true;
      this.setState({});

      Fetch.startNotebook(this.state.user.id, notebook).then(d => {
        /* !!!!  WARNING  !!!! 
          When launcing docker contanier on the same network  with https protocol, 
          Chrome(ubuntu version-currently figured out) emit ERR_NETWORK_CHANGED Exception.
          The following code never be exceuted.*/
        if (d.status != "OK") {
          context.snackbar("error", "컨테이너를 실행할 수 없습니다.");
          return;
        } 
        else {
          notebook.status = "running"; //If no websocket
          console.log(d.passcode);
          notebook.passcode = d.passcode;
        }
      }).catch((e) => {
        context.snackbar("error", "시스템 자원이 부족합니다. Container not Available.");
        return;      
      }).finally(() => {

        notebook.progress = false;
        this.setState({ })

      });
    }
  }

  /*
  toggleProjectPage = (open) => () => {
    this.setState({ isProjectPageOpen: open });
  }
  */


  handleWindowBtnClick = (notebook) => () => {
    Fetch.statusNotebook(this.props.user.id, notebook.notebookName).then(d => {
      if (d.status != 'running') {
        this.context.snackbar('warning', '컨테이너가 준비되지 않았습니다. 다시 시작하세요. (30분 이상 방치 자동종료)');
        notebook.status = null;
        return;
      }
      let url = "/notebook/" + this.props.user.id + "/"+notebook.notebookName;
      notebook.url = url;

      notebook.window = window.open(url, this.props.user.id + "_" + notebook.notebookName);
      /*
      let urlSuffix = (notebook.notebookName == 'sshd') ? '' : `?token=${notebook.passcode}`
      notebook.url = `/notebook/${this.props.user.id}/${notebook.notebookName}${urlSuffix}`;
      notebook.window = window.open(notebook.url, `${this.props.user.id}_${notebook.notebookName}`); 
      */   
    })
  }
 
  toggleClickVisibility = (notebook) => () => {
    notebook.passcodeVisibility = !notebook.passcodeVisibility;
    this.setState({ }); 
  }

  updateState = (state) => {
    this.setState(state)
  }

  stopNotebook = (notebook) => {
    let context = this.context;
    if (notebook.window) {
      notebook.window.close();
    }
    notebook.status = null;
    notebook.passcode = null;
    notebook.progress = true;
    this.setState({}); 

    Fetch.stopNotebook(this.props.user.id, notebook).then(d => {
        /* !!!!  WARNING  !!!! 
        When launcing docker contanier on the same network with https protocol, 
        Chrome(ubuntu version-currently figured out) emit ERR_NETWORK_CHANGED Exception.
        The following code never be exceuted.*/
      if(d.status != "OK") {
        context.snackbar("error", "Request Failed. The container has not been stopped.")
        return;
      }
    }).finally(() => {

      notebook.progress = false;
      notebook.passcode = null;
      notebook.passcodeVisibility = false;

      this.setState({ currentTab : this.state.currentTab}); 
    });
  }

  handleConfirmationStop = (boolStop) => (e) => {
    this.setState({openConfirmationStop : false});
    if(boolStop) {
        this.stopNotebook(this.state.currentProject)
    }
  }

  handleConfirmationDelete = (boolDelete) => (e) => {
    this.setState({openConfirmationDelete : false});
    if(boolDelete) {
      this.deleteProject(this.state.currentProject)
    }
  }

  handleTabChange = (e, newTab) => {
    /*
      Synchronize Notebook server's status in K8S with Frontend's notebook status
    */
      this.setState({currentTab : newTab});
  }

  copyPassCode = (passcode) => () => {
    navigator.clipboard.writeText(passcode);
  }

  canControlGroups = () => {
    return this.state.user.primary_role !== "U" || 
      (this.state.user.groupsToControl  
        && this.state.user.groupsToControl.length > 0)
  }

  getToken = (notebookName) => {
    let n = this.props.user.notebooks.find((i) => i.notebookName == notebookName)
    return n.passcode;
  }

  displayNotebooks = () => {
    const { classes } = this.props;
    const currentUser = this.context.currentUser;
    return (
      <div className={classes.notebookPaper}>
        <Grid
          container
          direction="row"
          spacing={3}
          //alignItems="center"
        >
          {this.props.user.notebooks.map((row) => (
            <Grid item xs={4} >
              <ContanierPlayer key={`${currentUser}-${row.notebookName}`} container={row} 
                onClickWindowBtn={this.handleWindowBtnClick} 
                onClickPlayBtn={this.handleNotebookBtnClick}
                onClickVisibility={this.toggleClickVisibility}/>
            </Grid> ))
          }
        </Grid>
        
        <ConfirmDialog open={this.state.openConfirmationStop} handleClose = {this.handleConfirmationStop}
          title = "Do you really want to stop the notebook?" 
          message= {"Press \"OK\" to stop the notebook."}/>
      </div>
    );
  }

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <div className={classes.root} /* ref={this.mainPaperRef} */>
        <Tabs  className = {classes.tabs}
          orientation="vertical"
          value={this.state.currentTab}
          onChange={this.handleTabChange}
          >
            <VerticalIconTab   label="" icon={<ListAlt  />}
              value = {0}/> 
            <VerticalIconTab   label="" icon={<Group  />} 
              value = {1}
              disabled = { !this.canControlGroups()}/>
        </Tabs>

        {this.state.currentTab === 0 &&
            this.props.user.notebooks &&
            this.displayNotebooks()
        }
          
        {this.state.currentTab === 1 &&
            <GroupList />
        }
        </div>
      </React.Fragment>
    );
  }
}


MyPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

MyPage.contextType = AppContext;

export default withStyles(styles)(MyPage);
