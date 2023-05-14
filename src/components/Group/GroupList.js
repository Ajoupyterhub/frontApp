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
    setGroupPage({open : false});
    setMenu({open : true, el : document.getElementById(btnId)});
  }

  const handleCloseMoreActions = (action) => (e) => {
    let grpId = menu.el.id.split('-')[2];
    let currentGroup = (groupList) ? groupList.find((g) => g.groupID == grpId) : null;
    if (currentGroup == null) {
      setMenu({open : false, el : null});
      snackbar("Error", "그룹이 선택되지 않았다고 합니다. 관리자에게 알려주세요.")
      console.log('current Group is null')
      return;
    }

    switch (action) {
      case 0:
        break;
      case 1:
        setCurrentGroup(currentGroup);
        setGroupPage({open : true, title : currentGroup.name, text : "그룹 정보를 변경합니다."});
        break;
      case 2:
        setCurrentGroup(currentGroup);
        setPage("member");
        break;
      case 3:
        console.log("삭제");
        break;
    }
    setMenu({open : false, el : null});
  }

  const handleMemberListClose = () => {
    setPage("group");
  }

  useEffect(() => {
    Server.getGroupListByUserID(user.id)
      .then((groups) => {
        groups.forEach((grp) => {
          const btnId = `btn-moreActions-${grp.groupID}`;
          grp['menu'] = <MenuButton id = {btnId} onClick={handleMoreBtnClick(btnId)}/>;
        });
        setGroupList([...groups])
      });
  }, []);

  const openGroupPage = () => {
    setCurrentGroup(null);
    setGroupPage({open : true, title : "Add a New Group", text : "새로운 그룹(클래스)를 만듭니다."})
  }

  const onCloseGroupPage = (bOK) => (d) => {
    if (!bOK) {
      setGroupPage({open : false});
      setCurrentGroup(null);
      return;
    }

    const data = { ...d }
    data.owner = user.id
    data.ownerEmail = user.email;
    data.ownerName = user.name;

    if (currentGroup) {
      Server.updateGroup(currentGroup.groupID, data).then((res) => {
        if (res.msg == "OK") {
          let grp = groupList.find((g) => g.groupID == d.groupID);
          // grp = {...grp, ...data} // ...spread operator creates new objects, no updates
          grp.name = data.name;
          grp.classSchedule = data.classSchedule;
          grp.kind = data.kind;
          grp.dept = data.dept; 
          setGroupList([...groupList]);
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
          let grp = {...data }
          grp.groupID = res.groupID;
          grp.menu = <MenuButton id = {btnId} onClick={handleMoreBtnClick(btnId)}/>;
          setGroupPage({open : false});
          setGroupList([...groupList, grp]);
        }
      });
    }
  }

 const MenuButton = (props) => {
    return (
      <IconButton {...props} >
        <MoreVertOutlined size="sm" />
      </IconButton>
    )
  }

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

        {page == "member" && currentGroup &&
          <MemberPage group={currentGroup} 
            open={page == "member"}
            onClose={handleMemberListClose}
            title={currentGroup.name + '의 사용자 목록'} />
        }

        <GroupPage 
          open={groupPage.open }
          onClose={onCloseGroupPage}
          group={currentGroup}
          title={groupPage.title }
          titleText={groupPage.text } />
        <Menu
          id="simple-menu"
          anchorEl={menu.el }
          keepMounted
          open={menu.open }
          /* onClose={handleCloseMoreActions(0)} */
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