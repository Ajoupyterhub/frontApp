import React, { useState, useEffect } from 'react';
import {Box, Paper, Typography} from "@mui/material";

const Banner = ({src, msg, alt}) => {
    let styles = {
        banner : {
            width: "100%",
            height: "27rem",
            objectFit: "cover",
            backgroundImage : `url(${src})`,
            display : 'flex',
            flexDirection : 'column',
            justifyContent : 'space-around',
        },
        msgPaper: {
            position: 'relative',
            margin : 'auto',
            width : '60%',
            height : "10rem",
            backgroundColor : "#efefef",
            opacity : 0.91,
            padding : '2rem',
        }
      };

    

    return (
        <Box style={styles.banner}>
        { msg?.title.length > 0 && 
            <Paper sx={styles.msgPaper}>
                <Typography variant="h5" align="center" gutterBottom >{msg.title}</Typography>
                <Typography variant="h6" align="center" >{msg.msg}</Typography>
            </Paper>
        }
        </Box>
    )
}

export default Banner;