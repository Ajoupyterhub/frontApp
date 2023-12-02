import React, { useState, useEffect, useContext, useRef } from 'react';
import { Grid, Box, Typography } from '@mui/material';
import { currentUser } from '@lib/AppContext';
import UsageInfo from '@components/UsageInfo/UsageInfo';
import ContainerPlayer from './Player';
import MLJobLauncher from './MLJobLauncher';
import Server from '@lib/server';
import Posts from '@components/Posts';

const styles = {
  containerPaper: {
    display: 'flex',
    flexDirection: 'row',
    padding: '8px', // theme.spacing.unit,
    width: '100%',
    height: `calc(100vh - 20px)`,
    justifyContent: 'space-between',
    overflow: 'auto',
    backgroundColor: '#efefef',
  },

  usageInfo : {
    height : `calc(100vh - 20px)`,
  },

  rightPane: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    padding: 1,
  },

  containerRow: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    padding : 1,
  },

  techPosts: {
    padding: 2,
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around',
  },

  images: {
    display: 'flex',
    flexDirection: 'row',
    //flexGrow : 'stretch', 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 3,
  },
};


const Containers = (props) => {
  const user = currentUser();

  let [containers, setContainers] = useState({});
  let [runnings, setRunnings] = useState([]);

  useEffect(() => {
    Server.getContainers(user.id).then(d => {
      setContainers(d);
    });
  }, [user])

  return (
    <div style={styles.containerPaper}>
      <Box sx={styles.rightPane}>
        <Typography variant="h6" sx={{ padding: 1 }}>
            매일 새벽 4시에 모든 컨테이너가 사용 중지 됩니다. 기계학습이 필요한 작업은 미리 알려주기 바랍니다.
        </Typography>
        {Object.keys(containers).length > 0 && 
        <div>
        <Box sx={styles.containerRow}>
            <ContainerPlayer container={containers['datascience']} runningContainers={runnings}
                onStartContainer={kind => setRunnings([...runnings, 'datascience'])}
                onStopContainer={kind => setRunnings(runnings.filter(k => k != 'datascience'))} />
            <ContainerPlayer container={containers['tensorflow']} runningContainers={runnings}
                onStartContainer={kind => setRunnings([...runnings, 'tensorflow'])}
                onStopContainer={kind => setRunnings(runnings.filter(k => k != 'tensorflow'))} />
            <ContainerPlayer container={containers['torch']} runningContainers={runnings}
                onStartContainer={kind => setRunnings([...runnings, 'torch'])}
                onStopContainer={kind => setRunnings(runnings.filter(k => k != 'torch'))} />
        </Box>
        <Box sx={styles.containerRow}>
            <ContainerPlayer container={containers['code']} runningContainers={runnings}
                onStartContainer={kind => setRunnings([...runnings, 'code'])}
                onStopContainer={kind => setRunnings(runnings.filter(k => k != 'code'))} />
            <ContainerPlayer container={containers['mlflow']} runningContainers={runnings}
                onStartContainer={kind => setRunnings([...runnings, 'mlflow'])}
                onStopContainer={kind => setRunnings(runnings.filter(k => k != 'mlflow'))} />
            {/* <MLJobLauncher user={user}/> */}

        </Box>
        </div>}

        <Box sx={styles.techPosts}>
          <Posts title="기술 관련 게시글" tag="기술" width="70%" />

        </Box>
        <Box sx={styles.images}>
          <img src="/static/images/50th_emblem_ver02.png" style={{ width: '70px', objectFit: 'scale-down' }} />
          <img src="/static/images/sw_college_emblem.png" style={{ height: '70px', objectFit: 'scale-down' }} />
        </Box>
      </Box>
      <UsageInfo userID={user.id} /> 
    </div>
  );
}

export default Containers;
