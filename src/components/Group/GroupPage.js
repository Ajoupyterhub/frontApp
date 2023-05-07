import React, {useState} from 'react';
import {
  Button, Dialog, DialogContent, DialogTitle, DialogContentText,
  FormControl, FormControlLabel, InputLabel, Input, FormLabel,
  MenuItem, RadioGroup, Radio,
  Typography, Slider, Select,
} from '@mui/material';
import config from '@lib/config';

const styles = {
  root: {
    margin: 3, //theme.spacing(3),
    padding: 1,
  },
};

const marks = [
  {
    value: 1,
    label: '1GB',
  },
  {
    value: 1.5,
    label: '1.5GB',
  },
  {
    value: 2,
    label: '2GB',
  },
  {
    value: 2.5,
    label: '2.5GB',
  },
  {
    value: 3,
    label: '3GB',
  },
  {
    value: 3.5,
    label: '3.5GB',
  },
  {
    value: 4,
    label: '4GB',
  },
];


const GroupPage = (props) => {
  let [state, setState] = useState({
    kind: "jupyter/datascience-notebook",
    classSchedule: '',
    courseID: '',
    courseName: '',
    classID: '',
    dept: '',
    memoryLimit: 2,
  });

  let {group} = props;

  const handleChange = name => (event, newValue) => {
    /* if( name == 'expiryDate') {
      let date = new Date(event.target.value);
      setState({expiryDate : date});
      return;
    } */
    if (name == 'kind') {
      setState({ ...state, [name]: event.target.value })
    }
    if (name == 'memoryLimit') {
      setState({  ...state, [name]: newValue });
    }
  };

  const handleGroupPropertiesChange = groupData => {
    /*
    if (projectData.type !== "DELETE_PROJECT")
      setState({ projectData });*/
    props.onChangeProjectData(groupData);
    return;
  };

  const handleUpdateGroupBtn = (e) => {
    e.preventDefault();
    const formdata = new FormData(e.target);

    let data = {
      groupID: group && group.groupID || null,
      classSchedule: formdata.get('classSchedule'),
      courseName: formdata.get('courseName'),
      courseID: formdata.get('courseID'),
      dept: formdata.get('dept'),
      kind: formdata.get('kind'),
      memoryLimit: state.memoryLimit,
    }

    props.onClose(true)(data);
  }

  return (
    <React.Fragment>
      <Dialog
        maxWidth="sm" /* {maxWidth} */
        open={props.open}
        onClose={props.onClose(false)} //(false)} // Tip: props.onClose makes this dialog modal
      >
        <DialogTitle id="dialog-title"> {props.title} </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {props.titleText}
          </DialogContentText>
          <form style={{padding: '8px'}} /* className={classes.form}*/ onSubmit={handleUpdateGroupBtn}> {/* action="/account" method="POST"> */}
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="courseName">교과목 이름 </InputLabel>
              <Input id="courseName" name="courseName" defaultValue={(group && group.name)} />
            </FormControl>
            {/* 
            <FormControl margin="normal" required fullwidth>
              <InputLabel htmlFor="courseID">과목 코드 </InputLabel>
              <Input id="courseID" name="courseID" />
            </FormControl>
            */}
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="classSchedule">수업 일정 (예: 수금B, 화B금C)</InputLabel>
              <Input id="classSchedule" name="classSchedule" defaultValue="" /* group && group.classSchedule}*/ />
            </FormControl>

            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="dept">학과</InputLabel>
              <Input id="dept" name="dept" defaultValue="SW학과" /* {group && group.dept}*/ />
            </FormControl>

            {/*
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="kind">주피터 노트북</InputLabel>
              <Select defaultValue={state.kind}
                onChange={handleChange('kind')}
                inputProps={{ name: 'kind', id: 'kind' }} >
                {config.notebook_list.map((n) => { return <MenuItem value={n}> {n}</MenuItem> })}
              </Select>
            </FormControl>
             
            <Typography id="discrete-slider" gutterBottom>
              Memory Limit (GB)
            </Typography>
            <FormControl margin="normal" required fullWidth>
              <Slider
                defaultValue={2.5} 
                //value={state.memoryLimit}
                getAriaValueText={(value) => `${value}GB`}
                aria-labelledby="discrete-slider"
                valueLabelDisplay="auto"
                inputProps={{ name: 'memoryLimit', id: 'memoryLimit' }}
                step={0.5}
                marks={marks}
                min={1}
                max={4}
                onChange={handleChange('memoryLimit')}
              />
            </FormControl> */}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{marginTop: 2}}
              /* className={classes.submit} */
            //onClick={handleUpdateGroupBtn} // Must remove to get FormData. FormData uses Form submit
            >
              { (props.group) ?  "그룹 정보 수정" : "그룹 만들기"}
            </Button>
            {/*
            <Typography className={classes.submit} fullwidth centered> 
              공식적인 교과목 개설 Google 인증(OAuth)으로 Ajou Email Address와 이름을 확인합니다.
            </Typography>
            */}
          </form>

        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}


export default GroupPage;

