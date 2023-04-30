import React, {useState, useEffect} from 'react';
import {Box, Slide}  from '@mui/material';
import MemberTable from './MemberTable';
import Fetch from '@lib/fetch';

const styles = {
  root: {
    margin: 1, //theme.spacing(1) /* * 3 */,
  },
  layout: {
    width: 800,//'auto',
    minHeight : 600,
    paddingBottom: '20px',
    marginLeft: 'auto',
    marginRight: 'auto', 
  //overflow : 'scroll',
    
    //display: 'block', // Fix IE11 issue.
    //marginLeft: theme.spacing(1), // * 3,
    //marginRight: theme.spacing(1), // * 3, 
    /*
    [theme.breakpoints.up(400 + theme.spacing(3) * 2)]: {
      width: 800, //'auto',
      marginLeft: 'auto',
      marginRight: 'auto', 
    }, */
  },
  table: {
    marginTop: 2, //theme.spacing(2),
    marginBottom : 1, //theme.spacing(1),
    height : '500px', //'100%',
    overflowY : 'scroll',
  }
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MemberPage = (props) => {
  let [members, setMembers] = useState([]);
  //let [leaders, setLeaders] = useState([]);
  
  const columns = [
      { "displayName" : "회원 id", "key" : "id"},
      { "displayName" : "이름", "key" : "name"},
      { "displayName" : "email", "key" : "email"},
      { "displayName" : "소속", "key" : "dept"},
      { "displayName" : "역할", "key" : "role"},  //이 그룹에서의 역할 표시. A 그룹 학생, B 그룹 조교 가능
      { "displayName" : "  ", "key" : "status"}, //가입상태 보여주기... pending ==> 가입대기중
  ];
  
  
  
  /*
  componentDidUpdate(prevProps) {
    if(prevProps.members != this.props.members) {
   	  this.syncMembers();
    }
  }
  */

  const handleChangeMember = (changeData)  => {
    let members = changeData.members;
    setMembers(changeData.members);
  }

  return (
    <React.Fragment>
      <Box sx={styles.layout}>
            <MemberTable sx={styles.table} members={members} group={props.group} 
	            title={props.title} onClose={props.onClose} /*onChangeMembers = {handleChangeMember}*//>
      </Box>
    </React.Fragment>
  );
}

export default MemberPage;

