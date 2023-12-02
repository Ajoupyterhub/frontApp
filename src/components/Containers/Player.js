import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Card, CardContent, CircularProgress, IconButton,
  Typography, SvgIcon, CardActions
} from '@mui/material';
import {
  PlayArrow, Stop, LaptopMacOutlined, LanguageOutlined, FileCopyOutlined, LockOpen, Lock,
} from '@mui/icons-material';
import { green } from '@mui/material/colors';
import { currentUser, useSnackbar, useConfirm } from '@lib/AppContext';
import Server from '@lib/server';
import jupyter_logo from '../../assets/images/jupyter-main-logo.svg';
import Tensorflow_logo from "../../assets/images/Tensorflow_logo.svg";
import VS_Code_logo from "../../assets/images/vscode_1.35_icon.svg";
import MLflow_logo from "../../assets/images/MLflow-Logo.svg";
import pytorch_icon from "../../assets/images/pytorch-svgrepo-com.svg";


const Logo = (kind) => {
  switch (kind) {
    case "datascience":
      return jupyter_logo;
    case "tensorflow":
      return Tensorflow_logo;
    case "code":
      return VS_Code_logo;
    case "mlflow":
      return MLflow_logo;
    case "torch":
      return pytorch_icon;
    default:
      console.log(`wrong kind - ${kind}`)
  }
}

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
    minHeight: 178,
    width: '30%',
    maxWidth: 380,
    minWidth: 230,
    marginRight: 1,
  },
  actingCard: {
    borderRadius: '5px',
    border: '2px solid #4A90E2',
    height: 178,
    width: '30%',
    maxWidth: 380,
    minWidth: 230,
    marginRight: 1,
    //overflowY: 'scroll',
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
    height: '51px',
    //position : 'absolute',
    //bottom : 0,
    //left: 18,
    //zIndex : -100,
    //objectFit: 'contain'
  },
  controls: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 1, //theme.spacing(1),
  },
  playIcon: {
    height: 24,
    width: 24,
  },
};

const ContainerPlayer = (props) => {

  let [status, setStatus] = useState(null);
  let [progress, setProgress] = useState(false);
  let [passcodeVisibility, setVisiblePasscode] = useState(false);
  let [passcode, setPasscode] = useState(null);
  let [linkhash, setLinkhash] = useState(null);
  let [message, setMessage] = useState(null);
  let conWindowRef = useRef(null);
  let webWindowRef = useRef(null);

  let { container } = props;

  const user = currentUser();
  const snackbar = useSnackbar();
  const getConfirm = useConfirm();

  useEffect(() => {
    Server.statusContainer(user.id, container.kind).then(d => {
      setStatus(d.status);
      /* have to set passcode and linkhash */
      setPasscode(d.passcode)
      setLinkhash(d.link_hash)
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

      let urlSuffix = (container.urlPrefix == "/notebook") ? `?token=${passcode}` : '/';
      let url = `${container.urlPrefix}/${user.id}/${container.kind}${urlSuffix}`

      conWindowRef.current = window.open(url, `${user.id}_${container.kind}`);
    })
  }

  const handleWebBtnClick = () => {
    Server.statusWeb(user.id).then(r => {
      let url = `/app/${user.id}/web/`
      if(r.status == 'OK') {
        webWindowRef.current = window.open(url, `${user.id}_web`);    
      }
      else {
        setMessage(`VS-Code에서 web이 작동하지 않습니다.(port: 3000)`)
        setTimeout(() => setMessage(null), 3500);
      }
    })
  }

  const toggleClickVisibility = () => {
    setVisiblePasscode(!passcodeVisibility);
    navigator.clipboard?.writeText(passcode)
    if (!passcodeVisibility) {
      setMessage("Passcode가 클립보드에 Copy 되었습니다.");
      setTimeout(() => setMessage(null), 3500);
    }
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
          <CardContent sx={stylesContainer.content}>
            <div>
              <Typography sx={{ fontWeight: 700 }} align="center" noWrap>
                {container.displayName}
              </Typography>
              <Typography align="center">
                {container.description}
              </Typography>
            </div>
          </CardContent>
          <Box sx={stylesContainer.controls}>
            <IconButton aria-label="play/pause" key = "play-stop"
              onClick={handleContainerBtnClick} >
              {(status !== "running") ?
                <PlayArrow sx={stylesContainer.playIcon} /> :
                <Stop sx={stylesContainer.playIcon} />}
              {progress &&
                (<CircularProgress size={38} sx={stylesContainer.buttonProgress} />)}
            </IconButton>

            <IconButton aria-label="open container or notebook" key="open-window"
              onClick={handleWindowBtnClick} disabled={status !== "running"}>
              <LaptopMacOutlined sx={stylesContainer.playIcon} />
            </IconButton>
            {container.kind == 'code' && 
            <>            
              {status == 'running' && passcode && 
              (passcodeVisibility ?
                <>
                <IconButton onClick={toggleClickVisibility} key="passcode"> 
                    <Lock sx={stylesContainer.playIcon} />
                </IconButton>
                <Typography align='center' variant="body2" >
                  {passcode}
                </Typography>
                </> 
                :
                <IconButton onClick={toggleClickVisibility} key="passcode-visible"> 
                    <LockOpen sx={stylesContainer.playIcon} />
                </IconButton>
                )
              }
            
              <IconButton aria-label="open web window" key="web-open"
                onClick={handleWebBtnClick} disabled={status !== 'running'}>
                <LanguageOutlined sx={stylesContainer.playIcon} />
              </IconButton>
            </>
            }
          </Box>
        </div>
        <Box sx={stylesContainer.controls}>
        {message ?
          <Typography align='center' variant="body2" color="primary" >
            {message}
          </Typography> :
        
          <SvgIcon sx={stylesContainer.containerIcon}
            component={Logo(container.kind)}  inheritViewBox /> 
        }
        </Box>
      </Card>
    </React.Fragment>
  )
}

export default ContainerPlayer;
