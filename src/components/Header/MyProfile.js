import React, {useRef, useState} from 'react';
import { Avatar, Typography, Box, Popover, Button, IconButton, snackbarClasses } from '@mui/material';
import { HelpOutlined } from '@mui/icons-material';
import { useConfirm, useSnackbar } from '@lib/AppContext';

const style = {

  profileBox: {
    maxWidth: 350,
    minHeight: 175,
    margin: 1,  //theme.spacing(1),
    padding: 1, //theme.spacing(1),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  myprofile: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: 250,
    margin: 2, //theme.spacing(1),
    //overflow : 'auto',
  },

  button : {
    margin : 1,
    width : '70%',
  }
}

const MyProfile = (props) => {
  const { user } = props;
  const inputRef = useRef(null);
  const getConfirm = useConfirm();
  const snackbar = useSnackbar();
  //const [keyFile, setKeyFile] = useState(null);
  
  const handleFileChange = (e) => {
    if (!e.target.files) {
      console.log("잘못된 파일이거나, 파일 선택을 취소하였습니다.")
      snackbar("warning", "잘못된 파일이거나, 파일 선택을 취소하였습니다.")
      props.onClose();
      return;
    }

    if (e.target.files.length == 0) {
      console.log("잘못된 파일이거나, 파일 선택을 취소하였습니다.")
      snackbar("warning", "잘못된 파일이거나, 파일 선택을 취소하였습니다.")
      props.onClose();
      return;
    }

    let filename = e.target.files[0].name;
    console.log(`${filename} selected`);
    if( !filename.endsWith(".pub")) {
      console.log("잘못된 파일입니다.")
      snackbar("warning", "잘못된 파일입니다.")
      props.onClose();
      return;
    }

    const data = new FormData();
    data.append('ssh-key', e.target.files[0])

    fetch(`/user/${user.id}/auth/ssh-key`, {
      method : 'POST',
      body : data,
    }).then(r => r.json()).then((d) => {
      if(d.msg == "OK") {
        console.log("성공");
        snackbar("success", "SSH Key가 성공적으로 등록되었습니다.")
      } else {
        console.log("실패: "+ d.msg);
        snackbar("error", "SSH Key 등록이 실패했습니다. 에러 내용: "+d.msg)
      }
      }).catch((e) => {
        console.log("실패: " + e)
        snackbar("error", "심각한 오류입니다. SSH Key 등록이 실패했습니다. 관리자에게 알려주세요.")
      }).finally(() => {
        props.onClose();
      });
  }

  const handleInitialize = (e) => {
    getConfirm("SSH Key 초기화", 
      "지금까지 저장한 모든 SSH Key가 삭제되고, 필요한 Key만 설정됩니다. \
      \n 계속 진행할까요?").then((d) =>{
        if(d) {
          fetch(`/user/${user.id}/auth/ssh-key`, {
            method : 'PUT',
          }).then(r => r.json()).then(d => {
            console.log("SSH Key 초기화");
            snackbar("warning", "SSH Key가 초기화 되었습니다.")
          })
          return;
        }
        return
      }).finally(() => {
        props.onClose();
      })
  }

  return (
    <React.Fragment>
      <Popover sx={style.profileBox}
        open={props.open}
        onClose={props.onClose}
        anchorEl={props.anchor}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={style.myprofile} >
          <Avatar src={user && (user.picture || user.imageUrl)} alt="your profile" />
          <Typography align="center" variant="body1"> {user && user.name} </Typography>
          <Typography align="center" variant="body1" > {user && user.email} </Typography>
          <Typography align="center" variant="body1"> {user && user.dept} </Typography>
        </Box>
        <Box sx={style.myprofile} >
          <Typography align="center" variant="body2"> VS Code로 원격 접속하기 위한 SSH Key를 등록합니다. </Typography>
          <IconButton title="자세히 알려주세요">
            <HelpOutlined size="sm"/>
          </IconButton>
          {/* <Typography align="center" variant="body2"> 자세히 알려주세요. </Typography> */}
          {/* MUI style : Button의 component="label" 설정으로 onClick 이벤트가 <input/>으로 전달됨*/}
          <Button sx={style.button} component="label" variant="outlined"> 
             SSH Key 등록하기 
            <input hidden type="file" name="ssh-key" accept=".pub" onChange={handleFileChange}/>
          </Button>
          <Button sx={style.button} onClick={handleInitialize} variant="outlined" color="error" >
            SSH Key 초기화
          </Button>
          {/* ref를 사용하는 일반적인 방법 */}
          {/*
          <Button onClick={() => {inputRef.current?.click()}}> 
             SSH Key 등록하기 
          </Button>
          <input type="file" ref={inputRef} onChange={handleFileChange} style={{display : 'none'}}/>
          */}
        </Box>
      </Popover>
    </React.Fragment>
  );
}

export default MyProfile;