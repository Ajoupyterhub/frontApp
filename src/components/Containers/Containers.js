import React, { useState, useEffect, useContext, useRef } from 'react';
import { Grid, Box } from '@mui/material';
import { AppContext } from '@lib/app-context';
import UsageInfo from '@components/UsageInfo/UsageInfo';
import ContainerPlayer from './Player';
import Server from '@lib/server';
import Posts from '@components/Posts';


const styles = {
  containerPaper: {
    display : 'flex',
    flexDirection : 'row',
    padding: '8px', // theme.spacing.unit,
    width: '100%',
    height: `calc(100vh - 20px)`,
    justifyContent: 'space-between',
    overflow: 'auto',
    backgroundColor : '#efefef',
  },
  techPosts : {
    padding : 2,
    width: '100%',
//    display : 'flex',
//    justifyContent : 'start',
  },

  images : {
    display : 'flex', 
    flexDirection : 'row', 
    flexGrow : 'stretch', 
    justifyContent : 'center',
    paddingBottom : 7,
  },
};


const Containers = (props) => {
  let context = useContext(AppContext);
  const { user } = context; //props;

  let [containerList, setContainerList] = useState([]);
  let [runnings, setRunnings] = useState([]);

  useEffect(() => {
    Server.getContainers(user.id).then(d => {
      setContainerList(d);
    });
  }, [user])

  return (
    <div style={styles.containerPaper}>
      <UsageInfo userID={user.id} />
      <Grid
        container
        direction="column"
        justifyContent = "space-between"
        //spacing={3}
        sx={{width: '100%', }}>

      <Grid
        container
        direction="row"
        spacing={3}
        //alignItems="center"
        justifyContent="center"
        sx={{padding: 1}}
      >
        {containerList?.map((con) => (
          <Grid item xs={4} key={`${user.id}-${con.kind}`} >
            <ContainerPlayer container={con} runningContainers={runnings}
              onStartContainer={kind => setRunnings([...runnings, kind])}
              onStopContainer={kind => setRunnings(runnings.filter(k => k != kind))}/>
          </Grid>))
        }
      </Grid>
      <Box sx={styles.techPosts}>
        <Posts title="기술 관련 게시글" tag="기술" width="100%"/>
      </Box>
      <Box sx={styles.images}>
        <img src="/static/images/50th_emblem_ver02.png" style={{ width: '150px', objectFit : 'scale-down'}}/>
        <img src="/static/images/sw_college_emblem.png" style={{objectFit : 'scale-down'}}/>
      </Box>
      </Grid>
    </div>
  );
}

export default Containers;
