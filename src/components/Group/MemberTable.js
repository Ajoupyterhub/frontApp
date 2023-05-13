import React, { useState, useEffect, useContext } from 'react';
import {
  Button, Chip, Paper, IconButton, AppBar, Toolbar,
  Table, TableBody, TableHead, TableRow, TableContainer, TablePagination,
  Typography, Checkbox, Menu, MenuItem
} from '@mui/material';
import { CustomTableCell, CustomTableRow } from '@components/CustomTable';
import { PersonAddOutlined, Close, MoreVertOutlined, RemoveCircleOutline,
} from '@mui/icons-material';
import AddMembersDlg from '@components/Group/AddMembersDlg';
import ConfirmDialog from '@components/ConfirmDialog';
import Server from '@lib/server';
import config from '@lib/config';
import { useSnackbar } from '@lib/AppContext';

const styles = {
  title_paper: {
    backgroundColor: '#EFEFEF',
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    padding: 2, //theme.spacing(2),
    marginBottom: 1, //theme.spacing(1),
    marginTop: 2, //theme.spacing(2),
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  table: {
    width: '100%',
    padding: 2, //theme.spacing(2),
    marginBottom: 'auto', //theme.spacing(1),
    marginLeft: 'auto',
    marginRight: 'auto',
  },

  icon_in_table: {
    padding: "2px",
    paddingTop: "2px",
    paddingBottom: "2px",
    margin: 0,
    //color : 'white',
  },

  container: {
    height: 490, //`calc(100% - 120px)`,
  },

  appBar: {
    position: 'relative',
    backgroundColor: 'white',
    marginTop: 2, //theme.spacing(2),
  },
  title: {
    marginLeft: 2, //theme.spacing(2),
    flex: 1,
    //color : 'primary',
  },

  invalid_members: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: 0.5, //theme.spacing(0.5),
    margin: 0,
  },
  chip: {
    margin: 0.5, //theme.spacing(0.5),
  },
};

const EditUserMenu = (props) => { 
  return (
    <div>
      <Menu open={props.anchorEl != null} onClose={props.onClose} anchorEl={props.anchorEl} keepMounted >
        <MenuItem onClick={props.onSelect("move")}>역할 변경</MenuItem>
        <MenuItem onClick={props.onSelect("delete")}>수강 취소</MenuItem>
      </Menu>
    </div>
  );
}

const MemberTable = (props) => {
  let [members, setMembers] = useState([]);
  let [state, setState] = useState({
    invalid_members: [],
    selected: {},
    checkAll: false,
    memberDlgOpen: false,
    confirmDlgOpen: false,
    targetUsers: [],
    menuAnchor: null,
    page: 0,
    rowsPerPage: 10,
  });

  let snackbar = useSnackbar();

  const syncMembers = () => {
    Server.getMembersByGroupID(props.group.groupID).then((d) => {
      setMembers([...d["data"]]);
    });
  }

  useEffect(syncMembers, [])


  const handleCheck = (row) => (e, checked) => {
    let { selected, checkAll } = state;

    if (row) {
      selected[row.email] = e.target.checked;
    } else {
      members.forEach(m => {
        if (m.role != 'O') {
          selected[m.email] = e.target.checked;
        }
      })
      if (e.target.checked) {
        checkAll = true;
      } else {
        checkAll = false;
      }
    }
    setState({ ...state, selected: { ...selected }, checkAll })
  }

  const numSelected = () => {
    return Object.keys(state.selected).filter(c => state.selected[c]).length
  }

  const selectMenu = (menu) => (e) => {
    if (menu === "delete") {
      deleteUsers(state.targetUsers); // menu will be closed inside this function call.
      return;
    } else if (menu == "move") {
      changeRole(state.targetUsers);
      setState({ ...state, menuAnchor: null });//, targetUsers : []});
    }
  }

  const closeMenu = () => {
    setState({ ...state, menuAnchor: null });
  }

  const openMenu = (targetUsers) => (event) => {
    setState({ ...state, menuAnchor: event.currentTarget, targetUsers });
  }

  const changeRole = (users) => {
    let failed = [];

    if (users.length == 0) //This should never happen
      return;

    let user = users[0];  //We only need the only and first item.

    let idx = members.findIndex(m => m.email == user);
    let m = members[idx];
    if (m.role == 'O') {
      failed.push(user);
    }

    if (failed.length > 0) {
      snackbar("error", "역할 변경에 실패했습니다. " + failed.join(', '));
      return;
    }
    let role = (m.role == 'U') ? 'S' : 'U';
    Server.changeRole(props.group.groupID, user, role).then(data => {
      if (data.roleChangeFailed && data.roleChangeFailed.length > 0)
        failed.push(...data.roleChangeFailed)
      console.log(failed);
      if (failed.length > 0) {
        if (failed.findIndex((f) => f == user) > -1) {
          snackbar("error", "역할 변경에 실패했습니다. " + failed.join(', '));
          return;
        }
      }
      members[idx].role = role; //(m.role == 'U') ? 'A' : 'U';
      setMembers([...members]);
      closeMenu();
    })
  }

  const deleteUsers = (users) => { // "수강취소" 에 대한 Confirm 추가 필요.

    if (users.length == 0) //Bulk selection에서 check된 것이 없을 때,
      return;
    let { selected } = state;

    Server.deleteMembers(props.group.groupID, users).then(data => {
      members = members.filter(u => { return (!data.deleted.includes(u.email)) });
      data.deleted?.forEach(d => { selected[d] = false; });
      setState({ ...state, selected: { ...selected }, menuAnchor : null });
      setMembers([...members]);
    }).finally(() => {
      //console.log(state.members);
    });
  }

  const deleteCheckedUsers = () => {
    let checkedUsers = Object.getOwnPropertyNames(state.selected).filter((k) => {
      return state.selected[k]
    });
    console.log('Checked Users: ', checkedUsers);
    deleteUsers(checkedUsers);
  }
  /*  column 설명 
  const columns = [
    { "displayName" : "회원 id", "key" : "id"},
    { "displayName" : "이름", "key" : "name"},
    { "displayName" : "email", "key" : "email"},
    { "displayName" : "소속", "key" : "dept"},
    { "displayName" : "역할", "key" : "role"},  //이 그룹에서의 역할 표시. A 그룹 학생, B 그룹 조교 가능
    { "displayName" : "  ", "key" : "status"}, //가입상태 보여주기... pending ==> 가입대기중
  ];
  */

  const displayTableHead = () => {
    return (
      <TableHead>
        <TableRow>
          <CustomTableCell>
            <Checkbox sx={styles.icon_in_table} onChange={handleCheck(0)}
              checked={state.checkAll} value={state.checkAll} color="default"
              indeterminate={numSelected() > 0 && numSelected() < members.length - 1} />
          </CustomTableCell>
          <CustomTableCell align="center"> ID </CustomTableCell>
          <CustomTableCell align="center"> 이름 </CustomTableCell>
          <CustomTableCell align="center"> 이메일 </CustomTableCell>
          <CustomTableCell align="center"> 소속 </CustomTableCell>
          <CustomTableCell align="center"> 사용자 구분 </CustomTableCell>
          <CustomTableCell align="center"> 가입 상태 </CustomTableCell>
          <CustomTableCell align="right">
            <IconButton onClick={deleteCheckedUsers} >
              <RemoveCircleOutline sx={styles.icon_in_table} color="default" />
            </IconButton>
          </CustomTableCell>
        </TableRow>
      </TableHead>
    );
  }

  const displayTableBody = () => {
    let { page, rowsPerPage } = state;

    return (
      <TableBody sx={styles.table_body}>
        {members.sort((a, b) => a.name - b.name).slice(page * rowsPerPage, (page + 1) * rowsPerPage).map(row => (
          <CustomTableRow /* sx={styles.row} */ key={row.id}>
            <CustomTableCell >
              <Checkbox color="primary" size="small" sx={styles.icon_in_table}
                disabled={row.role === 'O'}
                onChange={handleCheck(row)}
                checked={(state.selected[row.email]) ? true : false}
                /* true : false가 없으면, controlled or uncontrolled warning */
                value={(state.selected[row.email]) ? true : false}
              />
            </CustomTableCell>
            <CustomTableCell component="td" id={row.id} scope="row" padding="none" align="center">{row.id} </CustomTableCell>
            <CustomTableCell component="td" id={row.id} scope="row" padding="none" align="center">{row.name} </CustomTableCell>
            <CustomTableCell component="td" id={row.id} scope="row" padding="none" align="center">{row.email} </CustomTableCell>
            <CustomTableCell component="td" id={row.id} scope="row" padding="none" align="center">{row.dept} </CustomTableCell>
            <CustomTableCell component="td" id={row.id} scope="row" padding="none" align="center">{config.roleMapping[row.role]} </CustomTableCell>
            <CustomTableCell component="td" id={row.id} scope="row" padding="none" align="center">{config.statusMapping[row.status]} </CustomTableCell>
            <CustomTableCell align="right">
              <IconButton onClick={openMenu([row.email])} sx={styles.icon_in_table} disabled={row.role === 'O'}>
                <MoreVertOutlined sx={styles.icon_in_table} fontSize="small" />
              </IconButton>
            </CustomTableCell>
          </CustomTableRow>
        ))}
      </TableBody>
    );
  }

  const handleConfirmDlg = (okCancel) => () => {
    setState({ ...state, confirmDlgOpen: false })
  }

  const handleAddMember = (open) => (membersAdded, invalid_members) => {
    let { selected } = state;

    if (!open && membersAdded.length) {
      let invalid_members = (invalid_members && invalid_members.length > 0) ? invalid_members : [];
      console.log("MemberTable:handleAddMember")
      console.log(membersAdded);
      /*
      if (membersAdded.find((m) => {return mbr.find((i) => i.id === m.id) ? false : true})) {
        mbr.push(m);
        selected[m.id] = false;
      }*/

      membersAdded.map((m) => {
        //if(! members.find(i => i.id === m.id)) { // 중복제거 
        members.push(m);
        //}
        selected[m.email] = false;
      });
      setState({
        ...state, memberDlgOpen: open, selected : {...selected}, invalid_members,
        confirmDlgOpen: ((invalid_members && invalid_members.length > 0) ? true : false)
      });
      setMembers([...members]);
    }
    else {
      setState({ ...state, memberDlgOpen: open })
    }
  }

  const handleChangePage = (event, newPage) => {
    setState({ ...state, page: newPage }); //(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setState({ ...state, rowsPerPage: event.target.value, page: 0 });
  };

  return (
    <React.Fragment>
      {/* <CssBaseline /> */}
      <div style={{ height: 650, paddingBottom: 20 }}>
        <AppBar sx={styles.appBar}>
          <Toolbar>
            <Button onClick={handleAddMember(true)}> <PersonAddOutlined /> </Button>
            <Typography align="center" style={{ flexGrow: 1 }} variant="h6" sx={styles.title} color='primary'>
              {props.title}
            </Typography>
            <IconButton edge="start" color="gray" onClick={props.onClose} aria-label="close">
              <Close />
            </IconButton>
            {/*
            <Button autoFocus color="primary" onClick={props.onClose}>
              Close
            </Button> */}
          </Toolbar>
        </AppBar>

        {/* <Paper elevation={0} sx={styles.title_paper}>
          <Typography variant="h6" align='center' style={{ flexGrow: 1 }}>
            {props.title} </Typography>
        </Paper> */}
        <TableContainer sx={styles.container}>
          <Table stickyHeader size="small" sx={styles.table}>
            {displayTableHead()}
            {displayTableBody(state.page)}
          </Table>
        </TableContainer>
        <TablePagination
          sx={styles.pagination}
          rowsPerPageOptions={[10, 25, 40]}
          component="div"
          count={members.length}
          rowsPerPage={state.rowsPerPage}
          page={state.page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
      <EditUserMenu anchorEl={state.menuAnchor} onClose={closeMenu} onSelect={selectMenu} />
      <AddMembersDlg
        open={state.memberDlgOpen}
        onClose={handleAddMember(false)}
        role={props.role}
        groupID={props.group.groupID}
      />

      <ConfirmDialog open={state.confirmDlgOpen} handleClose={handleConfirmDlg}
        title="회원 등록 에러"
        message="다음 email 주소는 이미 등록했거나, 등록할 수 없는 email입니다. 다시 확인하여 주시기 바랍니다.">
        <Paper component="ul" sx={styles.invalid_members}>
          {
            state.invalid_members.map((e) => {
              return (
                <li key={e}>
                  <Chip sx={styles.chip} size="small" label={e} />
                </li>
              )
            })}
        </Paper>

      </ConfirmDialog>
    </React.Fragment>
  );
}

export default MemberTable;
