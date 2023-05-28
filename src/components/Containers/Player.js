import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CircularProgress, IconButton, Typography } from '@mui/material';
import {
  PlayArrow, Stop, LaptopMacOutlined, FileCopyOutlined,
  VisibilityOffOutlined, VisibilityOutlined
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
    height: 175,
    //maxWidth: 380,
    minWidth: 250,
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

const ContainerPlayer = (props) => {

  let [status, setStatus] = useState(null);
  let [progress, setProgress] = useState(false);
  let [passcodeVisibility, setVisiblePasscode] = useState(false);
  let [passcode, setPasscode] = useState(null);
  let [linkhash, setLinkhash] = useState(null);
  let conWindowRef = useRef(null); 

  let { container } = props;

  const user = currentUser();
  const snackbar = useSnackbar();
  const getConfirm = useConfirm();

  useEffect(() => {
    Server.statusContainer(user.id, container.kind).then(d => {
      setStatus(d.status);
    })
  }, [props.runningContainers])

  const handleContainerBtnClick = () => {
    if (status === "running") {
      getConfirm("이 서비스를 중지하겠습니까?", "\"OK\"를 누르면 컨테이너가 중지됩니다.")
        .then(d => {
          if (d) {
            stopContainer()
          }
        })
      return;
    }
    if (status === null) {
      if (props.runningContainers.length > 1) {
        snackbar(
          'warning',
          '동시에 최대 2개 프로젝트를 구동할 수 있습니다. 덜 필요한 프로젝트를 중지하고, 다시 시도하세요.',
        );
        return;
      }

      setProgress(true);

      Server.startContainer(user.id, container.kind).then(d => {
        /* !!!!  WARNING  !!!! 
          When launcing docker contanier on the same network  with https protocol, 
          Chrome(ubuntu version-currently figured out) emit ERR_NETWORK_CHANGED Exception.
          The following code never be exceuted.*/

        if (d.status != "OK") {
          snackbar("error", "컨테이너를 실행할 수 없습니다.");
          return;
        }
        else {
          setStatus("running");
          setPasscode(d.passcode);
          setLinkhash(d.link_hash);
          props.onStartContainer(container.kind)
        }
      }).catch((e) => {
        snackbar("error", "시스템 자원이 부족합니다. Container not Available.");
        return;
      }).finally(() => {
        setProgress(false)
      });
    }
  }

  const handleWindowBtnClick = () => {
    Server.statusContainer(user.id, container.kind).then(d => {
      if (d.status != 'running') {
        snackbar('warning', '컨테이너가 준비되지 않았습니다. 다시 시작하세요. (30분 이상 방치 자동종료)');
        setStatus(null);
        return;
      }
      let urlSuffix = (container.kind == 'code') ? '' : `?token=${passcode}`

      let url = (container.kind == 'code') ?
        `/code/${user.id}/${linkhash}/` :
        `/notebook/${user.id}/${container.kind}${urlSuffix}`;

      conWindowRef.current = window.open(url, `${user.id}_${container.kind}`);
    })
  }

  const toggleClickVisibility = () => {
    setVisiblePasscode(!passcodeVisibility);
  }

  const stopContainer = () => {
    if (conWindowRef.current) {
      conWindowRef.current.close();
      conWindowRef.current = null;
    }

    setProgress(true);

    Server.stopContainer(user.id, container.kind).then(d => {
      /* !!!!  WARNING  !!!! 
      When launcing docker contanier on the same network with https protocol, 
      Chrome(ubuntu version-currently figured out) emit ERR_NETWORK_CHANGED Exception.
      The following code never be exceuted.*/
      if (d.status != 'OK') {
        snackbar("error", "Request Failed. The container has not been stopped.")
        return;
      }
    }).finally(() => {
      setProgress(false);
      setStatus(null);
      setPasscode(null);
      setVisiblePasscode(false);
      props.onStopContainer(container.kind)
    });
  }

  return (
    <React.Fragment>
      <Card sx={(status === "running") ? stylesContainer.actingCard : stylesContainer.card}>
        <div style={stylesContainer.progressWrapper}>
          <CardContent>
            <Typography align="center" noWrap>
              {container.displayName}
            </Typography>
            <Typography align="center" noWrap>
              {container.description}
            </Typography>
          </CardContent>
          <div style={stylesContainer.controls}>
            <IconButton aria-label="play/pause"
              onClick={handleContainerBtnClick} >
              {(status !== "running") ?
                <PlayArrow sx={stylesContainer.playIcon} /> :
                <Stop sx={stylesContainer.playIcon} />}
              {progress &&
                (<CircularProgress size={38} sx={stylesContainer.buttonProgress} />)}
            </IconButton>

            <IconButton aria-label="open container or notebook"
              onClick={handleWindowBtnClick} disabled={status !== "running"}>
              <LaptopMacOutlined sx={stylesContainer.playIcon} />
            </IconButton>
          </div>
          {status === "running" &&
            <div style={stylesContainer.controls}>
              <Typography align='center' variant="body2" style={{ paddingRight: 8 }} >
                Passcode: {(passcodeVisibility) ? passcode : "*******"}</Typography>
              <IconButton aria-label="copy the passcode to open jupyter notebook"
                onClick={() => { navigator.clipboard.writeText(passcode) }} size="small">
                <FileCopyOutlined sx={stylesContainer.playIcon} />
              </IconButton>
              <IconButton onClick={toggleClickVisibility}>
                {(passcodeVisibility) ?
                  <VisibilityOffOutlined sx={stylesContainer.playIcon} /> :
                  <VisibilityOutlined sx={stylesContainer.playIcon} />
                }
              </IconButton>
            </div>
          }
        </div>
      </Card>
    </React.Fragment>
  )
}

export default ContainerPlayer;
