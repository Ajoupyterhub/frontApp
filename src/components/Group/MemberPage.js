import React, {useState} from 'react';
import {Box, Slide}  from '@mui/material';
import MemberTable from './MemberTable';

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
  
  return (
    <React.Fragment>
      <Box sx={styles.layout}>
            <MemberTable sx={styles.table} group={props.group} 
	            title={props.title} onClose={props.onClose}/>
      </Box>
    </React.Fragment>
  );
}

export default MemberPage;

