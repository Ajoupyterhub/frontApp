import React from 'react';
import PropTypes from 'prop-types';
import {CssBaseline, Paper, Button, Menu, MenuItem} from '@material-ui/core';
import { MoreVertOutlined, SettingsOutlined, LaptopMacOutlined, 
    PlayArrow, Stop, AddCircleOutline, DeleteOutlined, Group, ListAlt } from '@material-ui/icons';  
import withStyles from '@material-ui/core/styles/withStyles';
import { green, blue, yellow, red } from '@material-ui/core/colors';
import { AppContext } from './app-context';
import GroupPage from './GroupPage';
import CustomTable from './CustomTable';
import MemberPage from './MemberPage';
import Fetch from './fetch.js';

const styles = theme => ({
    root: {
      width : '100%', //`calc(100% - ${theme.spacing.unit})`,
      height : `calc(100vh - 20px)`,
      marginLeft: 'auto',
      marginRight: 'auto',
      //overflow : 'auto',
    },
  
    paper: {
      //margin: theme.spacing(1),
      width : '100%', //`calc(100% - ${theme.spacing(1)})`,
      //justifyContent : 'center',
      display : 'flex',
      flexDirection : 'column',
      justifyContent : 'flex-start',
      minHeight : 650,
      //alignItems : 'center',
      marginLeft: 'auto',
      marginRight: 'auto',
      //overflow : 'auto',
      //flexShrink: 0,
      //backgroundColor : yellow[100],
    },
  
    grpAddBtn : {
        minWidth : 400,
        maxWidth : 900,
        minHeight : 60,
        //padding : theme.spacing(3),
        //marginTop : 30,
        marginLeft: 'auto',
        marginRight: 'auto',
        //justifyContent : 'center',
    },

    table: {
      minWidth: 700,
      maxWidth: 900,
      minHeight: 590,
      padding : theme.spacing(1),
      marginLeft : 'auto',
      marginRight : 'auto',
    },
  
    button: {
      minWidth: 120,
    },
    
  });

class GroupList extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            userID : this.props.userID,
            currentGroupID : 0,
            currentGroup : null,
            groupList : [],
            elMoreActions : null,
            bShowGroupList : true,
            bShowMemberList : false,
            bOpenGroupPage : false,
            groupPageTitle : "Add a New Group",
            groupPageTitleText : "????????? ??????(?????????)??? ????????????.", 
        }
        this.groupListColumns = [
            { displayName : "?????????", key : "name" },
            { displayName : "????????????", key : "classSchedule"},
            { displayName : "Notebook ??????", key : "notebookKind" },
            { displayName : "????????????", key : "ownerName" },
            { displayName : "?????????", key : "menu" },
        ]
    }
    
    handleSettingBtnClick = (btnId) => () => {
        this.setState({elMoreActions : document.getElementById(btnId)});
    }

    handleCloseMoreActions = (action) => (e) => {
        let grpId = this.state.elMoreActions.id.split('-')[2];
        let currentGroup = (this.state.groupList) ? this.state.groupList.find((g) => g.groupID == grpId) : null;
        if (currentGroup == null) {
            this.setState({elMoreActions : null, currentGroup});
            return;
        }

        switch(action) {
            case 0:
                console.log("Close");
                break;
            case 1:
                this.setState({currentGroup, bOpenGroupPage : true,
                    groupPageTitle : currentGroup.name, 
                    groupPageTitleText : "?????? ????????? ???????????????."})
                break;
            case 2:
                this.setState({currentGroup, bShowGroupList : false, bShowMemberList : true});
                break;
            case 3:
                console.log("??????");
                break;
        }
        this.setState({elMoreActions : null});
    }
    
    handleMemberListClose = () => {
        this.setState({bShowMemberList : false, bShowGroupList : true, currentGroup : null});
    }

    componentDidMount() {
        let context = this.context;
        let userID = (context.currentUser) ? context.currentUser.email.split('@')[0] : '';
        this.setState({userID});
        //console.log(userID);
        Fetch.getGroupListByUserID(userID)
        .then((groupList) => {
            groupList.map((grp) => {
                const btnId = `btn-moreActions-${grp.groupID}`;
                grp['menu'] =
                <Button  id={btnId} 
                    onClick={this.handleSettingBtnClick(btnId)} 
                    disabled={false /*userID !== grp.owner*/}>
                    <MoreVertOutlined size="sm"/>
                </Button>;
            });
            this.setState({groupList})
        });
    }

    openGroupPage = () => {
        this.setState({bOpenGroupPage : true,            
            groupPageTitle : "Add a New Group",
            groupPageTitleText : "????????? ??????(?????????)??? ????????????."});
    }

    onCloseGroupPage = (bOK) => (d) => {
        if(bOK) {
            let groupList = this.state.groupList;
            let context = this.context;
            const data = {
                //groupID : d.groupID,
                name : `${d.courseName}`,
                owner : d.owner || context.currentUser.id,
                ownerEmail : d.ownerEmail || context.currentUser.email, /// ????????? ????????? ????????? ???????????? ???. Backend?????? ???????????? ??????.
                ownerName : context.currentUser.name,
                semester : d.semester,
                classSchedule : d.classSchedule,
                notebookKind : d.notebookKind,
                dept : d.dept,
                memoryLimit : d.memoryLimit,
            }
            if(this.state.currentGroup) {
                Fetch.updateGroup(this.state.currentGroup.groupID, data).then((res) => {
                    if(res.msg == "OK") {
                        let grp = groupList.find((g) => g.groupID == d.groupID);
                        grp.name = data.name;
                        grp.classSchedule = data.classSchedule;
                        grp.notebookKind = data.notebookKind;
                        grp.dept = data.dept;
                        grp.memoryLimit = data.memoryLimit;
                        this.setState({groupList});
                        context.snackbar("success", "?????? ????????? ?????????????????????.")
                    }
                    else {
                        context.snackbar("error", "?????? ?????? ?????? ??????");
                    }
                });
            }
            else {
                Fetch.addGroup(data).then((res) => {
                    if (res.msg == "OK") {
                        const btnId = `btn-moreActions-${res.groupID}`;
                        groupList.push({
                            groupID : res.groupID,
                            name : data.name, 
                            notebookKind : data.notebookKind,
                            owner : data.owner,
                            dept : data.dept,
                            ownerEmail : data.ownerEmail,
                            ownerName : data.ownerName,
                            classSchedule : data.classSchedule,
                            menu :  
                               <Button  id={btnId}
                                onClick={this.handleSettingBtnClick(btnId)} 
                                disabled={false} >
                                <MoreVertOutlined size="sm"/>
                              </Button>
                        });
                        this.setState({groupList, bOpenGroupPage : false});
                        /* context.changeUserProjectsInfo({
                            projID : res.groupID,
                            notebookName : data.notebookKind,
                            projectName : data.name,
                            status : null
                        }, 'ADD'); */
                    }
                });
            }
        }
        this.setState({bOpenGroupPage : false, currentGroup : null, });
    }

    render () {
        const {classes} = this.props;

        return (
            <React.Fragment>
                {/* <CssBaseline /> */}
                <Paper className={classes.root}>
                    { this.state.bShowGroupList && this.state.groupList && this.state.groupList.length > 0 &&
                    < div className={classes.paper} >
                    <CustomTable className = {classes.table} 
                        columns={this.groupListColumns} 
                        data={this.state.groupList}> 
                    </CustomTable>

                    <Button className={classes.grpAddBtn} color="primary" variant="outlined"
                        onClick = {this.openGroupPage}> 
                        <AddCircleOutline /> Add Group 
                    </Button> 
                    </div>
                    }
                    { false && this.state.bShowGroupList && 
                    <Button className={classes.grpAddBtn} color="primary" variant="outlined"
                        onClick = {this.openGroupPage}> 
                        <AddCircleOutline /> Add Group 
                    </Button> 
                    }

                    { this.state.bShowMemberList && 
                    <MemberPage groupID={this.state.currentGroup.groupID} open={this.state.bShowMemberList} 
                        onClose={this.handleMemberListClose}
                        title = {this.state.currentGroup.name + '??? ????????? ??????'}/> }
                    <GroupPage user={this.state.userID} 
                        open={this.state.bOpenGroupPage} 
                        onClose={this.onCloseGroupPage}
                        group = {this.state.currentGroup}
                        title = {this.state.groupPageTitle} /*"Add a New Group"*/
                        titleText = {this.state.groupPageTitleText} /*"????????? ??????(?????????)??? ????????????."*/ />
                    <Menu
                      id="simple-menu"
                      anchorEl={this.state.elMoreActions}
                      keepMounted
                      open={Boolean(this.state.elMoreActions)}
                      onClose={this.handleCloseMoreActions(0)}
                    >
                      <MenuItem onClick={this.handleCloseMoreActions(1)}>???????????? ??????</MenuItem>
                      <MenuItem onClick={this.handleCloseMoreActions(2)}>????????????</MenuItem>
                      {/* <MenuItem onClick={this.handleCloseMoreActions(3)}>??????</MenuItem> */}
                    </Menu>
                </Paper>
            </React.Fragment>
        );
    }
}

GroupList.contextType = AppContext;

export default withStyles(styles)(GroupList);