import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Card, CardContent, IconButton, Typography, SvgIcon
} from '@mui/material';
import {
  PlayArrow, Stop, LanguageOutlined, LaptopMacOutlined, RocketLaunchTwoTone,
} from '@mui/icons-material';
import { green } from '@mui/material/colors';
import { currentUser, useSnackbar, useConfirm } from '@lib/AppContext';
import Server from '@lib/server';

const stylesContainer = {
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: '-19px',
    marginLeft: '-19px',
  },
  card: {
    backgroundColor: '#FEFEFE',
    minHeight: 180,
    width : '30%',
    maxWidth: 380,
    minWidth: 230,
    marginRight: 1,
  },
  actingCard: {
    borderRadius: '5px',
    border: '2px solid #4A90E2',
    height: 180,
    width : '30%',
    maxWidth: 380,
    minWidth: 230,
    marginRight: 1,
    overflowY: 'scroll',
  },

  progressWrapper: {
    margin: 1, //theme.spacing(1),
    position: 'relative',
  },
  content: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  containerIcon: {
    width: 'auto',
    height: '45px',
    //objectFit: 'contain'
  },
  controls: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 2, //theme.spacing(1),
    paddingRight: 2,
  },
  playIcon: {
    height: 36,
    width: 36,
  },
};

const WebDeployer = (props) => {

  let [status, setStatus] = useState(null);
  let [message, setMessage] = useState(null);
  let webWindowRef = useRef(null);

  const user = currentUser();
  const snackbar = useSnackbar();
  const getConfirm = useConfirm();

  useEffect(() => {
    Server.statusWeb(user.id).then(r => {
      setStatus(r.status);
    })
  }, [])

  // const handleContainerBtnClick = () => {
  //   if (status.proxy === "OK") {
  //     getConfirm("Web 배포를 중지하겠습니까?", "\"OK\"를 누르면 배포된 Web과의 연결이 중지됩니다.")
  //       .then(d => {
  //         if (d) {
  //           stopDeploy()
  //         }
  //       })
  //     return;
  //   }
  //   if (status === null) {
  //     Server.startDeploy(user.id).then(d => {

  //       if (d.status != "OK") {
  //         snackbar("error", "Web을 배포할 수 없습니다.");
  //         return;
  //       }
  //       else {
  //         setStatus({...status, proxy : "OK"});
  //       }
  //     }).catch((e) => {
  //       snackbar("error", "Web 배포 과정에서 에러가 발생하였습니다.");
  //       return;
  //     })
  //   }
  // }

  const handleWindowBtnClick = () => {
    Server.statusWeb(user.id).then(r => {
      let url = `/app/${user.id}/web/`
      if(r.status == 'OK') {
        console.log(`Trying to open ${url}`);
        webWindowRef.current = window.open(url, `${user.id}_web`);    
      }
      else {
        setMessage(`VS-Code에서 web이 작동하지 않습니다.(port: 3333)`)
        setTimeout(() => setMessage(null), 3500);
      }
    })
  }

  // const stopDeploy = () => {
  //   if (conWindowRef.current) {
  //     conWindowRef.current.close();
  //     conWindowRef.current = null;
  //   }

  //   Server.stopDeploy(user.id).then(d => {
  //     if (d.status != 'OK') {
  //       snackbar("error", "Web 배포 해제가 실패하였습니다.")
  //       return;
  //     }
  //   }).finally(() => {
  //     setStatus(null);
  //   });
  // }

  return (
    <React.Fragment>
      <Card sx={(status === "OK") ? stylesContainer.actingCard : stylesContainer.card}>
        <div style={stylesContainer.progressWrapper}>
          <CardContent sx={stylesContainer.content}>
            <div>
              <Typography sx={{ fontWeight: 700 }} align="center" noWrap>
                Web 배포 (Deploy) 
                {/*container.displayName*/}
              </Typography>
              <Typography align="center">
                실행한 web (port: 3333)을 확인합니다. {/* `http://jupyter.ajou.ac.kr/app/${user.id}/web/` */}
                </Typography>
                {/* <Typography align="center">
                VS-Code에서 3333 port 번호로 Web App.을 실행하면 위의 URL로 접속할 수 있습니다. 
                </Typography>*/}
            </div>
          </CardContent>
          <Box sx={stylesContainer.controls}>
            {/*
            <IconButton aria-label="play/pause"
              onClick={handleContainerBtnClick} >
              {(status.proxy !== "OK") ?
                <PlayArrow sx={stylesContainer.playIcon} /> :
                <Stop sx={stylesContainer.playIcon} />}
              { progress &&
                (<CircularProgress size={38} sx={stylesContainer.buttonProgress} />) }
            </IconButton>
            */}

            <IconButton aria-label="open container or notebook"
              onClick={handleWindowBtnClick} /* disabled={status !== "OK"} */>
              <LanguageOutlined  sx={stylesContainer.playIcon} />
            </IconButton>
          </Box>
        </div>
        <Box sx={stylesContainer.controls}>
        {message &&
          <Typography align='center' variant="body2" color="primary">
            {message}
          </Typography> }
          {/* <RocketLaunchTwoTone sx={stylesContainer.containerIcon} /> */}
        
        </Box>
      </Card>
    </React.Fragment>
  )
}

export default WebDeployer;
