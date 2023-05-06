import React, { useState, useEffect, useContext, useRef } from 'react';
import { Grid, Box } from '@mui/material';
import { AppContext } from '@lib/app-context';
import ConfirmDialog from '@components/ConfirmDialog';
import ContainerPlayer from './Player';
import Server from '@lib/server';


const styles = {
  containerPaper: {
    padding: '8px', // theme.spacing.unit,
    width: '100%',
    height: `calc(100vh - 20px)`,
    justifyContent: 'center',
    overflow: 'auto',
  },
};


const Containers = (props) => {
  let context = useContext(AppContext);
  const { user } = context; //props;
  const userId = user.id;

  let [containerList, setContainerList] = useState([]);
  let [runnings, setRunnings] = useState([]);
  let [openConfirmationStop, setConfirmationStop] = useState(false);
  let resolveRef = useRef(() => {});

  useEffect(() => {
    Server.getContainers(user.id).then(d => {
      setContainerList(d);
    });
  }, [user])

  const getConfirm = () => {
    return new Promise((resolve, reject) => {
      setConfirmationStop(true);
      resolveRef.current = resolve;
    })
  }

  const handleConfirmationStop = (boolStop) => (e) => {
    resolveRef.current(boolStop);
    setConfirmationStop(false);
  }

  return (
    <div style={styles.containerPaper}>
      <Box sx={{ width: '100%', height: '200px', backgroundColor: '#4a7ec9' }}></Box>
      <Grid
        container
        direction="row"
        spacing={3}
        alignItems="center"
        justifyContent="center"
      >
        {containerList?.map((con) => (
          <Grid item xs={4} key={`${userId}-${con.notebookName}`} >
            <ContainerPlayer container={con} runningContainers={runnings}
              onStartContainer={kind => setRunnings([...runnings, kind])}
              onStopContainer={kind => setRunnings(runnings.filter(k => k != kind))}
              getConfirm={getConfirm} />
          </Grid>))
        }
      </Grid>
      <ConfirmDialog open={openConfirmationStop}
        handleClose={handleConfirmationStop}
        title="Do you really want to stop the container?"
        message={"Press \"OK\" to stop the container."} />
    </div>
  );
}

export default Containers;
