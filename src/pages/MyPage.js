import React, { useState, useContext } from 'react';
import {  Tabs, Tab } from '@mui/material'; 
import {  Group, ListAlt } from '@mui/icons-material';
import Containers from '@components/Containers/Containers';
import GroupList from '@components/Group/GroupList';
import { currentUser } from '@lib/AppContext';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
    height: `calc(100vh - 60px)`,
  },

  tabs: {
    height: `calc(100vh - 20px)`,
    border: '1px solid lightgray',
    backgroundColor: '#EFEFEF',
    width: 48,
  },

  tabIcon: {
    padding: 0,
    margin: '0px',
    width: 48,
    minWidth: 36,
    '&:selected': {
      color: '#0000FF',
    },
    '&:hover': {
      color: '#40a9ff',
    },
    '&:focus': {
      color: '#40a9ff',
    },
    /*
    indicator: {
      display: 'flex',
      justifycontent: 'center',
      backgroundColor: 'transparent',
      '& > div': {
        backgroundColor: '#635ee7',
      },
    },  */
  },
};


const MyPage = (props) => {
  let [currentTab, setCurrentTab] = useState(0);
  let user = currentUser();
  //let {currentUser} = useContext(UserContext);

  const handleTabChange = (e, newTab) => {
      setCurrentTab(newTab);
  }

  const canControlGroups = () => {
    return user.primary_role !== "U" ||
      (user.groupsToControl
        && user.groupsToControl.length > 0)
  }

  let classes = styles;

  return (
    <React.Fragment>
      <div style={classes.root} >
        <Tabs sx={classes.tabs}
          orientation="vertical"
          value={currentTab}
          onChange={handleTabChange}
        >
          <Tab sx={styles.tabIcon} label="" icon={<ListAlt />} value={0} />
          <Tab sx={styles.tabIcon} label="" icon={<Group />} value={1}
            disabled={!canControlGroups()} />
        </Tabs>

        {(currentTab) ?  <GroupList /> : <Containers /> }
      </div>
    </React.Fragment>
  );
}

export default MyPage;
