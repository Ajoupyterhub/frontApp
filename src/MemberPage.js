import React from 'react';
import PropTypes from 'prop-types';
import {CssBaseline, withStyles, Dialog, Button, IconButton, AppBar, 
  Toolbar, Typography, Slide}  from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
//import withStyles from '@material-ui/core/styles/withStyles';
import MemberTable from './MemberTable';
import Fetch from './fetch';
import CustomTable from './CustomTable';

const styles = theme => ({
  root: {
    margin: theme.spacing(1) /* * 3 */,
  },
  layout: {
    width: 800,//'auto',
    minHeight : 600,
    paddingBottom: 20,
    //overflow : 'scroll',
    
    //display: 'block', // Fix IE11 issue.
    //marginLeft: theme.spacing(1), // * 3,
    //marginRight: theme.spacing(1), // * 3, 
    
    [theme.breakpoints.up(400 + theme.spacing(3) * 2)]: {
      width: 800, //'auto',
      marginLeft: 'auto',
      marginRight: 'auto', 
    }, 
  },
  table: {
    marginTop: theme.spacing(2),
    marginBottom : theme.spacing(1),
    height : '500px', //'100%',
    overflowY : 'scroll',
  }
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class MemberPage extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      members: [],
      leaders: [],
    };

    this.columns = [
      { "displayName" : "회원 id", "key" : "id"},
      { "displayName" : "이름", "key" : "name"},
      { "displayName" : "email", "key" : "email"},
      { "displayName" : "소속", "key" : "dept"},
      { "displayName" : "역할", "key" : "role"},  //이 그룹에서의 역할 표시. A 그룹 학생, B 그룹 조교 가능
      { "displayName" : "  ", "key" : "status"}, //가입상태 보여주기... pending ==> 가입대기중
    ];
  }

  componentDidMount() {
    this.syncMembers();
  }
  
  
  syncMembers = () => {
    Fetch.getMembersByGroupID(this.props.groupID).then((d) => {
      this.setState({members : d["data"]});
    });
  }

  componentDidUpdate(prevProps) {
    if(prevProps.members != this.props.members) {
   	  this.syncMembers();
    }
  }

  handleChangeMember = (changeData)  => {
    let members = changeData.members;
    this.setState({members});
  }

  render() {

    const { classes } = this.props;
    return (
      <React.Fragment>
        <CssBaseline />
        <div className={classes.layout}>
              <MemberTable className={classes.table} members={this.state.members} groupID={this.props.groupID} 
	              title={this.props.title} onClose={this.props.onClose} /*onChangeMembers = {handleChangeMember}*//>
        </div>
      </React.Fragment>
    );
  }
}

MemberPage.propTypes = {
  classes: PropTypes.object.isRequired,
  groupID: PropTypes.object.isRequired,
  members: PropTypes.object.isRequired,
};

export default withStyles(styles)(MemberPage);

