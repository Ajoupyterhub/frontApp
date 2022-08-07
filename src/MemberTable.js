import React from 'react';
import PropTypes from 'prop-types';
import {Button,  Chip, CssBaseline, Paper, IconButton, AppBar, Toolbar, 
  Table, TableBody, TableCell, TableHead, TableRow, TableContainer, TablePagination,
  Typography, Checkbox, Menu, MenuItem} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import withStyles from '@material-ui/core/styles/withStyles';
import {CustomTableCell, CustomTableRow} from './CustomTable';
import { grey } from '@material-ui/core/colors';
import MoreVertOutlinedIcon from '@material-ui/icons/MoreVertOutlined';
import {PersonAddOutlined,  RemoveCircleOutline, RemoveCircle} from '@material-ui/icons';
import AddMembersDlg from './AddMembersDlg';
import CheckBoxOutlineBlankOutlinedIcon from '@material-ui/icons/CheckBoxOutlineBlankOutlined';
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined';
import ConfirmDialog from './ConfirmDialog';
import Fetch from './fetch';
import config from './config';
import {AppContext} from './app-context';

const styles = theme => ({
  title_paper: {
    backgroundColor: '#EFEFEF',
    display: 'flex',
    width: '100%',
    //height: theme.spacing(5),
    alignItems: 'center',
    padding : theme.spacing(2),
    marginBottom: theme.spacing(1),
    marginTop : theme.spacing(2),
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  table: {
    width: '100%',
    padding : theme.spacing(2),
    marginBottom: 'auto', //theme.spacing(1),
    marginLeft: 'auto',
    marginRight: 'auto',
    //minHeight : 500,
    //height : 500,
    //overflow : 'scroll',
  },
  table_body : {
  //  overflow : 'scroll',
  //  maxHeight : '500px', //`calc(100% - 150px)`,
  },

  icon_in_table : {
    padding : 2,
    paddingTop: 2,
    paddingBottom: 2,
    margin : 0,
    //color : 'white',
  },

  container: {
    height: 490, //`calc(100% - 120px)`,
    //flexGrow : 1,
    //overflow : 'scroll',
  },

  pagination : {
    //marginTop : 'auto',
  },

  appBar: {
    position: 'relative',
    backgroundColor : 'white',
    marginTop : theme.spacing(2),
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
    //color : 'primary',
  },

  invalid_members : {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: theme.spacing(0.5),
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
});

const GreyCheckbox = withStyles({
  root: {
    color: grey[400],
    '&$checked': {
      color: grey[100],
    },
  },
  checked: {},
})(props => <Checkbox color="default" {...props} />);

function EditUserMenu (props) {
  return (
    <div>
      <Menu open={Boolean(props.anchorEl)} onClose={props.onClose} anchorEl={props.anchorEl} keepMounted >
        <MenuItem onClick={props.onSelect("move")}>역할 변경</MenuItem>
        <MenuItem onClick={props.onSelect("delete")}>수강 취소</MenuItem>
      </Menu>
    </div>
  );
}

class MemberTable extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      members: props.members.slice(0),
      invalid_members : [],
      selected: {},  // Access를 빠르게 하기 위해서, Array 대신 Json Key 값으로 접근 하려 함.
      memberDlgOpen: false,
      confirmDlgOpen: false,
      targetUsers : [],
      menuAnchor : null,
      page : 0,
      rowsPerPage : 10,
    };

    this.ownerEmail = '';
  }

  componentDidUpdate(prevProps) {   // Parent Component가 DB 데이터를 모두 불러오고, state를 업데이트 헸을 때, 호출됨.
    if (this.props.members != prevProps.members) {
      let {selected} = this.state;
      this.props.members.map((m) => {
        selected[m.email] = false;
        if(m.role === 'O')
          this.ownerEmail = m.email;
      });
      this.setState({members : this.props.members.slice(0), selected});
    }
  }

  handleCheck = (row) => (e, checked) => {
    let { selected } = this.state;
    if (row) {
      selected[row.email] = e.target.checked;
    }
    else {
      Object.getOwnPropertyNames(selected).forEach(r => { if (r !== this.ownerEmail) selected[r] = e.target.checked })
    }
    this.setState({ selected })
  }

  selectMenu = (menu) => () => {
    console.log(menu, this.state.targetUsers);
    this.setState({menuAnchor : null});//, targetUsers : []});
    if(menu === "delete") {
	    this.deleteUsers(this.state.targetUsers);
	    return;
    } else if (menu == "move") {
      this.changeRole(this.state.targetUsers);
    }
  }

  closeMenu = () => {
    this.setState({menuAnchor : null});
  }

  openMenu = (targetUsers) => (event) => {
    this.setState({menuAnchor : event.currentTarget, targetUsers});
  }

  changeRole = (users) => {
    let failed = [];
    let context = this.context;
    let {members} = this.state;

    if (users.length == 0) //This should never happen
      return;

    let user = users[0];  //We only need the only and first item.

    let idx = members.findIndex(m => m.email == user);
    let m = members[idx];
    if(m.role == 'O') {
      failed.push(user);
    }

    if(failed.length > 0) {
      context.snackbar("error", "역할 변경에 실패했습니다. " + failed.join(', '));
      return;
    }
    let role = (m.role == 'U') ? 'S' : 'U';
    Fetch.changeRole(this.props.groupID, user, role).then(data => {
      if (data.roleChangeFailed && data.roleChangeFailed.length > 0)
        failed.push(...data.roleChangeFailed)
      console.log(failed);
      if(failed.length > 0) {
        if(failed.findIndex((f) => f == user) > -1) {
          context.snackbar("error", "역할 변경에 실패했습니다. " + failed.join(', '));
          return;
        }
      }
      members[idx].role = role; //(m.role == 'U') ? 'A' : 'U';
      this.setState({members});
    })
  }

  deleteUsers = (users) => {

    if(users.length == 0) //Bulk selection에서 check된 것이 없을 때,
      return;
    let { members, selected } = this.state;

    Fetch.deleteMembers(this.props.groupID, users).then(data => {
      members = members.filter(u => { return (!data.deleted.includes(u.email)) });
      data.deleted.forEach(d => { delete selected[d]; });
      this.setState({ members, selected });
    }).finally(() => {
      //console.log(this.state.members);
    });
  }

  deleteCheckedUsers = () => {
    let checkedUsers = Object.getOwnPropertyNames(this.state.selected).filter((k) => {
      return this.state.selected[k]
    });
    this.deleteUsers(checkedUsers);
  }

  displayTableHead = () => {
    const { classes } = this.props;
    return (
      <TableHead>
        <TableRow>
          <CustomTableCell><GreyCheckbox className={classes.icon_in_table} onChange={this.handleCheck(0)} /></CustomTableCell>
          <CustomTableCell align="center"> ID </CustomTableCell>
          <CustomTableCell align="center"> 이름 </CustomTableCell>
          <CustomTableCell align="center"> 이메일 </CustomTableCell>
          <CustomTableCell align="center"> 소속 </CustomTableCell>
          <CustomTableCell align="center"> 사용자 구분 </CustomTableCell>
          <CustomTableCell align="center"> 가입 상태 </CustomTableCell>
          <CustomTableCell align="right"> <Button onClick={this.deleteCheckedUsers} >
            <RemoveCircleOutline className={classes.icon_in_table} color="white"/></Button> </CustomTableCell>
        </TableRow>
      </TableHead>
    );
  }

  displayTableBody = () => {
    const { classes } = this.props;
    let {page, rowsPerPage} = this.state;


    return (
      <TableBody className={classes.table_body}>
        {this.state.members.sort((a, b) => a.name -b.name).slice(page*rowsPerPage, (page+1)*rowsPerPage).map(row => (
          <CustomTableRow /* className={classes.row} */ key={row.id}>
            <CustomTableCell > 
              <Checkbox color="primary" /*size = "small"*/ className={classes.icon_in_table}
            		checkedIcon={<CheckBoxOutlinedIcon size="small" 
			              className={classes.icon_in_table}/>}
                disabled = {row.role === 'O'}
		            icon = {<CheckBoxOutlineBlankOutlinedIcon size="small" 
			          className={classes.incon_in_table}/>}
                onChange={this.handleCheck(row)} checked={this.state.selected[row.email]} value={row.email} /> {/*  이것의 높이를 줄여야 함.*/}
            </CustomTableCell>
            <CustomTableCell component="td" id={row.id}  scope="row" padding="none" align="center">{row.id} </CustomTableCell>
            <CustomTableCell component="td" id={row.id}  scope="row" padding="none" align="center">{row.name} </CustomTableCell>
            <CustomTableCell component="td" id={row.id}  scope="row" padding="none" align="center">{row.email} </CustomTableCell>
            <CustomTableCell component="td" id={row.id}  scope="row" padding="none" align="center">{row.dept} </CustomTableCell>
            <CustomTableCell component="td" id={row.id}  scope="row" padding="none" align="center">{config.roleMapping[row.role]} </CustomTableCell>
            <CustomTableCell component="td" id={row.id}  scope="row" padding="none" align="center">{config.statusMapping[row.status]} </CustomTableCell>
            <CustomTableCell align="right">
              <Button onClick={this.openMenu([row.email])} className={classes.icon_in_table} disabled={row.role === 'O'}>
                <MoreVertOutlinedIcon classNme={classes.icon_in_table} fontSize="small"/></Button>
            </CustomTableCell>
          </CustomTableRow>
        ))}
      </TableBody>
    );
  }

  handleConfirmDlg = (okCancel) => () => {
    this.setState({confirmDlgOpen : false})
  }

  handleAddMember = (open) => (membersAdded, invalid_members) => {
    let { selected } = this.state;

    if (!open && membersAdded) {
      let {members} = this.state;
      let invalid_members = (invalid_members && invalid_members.length > 0) ? invalid_members : [];
      console.log("MemberTable:handleAddMember")
      console.log(membersAdded);
      /*
      if (membersAdded.find((m) => {return mbr.find((i) => i.id === m.id) ? false : true})) {
        mbr.push(m);
        selected[m.id] = false;
      }*/
      
      if(membersAdded.length > 0) {
        membersAdded.map((m) => {
          //if(! members.find(i => i.id === m.id)) { // 중복제거 
            members.push(m);
          //}
	        selected[m.email] = false;
        });
      }
      this.setState({ memberDlgOpen: open, members, selected, invalid_members,
        confirmDlgOpen : ((invalid_members &&invalid_members.length > 0) ? true : false) });
    }
    else {
      this.setState({ memberDlgOpen: open })
    }
  }

  handleChangePage = (event, newPage) => {
    this.setState({page : newPage}); //(newPage);
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({rowsPerPage : event.target.value, page : 0});
  };

  render() {

    const { classes } = this.props;
    return (
      <React.Fragment>
        {/* <CssBaseline /> */}
        <div style={{height : 650, paddingBottom: 20}}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Button onClick={this.handleAddMember(true)}> <PersonAddOutlined /> </Button>
            <Typography align="center" style={{ flexGrow: 1 }} variant="h6" className={classes.title} color='primary'>
              {this.props.title}
            </Typography>
            <IconButton edge="start" color="gray" onClick={this.props.onClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            {/*
            <Button autoFocus color="primary" onClick={this.props.onClose}>
              Close
            </Button> */}
          </Toolbar>
        </AppBar>

        {/* <Paper elevation={0} className={classes.title_paper}>
          <Typography variant="h6" align='center' style={{ flexGrow: 1 }}>
            {this.props.title} </Typography>
        </Paper> */}
        <TableContainer className={classes.container}>
        <Table stickyHeader size="small" className={classes.table}>
          {this.displayTableHead()}
          {this.displayTableBody(this.state.page)}
        </Table>
        </TableContainer>
        <TablePagination
            className = {classes.pagination}
            rowsPerPageOptions={[10, 25, 40]}
            component="div"
            count={this.state.members.length}
            rowsPerPage={this.state.rowsPerPage}
            page={this.state.page}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
          />
        </div>
        <EditUserMenu anchorEl = {this.state.menuAnchor} onClose={this.closeMenu} onSelect={this.selectMenu}/>
        <AddMembersDlg
          open={this.state.memberDlgOpen}
          onClose={this.handleAddMember(false)}
          role={this.props.role}
          groupID={this.props.groupID}
        />
        
        <ConfirmDialog open={this.state.confirmDlgOpen} handleClose = {this.handleConfirmDlg}
          title = "회원 등록 에러" 
          message= "다음 email 주소는 이미 등록했거나, 등록할 수 없는 email입니다. 다시 확인하여 주시기 바랍니다.">
            <Paper component="ul" className = {classes.invalid_members}>
              {
              this.state.invalid_members.map((e) => { return (
              <li key={e}>
              <Chip className = {classes.chip} size="small" label={e} />
              </li>
              )
              }) }
            </Paper>
    
        </ConfirmDialog> 
      </React.Fragment>
    );
  }
}

MemberTable.contextType = AppContext;

MemberTable.propTypes = {
  classes: PropTypes.object.isRequired,
  members: PropTypes.object.usRequired,
  title: PropTypes.object.isRequired,
  role: PropTypes.object.isRequired,
};

export default withStyles(styles)(MemberTable);

