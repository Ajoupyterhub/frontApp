import React, { useState, useEffect, useContext } from 'react';
import {
  Typography, IconButton, Grid, Card, CardContent, CircularProgress,
  Tabs, Tab,
} from '@mui/material';

import { LaptopMacOutlined, PlayArrow, Stop, FileCopyOutlined, Group, ListAlt,
  VisibilityOffOutlined, VisibilityOutlined,
} from '@mui/icons-material';
import { green } from '@mui/material/colors';
import GroupList from '@components/Group/GroupList';
import { AppContext } from '@lib/app-context';
import ConfirmDialog from '@components/ConfirmDialog';
import Server from '@lib/server';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
    height: `calc(100vh - 60px)`,
  },

  notebookPaper: {
    padding: '8px', // theme.spacing.unit,
    width: '100%',
    height: `calc(100vh - 20px)`,
    overflow: 'auto',
  },

  tabs: {
    height: `calc(100vh - 20px)`,
    border: '1px solid lightgray',
    width: 48,
  },

  tabIcon: {
    padding: 0,
    margin: '0px',
    width: 48,
    minWidth: 36,
    '&:selected': {
      color: '#0000FF',
    },
    '&:hover': {
      color: '#40a9ff',
    },
    '&:focus': {
      color: '#40a9ff',
    },
    /*
    indicator: {
      display: 'flex',
      justifycontent: 'center',
      backgroundColor: 'transparent',
      '& > div': {
        backgroundColor: '#635ee7',
      },
    },  */
  },
};

const stylesContainer = {
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
    maxWidth: 350,
  },
  actingCard: {
    borderRadius: '5px',
    border: '2px solid #4A90E2',
    height: 175,
  },

  progressWrapper: {
    margin: 1, //theme.spacing(1),
    position: 'relative',
  },
  controls: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 1, //theme.spacing(1),
  },
  playIcon: {
    height: 24,
    width: 24,
  },
  jupyter: {
    top: 0,
    left: 0,
  }
};

function ContanierPlayer(props) {

  let con = props.container;

  return (
    <Card sx={(con.status === "running") ? stylesContainer.actingCard : stylesContainer.card}>
      <div style={stylesContainer.progressWrapper}>
        <CardContent>
          <Typography align="center" noWrap>
            {con.displayName}
          </Typography>
          <Typography align="center" noWrap>
            {/* config.notebookName[con.notebookName] */}
            {con.description}
          </Typography>
        </CardContent>
        <div style={stylesContainer.controls}>
          <IconButton aria-label="play/pause"
            onClick={props.onClickPlayBtn(con)} >
            {con.status !== "running" &&
              <PlayArrow sx={stylesContainer.playIcon} />}
            {con.status === "running" &&
              <Stop sx={stylesContainer.playIcon} />}
            {con.progress != undefined && con.progress &&
              <CircularProgress size={38} sx={stylesContainer.buttonProgress} />}
          </IconButton>

          <IconButton aria-label="open jupyter notebook"
            onClick={props.onClickWindowBtn(con)} disabled={con.status !== "running"}>
            <LaptopMacOutlined sx={stylesContainer.playIcon} />
          </IconButton>
        </div>
        {con.status === "running" && con.passcode !== undefined && con.passcode !== null &&
          <div style={stylesContainer.controls}>
            <Typography align='center' variant="body2" style={{ paddingRight: 8 }} >
              Passcode: {(con.passcodeVisibility) ? con.passcode : "*******"}</Typography>
            <IconButton aria-label="copy the passcode to open jupyter notebook"
              onClick={() => { navigator.clipboard.writeText(con.passcode) }} size="small">
              <FileCopyOutlined sx={stylesContainer.playIcon} />
            </IconButton>
            {
              <IconButton onClick={props.onClickVisibility(con)}>
                {con.passcodeVisibility && <VisibilityOffOutlined sx={stylesContainer.playIcon} />}
                {!con.passcodeVisibility && <VisibilityOutlined sx={stylesContainer.playIcon} />}
              </IconButton>}
          </div>}
      </div>
    </Card>
  )
}

const MyPage = (props) => {

  let context = useContext(AppContext);
  const { user } = props;
  let [state, setState] = useState({
    notebooks: null,
    currentNotebook: null,
    openConfirmationStop: false,
    currentTab: 0,
  })

  useEffect(() => {
    Server.getNotebooks(user.id).then(d => {
      setState({ ...state, notebooks: d });
    });
  }, [user])

  const countRunningNotebooks = () => {
    return state.notebooks.filter(notebook => {
      return notebook.status != null
    }).length;
  }

  const handleNotebookBtnClick = (notebook) => () => {
    let st = notebook.status;

    if (st === "running") {
      setState({ ...state, openConfirmationStop: true, currentNotebook: notebook });
      return;
    }
    if (st === null) {
      if (countRunningNotebooks() > 1) {
        context.snackbar('warning', '동시에 최대 2개 프로젝트를 구동할 수 있습니다. 덜 필요한 프로젝트를 중지하고, 다시 시도하세요.');
        return;
      }
      notebook.progress = true;
      updateState();

      console.log(notebook);

      Server.startNotebook(user.id, notebook).then(d => {
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
        updateState();
      });
    }
  }

  const handleWindowBtnClick = (notebook) => () => {
    Server.statusNotebook(user.id, notebook.notebookName).then(d => {
      if (d.status != 'running') {
        context.snackbar('warning', '컨테이너가 준비되지 않았습니다. 다시 시작하세요. (30분 이상 방치 자동종료)');
        notebook.status = null;
        return;
      }
      /*
      let url = "/notebook/" + this.props.user.id + "/"+notebook.notebookName;
      notebook.url = url;
      notebook.window = window.open(url, this.props.user.id + "_" + notebook.notebookName); */
      let urlSuffix = (notebook.notebookName == 'term') ? '' : `?token=${notebook.passcode}`
      if (notebook.notebookName == 'code') {
        notebook.url = `/code/${user.id}/${notebook.notebookName}/`
      }
      else {
        notebook.url = `/notebook/${user.id}/${notebook.notebookName}${urlSuffix}`;
      }
      notebook.window = window.open(notebook.url, `${user.id}_${notebook.notebookName}`);
    })
  }

  const toggleClickVisibility = (notebook) => () => {
    notebook.passcodeVisibility = !notebook.passcodeVisibility;
    updateState();
  }

  const updateState = () => {
    setState({ ...state })
  }

  const stopNotebook = (notebook) => {
    if (notebook.window) {
      notebook.window.close();
    }
    notebook.status = null;
    notebook.passcode = null;
    notebook.progress = true;
    updateState();

    Server.stopNotebook(user.id, notebook).then(d => {
      /* !!!!  WARNING  !!!! 
      When launcing docker contanier on the same network with https protocol, 
      Chrome(ubuntu version-currently figured out) emit ERR_NETWORK_CHANGED Exception.
      The following code never be exceuted.*/
      if (d.status != "OK") {
        context.snackbar("error", "Request Failed. The container has not been stopped.")
        return;
      }
    }).finally(() => {

      notebook.progress = false;
      notebook.passcode = null;
      notebook.passcodeVisibility = false;

      //updateState(); 
    });
  }

  const handleConfirmationStop = (boolStop) => (e) => {
    if (boolStop) {
      stopNotebook(state.currentNotebook)
    }
    setState({ ...state, openConfirmationStop: false });
  }

  const handleTabChange = (e, newTab) => {
    /*
      Synchronize Notebook server's status in K8S with Frontend's notebook status
    */
    setState({ ...state, currentTab: newTab });
  }

  const copyPassCode = (passcode) => () => {
    navigator.clipboard.writeText(passcode);
  }

  const canControlGroups = () => {
    return user.primary_role !== "U" ||
      (user.groupsToControl
        && user.groupsToControl.length > 0)
  }

  const getToken = (notebookName) => {
    let n = state.notebooks.find((i) => i.notebookName == notebookName)
    return n.passcode;
  }

  const displayNotebooks = () => {
    //const { classes } = this.props;
    const userId = props.user.id;
    return (
      <div style={styles.notebookPaper}>
        <Grid
          container
          direction="row"
          spacing={3}
        //alignItems="center"
        >
          {state.notebooks.map((row) => (
            <Grid item xs={4} key={`${userId}-${row.notebookName}`} >
              <ContanierPlayer  container={row}
                onClickWindowBtn={handleWindowBtnClick}
                onClickPlayBtn={handleNotebookBtnClick}
                onClickVisibility={toggleClickVisibility} />
            </Grid>))
          }
        </Grid>

        <ConfirmDialog open={state.openConfirmationStop}
          handleClose={handleConfirmationStop}
          title="Do you really want to stop the notebook?"
          message={"Press \"OK\" to stop the notebook."} />
      </div>
    );
  }

  let classes = styles;

  return (
    <React.Fragment>
      <div style={classes.root} /* ref={this.mainPaperRef} */>
        <Tabs sx={classes.tabs}
          orientation="vertical"
          value={state.currentTab}
          onChange={handleTabChange}
        >
          <Tab sx={styles.tabIcon} label="" icon={<ListAlt />} value={0} />
          <Tab sx={styles.tabIcon} label="" icon={<Group />} value={1}
            disabled={!canControlGroups()} />
        </Tabs>

        {state.currentTab === 0 && state.notebooks &&
          displayNotebooks()
        }

        {state.currentTab === 1 && <GroupList />}
      </div>
    </React.Fragment>
  );
}

export default MyPage;
