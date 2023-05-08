import React, { useContext } from 'react';
import { Box, Chip, Paper, Typography } from '@mui/material';
import {Chart} from 'react-google-charts';
import { styled } from '@mui/material/styles';
import {AppContext} from '@lib/app-context';

const styles = {
  root: {
    width: '300px',
    height: '100%',
    backgroundColor: '#4a7ec9',
    display: 'flex',
    flexDirection: 'column',
    alignItems : 'stretch',
    marginTop: 1,
    marginBottom : 1,
  },

  accessLog: {
    width: '100%',
    //maxWidth: '350px',
    backgroundColor: '#fffde7',
    padding: 1,
    alignItems: 'center',
  },

  usage: {
    //width: '69%',
    flexGrow : 1,
    backgroundColor: '#e1f5fe',
    padding: 1,
  },

  chart : {
    padding : 0,
    margin : 0,
    backgroundColor : 'inherit',
  },

}

const Heading = styled(Typography)({
  fontWeight: 700,
})

const Text = styled(Typography)({
  color: 'black',
});

const LogItem = styled(Box)({
  display : 'flex',
  justifyContent : 'space-between',
  margin: '8px',
})

const colorMap = {
  code : 'primary', //'#3366CC', //Google Blue
  datascience : 'error', //'#DC3912', //Google Red
  tensorflow : 'warning', //'#FF9900',  //Google Yellow, Green #109618
}

const AccessLog = (props) => {
  let {user} = useContext(AppContext);

  const datetimeTotext = (datetime) => {
    let date = new Date(datetime);
    let time = `${date.getHours()}시 ${date.getMinutes()}분 ${date.getSeconds()}초`
    return `${date.getFullYear()}년 ${date.getMonth()+1}월 ${date.getDate()}일 ${time}`;
  }

  return (
    <React.Fragment>
      <Box sx={styles.accessLog}>
        <Heading variant='h5' color='black' gutterBottom>최근 사용</Heading>
        {user?.accessLogs.map(l => {
          return (
            <LogItem key={l.datetime}>
            <Text variant='subtime1' color='black' noWrap title={datetimeTotext(l.datetime)}> 
              {datetimeTotext(l.datetime)}</Text>
            <Chip label ={l.container} color={colorMap[l.container]} />
            </LogItem>
          )
        })
        }
      </Box>
    </React.Fragment>
  )
}

const Usage = (props) => {
  let context = useContext(AppContext);

  const options = {
    title: "", //컨테이너 사용현황",
    backgroundColor : "#e1f5fe",
    chartArea: {'width': '100%', 'height': '80%'},
    pieHole: 0.4,
    is3D: false,
  };

  return (
    <React.Fragment>
      <Box sx={styles.usage}>
        <Heading variant='h5' color='black'> 컨테이너 사용 현황</Heading>
        <Chart 
            chartType="PieChart"
            data={context.user.usageStat}
            options={options}
            style = {styles.chart}
            />
        <Heading variant='h5' color='black'> 전체 사용자 현황</Heading>
        <Chart 
            chartType="PieChart"
            data={context.allUsage}
            options={options}
            style = {styles.chart}
            />
      </Box>
    </React.Fragment>

  )
}


const UsageInfo = (props) => {
  return (
    <Paper sx={styles.root}>
      <AccessLog userID={props.userID} sx={styles.accessLog} />
      <Usage userID={props.userID} sx={styles.usage} />
    </Paper>
  )
}

export default UsageInfo;