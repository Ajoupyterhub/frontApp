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
  /*
  let [state, setState] = useState({
    userID: props.userID,
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
*/
  let [groupList, setGroupList] = useState([]);
  let [currentGroup, setCurrentGroup] = useState(null);
  let [menu, setMenu] = useState({el : null, open : false});
  let [groupPage, setGroupPage] = useState({
    open : false, 
    title : 'Add a New Group', 
    text : "새로운 그룹(클래스)를 만듭니다."});
  let [ page, setPage] = useState("group");

  const groupListColumns = [
    { displayName: "교과목", key: "name" },
    { displayName: "수업시간", key: "classSchedule" },
    { displayName: "컨테이너 종류", key: "kind" },
    { displayName: "담당교수", key: "ownerName" },
    { displayName: "더보기", key: "menu" },
  ]
  let user = currentUser();
  let snackbar = useSnackbar();


  const handleMoreBtnClick = (btnId) => (e) => {
    //console.log(btnId + ' Clicked')
    //setState({ ...state, bOpenGroupPage: false, openMoreActions: true, elMoreActions: document.getElementById(btnId) });
    e.preventDefault();
    console.log(e)
    let grpId = btnId.split('-')[2];
    console.log(grpId, groupList, currentGroup);
    let currentGroup = (groupList) ? groupList.find((g) => g.groupID == grpId) : null;
    if (currentGroup == null) {
      //setState({ ...state, openMoreActions: false, elMoreActions: null, currentGroup });
      setMenu({open : false, el : null});
      console.log('current Group is null')
      return;
    }
    setCurrentGroup(currentGroup);
    setGroupPage({open : false});
    setMenu({open : true, el : document.getElementById(btnId)});
  }

  const handleCloseMoreActions = (action) => (e) => {
    //let grpId = state.elMoreActions.id.split('-')[2];
    e.preventDefault();
    let grpId = menu.el.id.split('-')[2];
    let currentGroup = (groupList) ? groupList.find((g) => g.groupID == grpId) : null;
    if (currentGroup == null) {
      //setState({ ...state, openMoreActions: false, elMoreActions: null, currentGroup });
      setMenu({open : false, el : null});
      console.log('current Group is null')
      return;
    }

    //let newState = { ...state };

    switch (action) {
      case 0:
        break;
      case 1:
        /* newState = {
          ...state,
          currentGroup, bOpenGroupPage: true,
          groupPageTitle: currentGroup.name,
          groupPageTitleText: "그룹 정보를 변경합니다."
        };*/
        setCurrentGroup(currentGroup);
        setGroupPage({open : true, title : currentGroup.name, text : "그룹 정보를 변경합니다."});
        break;
      case 2:
        //newState = { ...state, currentGroup, bShowGroupList: false, bShowMemberList: true };
        setCurrentGroup(currentGroup);
        setPage("member");
        break;
      case 3:
        console.log("삭제");
        break;
    }
    setMenu({open : false, el : null});
    //setState({ ...newState, openMoreActions: false, elMoreActions: null });
  }

  const handleMemberListClose = () => {
    //setState({ ...state, bShowMemberList: false, bShowGroupList: true, currentGroup: null });
    setPage("group");
    setCurrentGroup(null);
  }

  useEffect(() => {
    let userID = (user) ? user.email.split('@')[0] : '';
    //setState({ ...state, userID });
    Server.getGroupListByUserID(userID)
      .then((groups) => {
        groups.forEach((grp) => {
          const btnId = `btn-moreActions-${grp.groupID}`;
          grp['menu'] = <IconButton id={btnId}
                          onClick={handleMoreBtnClick(btnId)}
                          disabled={false /*userID !== grp.owner*/}>
                          <MoreVertOutlined size="sm" />
                        </IconButton>; /* <MenuButton id={btnId} onClick={handleMoreBtnClick}/>*/
        });
        setGroupList([...groups])
        console.log(groups)
      });
  }, []);

  const openGroupPage = () => {
    /*
    setState({
      ...state,
      bOpenGroupPage: true,
      groupPageTitle: "Add a New Group",
      groupPageTitleText: "새로운 그룹(클래스)를 만듭니다."
    });
    */
    console.log(groupList)
    setGroupPage({open : true, title : "Add a New Group", text : "새로운 그룹(클래스)를 만듭니다."})
  }

  const onCloseGroupPage = (bOK) => (d) => {
    if (!bOK) {
      //setState({ ...state, bOpenGroupPage: false, currentGroup: null, });
      setGroupPage({open : false});
      setCurrentGroup(null);
      return;
    }
    //let groupList = state.groupList;
    const data = {
      groupID : d.groupID,
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
    if (/*state.*/currentGroup) {
      Server.updateGroup(/*state.*/currentGroup.groupID, data).then((res) => {
        if (res.msg == "OK") {
          let grp = groupList.find((g) => g.groupID == d.groupID);
          grp.name = data.name;
          grp.classSchedule = data.classSchedule;
          grp.kind = data.kind;
          grp.dept = data.dept;
          grp.memoryLimit = data.memoryLimit;
          setGroupList([...groupList, grp]);
          //setState({ ...state, bOpenGroupPage: false });
          setGroupPage({open : false});
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
          const btnId = `btn-moreActions-${res.groupID}`;
          //let list = [...groupList];
          let grp = {
            groupID: res.groupID,
            name: data.name,
            kind: data.kind,
            owner: data.owner,
            dept: data.dept,
            ownerEmail: data.ownerEmail,
            ownerName: data.ownerName,
            classSchedule: data.classSchedule,
            menu: <IconButton id={btnId}
                    onClick={handleMoreBtnClick(btnId)}
                    disabled={false /*userID !== grp.owner*/}>
                    <MoreVertOutlined size="sm" />
                  </IconButton>,
          };
          //setState({ ...state, bOpenGroupPage: false });
          setGroupPage({open : false});
          setGroupList([...groupList, grp]);
        }
      });
    }
  }

 /* const MenuButton = (props) => {
    return (
    )
  } */

  return (
    <React.Fragment>
      <Paper sx={styles.root}>
        {page == "group" && groupList && groupList.length > 0 &&
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

        {page == "member" /* state.bShowMemberList */ && currentGroup &&
          <MemberPage group={/*state.*/currentGroup} 
            open={page == "member"/*state.bShowMemberList*/}
            onClose={handleMemberListClose}
            title={/*state.*/currentGroup.name + '의 사용자 목록'} />
        }

        <GroupPage /* user={user.id} */
          open={groupPage.open /*state.bOpenGroupPage*/}
          onClose={onCloseGroupPage}
          group={/*state.*/currentGroup}
          title={groupPage.title /*state.groupPageTitle*/}
          titleText={groupPage.text /*state.groupPageTitleText*/} />
        <Menu
          id="simple-menu"
          anchorEl={menu.el /*state.elMoreActions*/}
          keepMounted
          open={menu.open /*state.openMoreActions*/}
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