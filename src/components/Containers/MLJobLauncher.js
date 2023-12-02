import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Button, Card, CardContent, IconButton, Typography, SvgIcon, 
  FormControl, RadioGroup, Radio, FormControlLabel, FormLabel, Dialog,
  DialogContent, DialogTitle
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

const JobSpecSetter = (props) => {
  const user = currentUser();
  const handleFormSubmit = (e) => {
    e.preventDefault();
    props.onClose(false);
  }

  return (
    <React.Fragment>
      <Dialog
        maxWidth="sm" 
        open={props.open}
        onClose={props.onClose} 
      >
        <DialogTitle id="dialog-title"> ML Job 설정하기 </DialogTitle>
        <DialogContent>
          <form onSubmit={handleFormSubmit}>
            <FormControl margin="normal" required fullWidth>
              <FormLabel id="tensorflow-pytorch"> ML Library to select</FormLabel>
              <RadioGroup
                row
                aria-labelledby="tensorflow-pytorch"
                name="library"
              >
                <FormControlLabel value="tensorflow" control={<Radio />} label="Tensorflow" />
                <FormControlLabel value="pytorch" control={<Radio />} label="Pytorch" />
              </RadioGroup>
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                //onClick={props.onClose}
                sx={{ marginTop: 2 }}
                //disabled={!slackState}
              >
                ML Job 설정 완료
              </Button>
            </FormControl>
          </form>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

const MLJobLauncher = (props) => {

  let [status, setStatus] = useState(null);
  let [openSpec, setOpenSpec] = useState(false);
  let [message, setMessage] = useState(null);
  let webWindowRef = useRef(null);

  const user = currentUser();
  const snackbar = useSnackbar();
  const getConfirm = useConfirm();

  useEffect(() => {
    Server.statusJob(user.id).then(r => {
      console.log(r);
      setStatus(r.status);
    })
  }, [user])

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
    Server.statusJob(user.id, true).then(r => {  // needs logs
      let url = `/user/${user.id}/mljob/`
      if(r.status !== 'AVAILABLE') {
        console.log(r.log);
        //webWindowRef.current = window.open(url, `${user.id}_web`);    
      }
      else {
        setMessage(`ML Job log가 발견되지 않았습니다.`)
        setTimeout(() => setMessage(null), 3500);
      }
    })
  }

  const onCloseSpec = () => {
    setOpenSpec(false);
  }

  return (
    <React.Fragment>
      <Card sx={(status !== "AVAILABLE") ? stylesContainer.actingCard : stylesContainer.card}>
        <div style={stylesContainer.progressWrapper}>
          <CardContent sx={stylesContainer.content}>
            <div>
              <Typography sx={{ fontWeight: 700 }} align="center" noWrap>
                ML Job 실행 (Launch) 
                {/*container.displayName*/}
              </Typography>
              <Typography align="center">
                기계학습 작업을 실행합니다.
              </Typography>

            </div>
          </CardContent>
          <Box sx={stylesContainer.controls}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {setOpenSpec(true)}}
              //sx={{ }}
              //disabled={!slackState}
            >
              ML Job 실행하기
            </Button>
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
      <JobSpecSetter open={openSpec} onClose={onCloseSpec} />
    </React.Fragment>
  )
}

export default MLJobLauncher;
