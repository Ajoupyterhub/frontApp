import React, { useState, useEffect } from 'react';
import { Box, Paper, Button, Menu, MenuItem, IconButton } from '@mui/material';
import { MoreVertOutlined, AddCircleOutline } from '@mui/icons-material';
import { currentUser, useSnackbar } from '@lib/AppContext';
import GroupPage from '@components/Group/GroupPage';
import MemberPage from '@components/Group/MemberPage';
import CustomTable from '@components/CustomTable';
import Server from '@lib/server';

const styles = {
  root: {
    width: '100%', //`calc(100% - ${theme.spacing.unit})`,
    height: `calc(100vh - 20px)`,
    marginLeft: 'auto',
    marginRight: 'auto',
  },

  paper: {
    //margin: theme.spacing(1),
    width: '100%', //`calc(100% - ${theme.spacing(1)})`,
    //justifyContent : 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    minHeight: 650,
    //alignItems : 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    //overflow : 'auto',
    //flexShrink: 0,
    //backgroundColor : yellow[100],
  },

  grpAddBtn: {
    minWidth: 400,
    maxWidth: 900,
    minHeight: 60,
    marginLeft: 'auto',
    marginRight: 'auto',
  },

  table: {
    minWidth: 700,
    maxWidth: 900,
    minHeight: 590,
    padding: 1, //theme.spacing(1),
    marginLeft: 'auto',
    marginRight: 'auto',
  },

  button: {
    minWidth: 120,
  },

};

const GroupList = (props) => {
  let [state, setState] = useState({
    userID: props.userID,
    currentGroupID: 0,
    currentGroup: null,
    groupList: [],
    elMoreActions: null,
    openMoreActions: false,
    bShowGroupList: true,
    bShowMemberList: false,
    bOpenGroupPage: false,
    groupPageTitle: "Add a New Group",
    groupPageTitleText: "새로운 그룹(클래스)를 만듭니다.",
  });

  let [groupList, setGroupList] = useState([]);

  const groupListColumns = [
    { displayName: "교과목", key: "name" },
    { displayName: "수업시간", key: "classSchedule" },
    { displayName: "컨테이너 종류", key: "kind" },
    { displayName: "담당교수", key: "ownerName" },
    { displayName: "더보기", key: "menu" },
  ]
  let user = currentUser();
  let snackbar = useSnackbar();


  const handleMoreBtnClick = (btnId) => () => {
    console.log(btnId + ' Clicked')
    setState({ ...state, bOpenGroupPage: false, openMoreActions: true, elMoreActions: document.getElementById(btnId) });
  }

  const handleCloseMoreActions = (action) => (e) => {
    let grpId = state.elMoreActions.id.split('-')[2];
    let currentGroup = (groupList) ? groupList.find((g) => g.groupID == grpId) : null;
    if (currentGroup == null) {
      setState({ ...state, openMoreActions: false, elMoreActions: null, currentGroup });
      console.log('current Group is null')
      return;
    }

    let newState = { ...state };

    switch (action) {
      case 0:
        break;
      case 1:
        newState = {
          ...state,
          currentGroup, bOpenGroupPage: true,
          groupPageTitle: currentGroup.name,
          groupPageTitleText: "그룹 정보를 변경합니다."
        };
        break;
      case 2:
        newState = { ...state, currentGroup, bShowGroupList: false, bShowMemberList: true };
        break;
      case 3:
        console.log("삭제");
        break;
    }
    setState({ ...newState, openMoreActions: false, elMoreActions: null });
  }

  const handleMemberListClose = () => {
    setState({ ...state, bShowMemberList: false, bShowGroupList: true, currentGroup: null });
  }

  useEffect(() => {
    let userID = (user) ? user.email.split('@')[0] : '';
    setState({ ...state, userID });
    Server.getGroupListByUserID(userID)
      .then((groupList) => {
        groupList.map((grp) => {
          const btnId = `btn-moreActions-${grp.groupID}`;
          grp['menu'] = <MenuButton id={btnId} />
        });
        setGroupList(groupList)
      });
  }, []);

  const openGroupPage = () => {
    setState({
      ...state,
      bOpenGroupPage: true,
      groupPageTitle: "Add a New Group",
      groupPageTitleText: "새로운 그룹(클래스)를 만듭니다."
    });
  }

  const onCloseGroupPage = (bOK) => (d) => {
    if (!bOK) {
      setState({ ...state, bOpenGroupPage: false, currentGroup: null, });
      return;
    }
    //let groupList = state.groupList;
    const data = {
      //groupID : d.groupID,
      name: `${d.courseName}`,
      owner: d.owner || user.id,
      ownerEmail: d.ownerEmail || user.email, /// 조교가 수정할 경우도 고려해야 함. Backend에서 고려하고 있음.
      ownerName: user.name,
      semester: d.semester,
      classSchedule: d.classSchedule,
      kind: d.kind,
      dept: d.dept,
      memoryLimit: d.memoryLimit,
    }
    if (state.currentGroup) {
      Server.updateGroup(state.currentGroup.groupID, data).then((res) => {
        if (res.msg == "OK") {
          let grp = groupList.find((g) => g.groupID == d.groupID);
          grp.name = data.name;
          grp.classSchedule = data.classSchedule;
          grp.kind = data.kind;
          grp.dept = data.dept;
          grp.memoryLimit = data.memoryLimit;
          setGroupList(groupList);
          setState({ ...state, bOpenGroupPage: false });
          snackbar("success", "그룹 정보를 변경하였습니다.")
        }
        else {
          snackbar("error", "그룹 정보 변경 실패");
        }
      });
    }
    else {
      Server.addGroup(data).then((res) => {
        if (res.msg == "OK") {
          //const btnId = `btn-moreActions-${res.groupID}`;
          let list = [...groupList];
          list.push({
            groupID: res.groupID,
            name: data.name,
            kind: data.kind,
            owner: data.owner,
            dept: data.dept,
            ownerEmail: data.ownerEmail,
            ownerName: data.ownerName,
            classSchedule: data.classSchedule,
            menu: <MenuButton id={`btn-moreActions-${res.groupID}`} />,
          });
          setState({ ...state, bOpenGroupPage: false });
          setGroupList(list);
        }
      });
    }
  }

  const MenuButton = (props) => {
    return (
      <IconButton id={props.id}
        onClick={handleMoreBtnClick(props.id)}
        disabled={false /*userID !== grp.owner*/}>
        <MoreVertOutlined size="sm" />
      </IconButton>
    )
  }

  return (
    <React.Fragment>
      <Paper sx={styles.root}>
        {state.bShowGroupList && groupList && groupList.length > 0 &&
          < Box sx={styles.paper} >
            <CustomTable sx={styles.table}
              columns={groupListColumns}
              data={groupList}>
            </CustomTable>

            <Button sx={styles.grpAddBtn} color="primary" variant="outlined"
              onClick={openGroupPage}>
              <AddCircleOutline /> Add Group
            </Button>
          </Box>
        }

        {state.bShowMemberList &&
          <MemberPage group={state.currentGroup} open={state.bShowMemberList}
            onClose={handleMemberListClose}
            title={state.currentGroup.name + '의 사용자 목록'} />}

        <GroupPage user={state.userID}
          open={state.bOpenGroupPage}
          onClose={onCloseGroupPage}
          group={state.currentGroup}
          title={state.groupPageTitle}
          titleText={state.groupPageTitleText} />
        <Menu
          id="simple-menu"
          anchorEl={state.elMoreActions}
          keepMounted
          open={state.openMoreActions}
          onClose={handleCloseMoreActions(0)}
        >
          <MenuItem onClick={handleCloseMoreActions(1)}>그룹정보 변경</MenuItem>
          <MenuItem onClick={handleCloseMoreActions(2)}>멤버관리</MenuItem>
          {/* <MenuItem onClick={handleCloseMoreActions(3)}>삭제</MenuItem> */}
        </Menu>
      </Paper>
    </React.Fragment>
  );
}

export default GroupList;