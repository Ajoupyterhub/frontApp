import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import {Button, Table, TableContainer, TablePagination, TableBody, 
  TableCell, TableHead, TableRow, Typography } from '@material-ui/core';

export const CustomTableCell = withStyles(theme => ({
    head: {
      backgroundColor: theme.palette.primary.main, //blue,
      color: theme.palette.common.white,
      fontSize : 16,
      fontWeight : 'bold',
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);

export const CustomTableRow = withStyles(theme => ({
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
  margin : 1,
  padding : 0,
}))( (props) => {
   let {classes} = props;
   return (
      <TableRow hover className={classes.row} {...props}>
	   {props.children}
      </TableRow>
   );
});

/*
  CustomTableCell.propTypes = {
    classes: PropTypes.object.isRequired,
  };
*/
//export CustomTableRow;
//export {CustomTableCell, CustomTableRow};

const useStyles = makeStyles( theme => ({
  layout : {
    minWidth: 800,
    maxWidth: 1200,
    padding: theme.spacing(3),
    marginLeft : 'auto',
    marginRight: 'auto',
  },
  table: {
    minWidth: 800,
    maxWidth: 1200,
    padding: theme.spacing(3),
    marginLeft : 'auto',
    marginRight: 'auto',
    //justifyContent: "center",
  },
  container : {
    maxHeight: 400, //`calc(100vh - 120px)`,
  },
  pagination : {
    //minWidth: 400,
    //maxWidth: 900,
    //padding: theme.spacing(3),
    marginLeft : 'auto',
    //marginRight: 'auto',
    //marginTop : 'auto',
  },

}));


export default function CustomTable(props) { 
  let classes = useStyles(props);
  let [page, setPage] = React.useState(0);
  let [rowsPerPage, setRowsPerPage] = React.useState(10); 

  function handleSettingBtnClick(row) {
    return function () {

    }
  }
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div  className={classes.layout} >
    <TableContainer className={classes.container}>
    <Table stickyHeader size="small"  className={classes.table}>
      <TableHead>
        <TableRow>
          { props.columnNames !== null && props.columns.map( col => (
          <CustomTableCell align="center"> {col.displayName} </CustomTableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {props.data && props.data.map(row => (
          <CustomTableRow key={row.projID}>
            { props.columns !== null && props.columns.map( col => (
              <CustomTableCell align = "center"> 
                <Typography variant="inherit" > {row[col.key]} </Typography> 
              </CustomTableCell>
            ))}
          </CustomTableRow>
        ))}
      </TableBody>
    </Table>
    </TableContainer>
    <TablePagination 
      className = {classes.pagination}
      rowsPerPageOptions={[10, 25, 40]}
      component="div"
      count={props.data && props.data.length || 0}
      rowsPerPage={rowsPerPage}
      page={page}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
    />
    </div>
  )
}


