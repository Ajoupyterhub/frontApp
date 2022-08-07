import React from 'react';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Button, Dialog, DialogContent, DialogTitle, DialogContentText, 
  FormControl, FormControlLabel, InputLabel, Input, FormLabel, 
  MenuItem, RadioGroup, Radio,
  Typography, Slider, Select, } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import config from './config';

const styles = theme => ({
  root: {
    margin: theme.spacing(3),
    //height : "100%", //`calc(100vh - $margin)`,
    //maxHeight: "100vh", //`calc(100vh - ${theme.spacing(1)}) px`, // doesn't work
    //width: 500,
    //overflow : 'auto',
  },
});

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


class GroupPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      notebookKind : "jupyter/datascience-notebook",
      classSchedule : '',
      courseID : '',
      courseName : '',
      classID : '',
      dept : '',
      memoryLimit : 2,
    };
  }

  handleChange = name => (event, newValue) => {
    /* if( name == 'expiryDate') {
      let date = new Date(event.target.value);
      this.setState({expiryDate : date});
      return;
    } */
    if (name == 'notebookKind') {
      this.setState({[name] : event.target.value})
    }
    if (name == 'memoryLimit') {
      this.setState({[name] : newValue});
    }
};

  handleGroupPropertiesChange = groupData => {
    /*
    if (projectData.type !== "DELETE_PROJECT")
      this.setState({ projectData });*/
    this.props.onChangeProjectData(groupData);
    return;
  };

  handleUpdateGroupBtn = (e) => {
    e.preventDefault();
    const formdata = new FormData(e.target);
    let context = this.context;
    let {group} = this.props;

    let data = {
      groupID : group && group.groupID || null, 
      classSchedule : formdata.get('classSchedule'),
      courseName : formdata.get('courseName'),
      courseID : formdata.get('courseID'),
      dept : formdata.get('dept'),
      notebookKind : formdata.get('notebookKind'),
      memoryLimit : this.state.memoryLimit,
    }

    this.props.onClose(true)(data);
  }

  valuetext = (value) => {
    return `${value}GB`;
  }

  render() {
    const { classes, group } = this.props;
    return (
      <React.Fragment>
        <CssBaseline />
        <Dialog
          maxWidth="sm" /* {maxWidth} */
          open={this.props.open}
          onClose={this.props.onClose(false)} //(false)} // Tip: this.props.onClose makes this dialog modal
        >
          <DialogTitle id="dialog-title"> {this.props.title} </DialogTitle>
          <DialogContent>
          <DialogContentText>
            {this.props.titleText}
          </DialogContentText>
          <form className={classes.form} onSubmit={this.handleUpdateGroupBtn}> {/* action="/account" method="POST"> */}
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="courseName">교과목 이름 </InputLabel>
              <Input id="courseName" name="courseName" defaultValue={group && group.name}/>
            </FormControl>
            {/* 
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="courseID">과목 코드 </InputLabel>
              <Input id="courseID" name="courseID" />
            </FormControl>
            */}
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="classSchedule">수업 일정 (예: 수금B, 화B금C)</InputLabel>
              <Input id="classSchedule" name="classSchedule" defaultValue={group && group.classSchedule}/>
            </FormControl>

            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="dept">학과</InputLabel>
              <Input id="dept" name="dept" defaultValue={group && group.dept}/>
            </FormControl>

            <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="notebookKind">주피터 노트북</InputLabel>
                <Select defaultValue={this.state.notebookKind}
                  onChange={this.handleChange('notebookKind')}
                  inputProps={{ name: 'notebookKind', id: 'notebookKind' }} >
                  {config.notebook_list.map((n) => { return <MenuItem value={n}> {n}</MenuItem> })}
                </Select>
              </FormControl>

              <Typography id="discrete-slider" gutterBottom>
                Memory Limit (GB)
              </Typography>
              <FormControl margin="normal" required fullWidth>
                <Slider
                  defaultValue={group && group.memoryLimit || 2.5}
                  //value={this.state.memoryLimit}
                  getAriaValueText={this.valuetext}
                  aria-labelledby="discrete-slider"
                  valueLabelDisplay="auto"
                  inputProps = {{name: 'memoryLimit', id: 'memoryLimit'}}
                  step={0.5}
                  marks={marks}
                  min={1}
                  max={4}
                  onChange={this.handleChange('memoryLimit')}
                />
              </FormControl>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              //onClick={this.handleUpdateGroupBtn} // Must remove to get FormData. FormData uses Form submit
            >
              {this.props.group && "그룹 정보 수정" || "그룹 만들기"}
            </Button>
            {/*
            <Typography className={classes.submit} fullWidth centered> 
              공식적인 교과목 개설 Google 인증(OAuth)으로 Ajou Email Address와 이름을 확인합니다.
            </Typography>
            */}
          </form>

          </DialogContent>
        </Dialog>
      </React.Fragment>
    );
  }
}

//GroupPage.contextType = AppContext;

GroupPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GroupPage);

