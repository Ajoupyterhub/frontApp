import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import {styled} from '@mui/material/styles';
import {Button, Box, Table, TableContainer, TablePagination, TableBody, 
  TableCell, TableHead, TableRow, Typography } from '@mui/material';
import {tableCellClasses} from '@mui/material/TableCell';

export const CustomTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export const CustomTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  //'&:last-child td, &:last-child th': {
  //  border: 0,
  //},
}));

const classes = {
  layout : {
    minWidth: 800,
    maxWidth: 1200,
    padding: 3, //theme.spacing(3),
    marginLeft : 'auto',
    marginRight: 'auto',
  },
  table: {
    minWidth: 800,
    maxWidth: 1200,
    padding: 3, //theme.spacing(3),
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
};


export default function CustomTable(props) { 
  //let classes = useStyles(props);
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
    <Box  sx={classes.layout} >
    <TableContainer sx={classes.container}>
    <Table stickyHeader size="small"  sx={classes.table}>
      <TableHead>
        <TableRow>
          { props.columnNames !== null && props.columns.map( col => (
          <CustomTableCell align="center" key={`table-head-${col.key}`}> {col.displayName} </CustomTableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {props.data && props.data.map( (row, index) => (
          <CustomTableRow key={`table-row-${index}`}>
            { props.columns !== null && props.columns.map( col => (
              <CustomTableCell align = "center" key={`table-row-${index}-${col.key}`}> 
                <Typography variant="inherit" > {row[col.key]} </Typography> 
              </CustomTableCell>
            ))}
          </CustomTableRow>
        ))}
      </TableBody>
    </Table>
    </TableContainer>
    <TablePagination 
      sx = {classes.pagination}
      rowsPerPageOptions={[10, 25, 40]}
      component="div"
      count={props.data && props.data.length || 0}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
    </Box>
  )
}


