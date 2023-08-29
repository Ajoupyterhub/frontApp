import config from './config';

function asyncFetch(url, options = { method: "GET" }, callback = null) {
  return ((async function (url, options, callback) {
    let data;
    await fetch(url, options).then(r => r.json()).then(json => {
      data = (callback) ? callback(json) : json;
      //data = callback(json); 
      console.log("In AsyncFetch: ", data)
      return;
    });
    return data;
  })(url, options, callback));
}

const Server = {

  testAsync: function () { // 호출하는 부분에서, await로 call 해야 함. ==> 의미 없음
    return asyncFetch('/user/jyc/notebook/wetty',
      {
        method: "GET",
      })
  },

  login: async function (data) {
    return await fetch("/login", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(d => d.json())
  },


  // login : function(data) {
  //   const url = "/login";
  //   const options = {
  //     method: "POST",
  //     headers: {
  //         'Accept': 'application/json',
  //         'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(data)}
  //     return (async function (url, options) {
  //       let data = await fetch(url, options).then(r =>  r.json()).then(r => { return r;});
  //       return data; 
  //     })(url, options);
  //     //console.log(rv);
  //     //return rv;
  // },

  googleLogin: function (user) {
    return fetch("/login", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 'loginType': 'Google', 'email': user.email })
    })
      .then(d => d.json());
  },

  logout: function (userEmail, signInMode) {
    let response = { level: 'success', msg: 'OK' };

    if (signInMode == 'Google') {
      if (googleSignOut(userEmail) == false) {
        response = { level: 'warning', msg: 'Google Signout Error' };
      }
    }

    return fetch('/logout').then(d => d.json())
      .then(d => {
        if (d.msg != 'OK') {
          response.level = 'error';
          response.msg = d.msg;
        }
        return response;
      });
  },

  statusContainer: function (userID, kind) {
    const url = `/user/${userID}/notebook/${kind}`
    return fetch(url).then(d => d.json()).catch(e => {
      console.log(`Error in Fetch.statusContainer: ${e}`);
    });
  },

  startContainer: function (userID, kind) {
    const url = `/user/${userID}/notebook`;
    const body = { action: "start", kind: kind };
    return fetch(url, {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((d) => d.json());
  },

  stopContainer: function (userID, kind) {
    const body = { action: "stop", kind: kind };
    return fetch(`/user/${userID}/notebook`, {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((d) => d.json());
  },

  getContainers: function (userID) {
    return fetch(`/user/${userID}/notebook`).then(d => d.json());
  },

  statusWeb: function (userID) {
    return fetch(`/user/${userID}/web`).then(r => r.json());
  },

  startDeploy: function (userID, port = 5000) {
    const body = {port : port};
    return fetch(`/user/${userID}/web`, {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(r => r.json());
  },

  stopDeploy: function (userID) {
    return fetch(`/user/${userID}/web`, {
      method : 'DELETE'
    }).then(r => r.json())
  },

  registerUser: function (data) {
    return fetch('/user', {
      method: 'POST',
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify(data),
    }).then((response) => response.json())
  },

  forgotPassword: function (data) {
    return fetch('/account/forgotPassword', {
      method: 'POST',
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify(data),
    }).then((response) => response.json());
  },

  newPassword: function (data) {

    return fetch("/account/newPassword", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(d => d.json());
  },

  addMembers: function (groupID, data) {

    return fetch(`/group/${groupID}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify(data),
    }).then(resp => resp.json())
  },

  deleteMembers: function (groupID, members) {

    return fetch(`/group/${groupID}/members`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify(members),
    }).then(resp => resp.json())
  },

  changeRole: function (groupID, member, role) {
    return fetch(`/group/${groupID}/members`, {
      method: 'PUT',
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify({ 'user': member, 'role': role }),
    }).then(res => res.json());
  },

  updateUserProfile: function (userID, data) {

    return fetch("/user/" + userID, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    }).then((response) => response.json());
  },

  addGroup: function (data) {
    return fetch("/group", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    }).then((response) => response.json());
  },

  updateGroup: function (groupID, data) {
    return fetch(`/group/${groupID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    }).then((response) => response.json());
  },

  getGroupListByUserID: function (userID) {

    return fetch(`/user/${userID}/groups`).then((res) => res.json());
  },

  getMembersByGroupID: function (groupID) {
    return fetch(`/group/${groupID}/members`).then((res) => res.json());
  },

  getNotice: function () {
    return fetch('/notice').then(d => d.json());
  },

  /**
   * * 블로그 포스트 API
   * 1. 블로그 전체 글 API
   * 2. 블로그 태그 글 API
   */
  /**
   * @iMUngHee
   * @description 블로그 전체 글 API
   * @method GET
   * @param {number} page
   * @returns {object}
   */

  getAllPosts: function (page = 0) {
    const BLOG_URL = config.BLOG_URL
    const url = (page === 0)
      ? `${BLOG_URL}/page-data/index/page-data.json`
      : `${BLOG_URL}/page-data/pages/${page + 1}/page-data.json`

    return (async function (url) {
      let data;
      await fetch(url).then(r => r.json()).then(r => { data = r.result.data; });

      return data?.posts?.edges?.map(({ node: { frontmatter } }) => {
        let date = frontmatter.date.split('T')[0]; 
        if (date?.length === 0) date = '0'.repeat(6).split('');
        return {
          title: frontmatter.title,
          slug: frontmatter.slug,
          date: date, 
        };
      });
    })(url);
  },
  /**
   * @iMUngHee
   * @description 블로그 태그 글 API
   * @method GET
   * @param {string} tag
   * @returns {object}
   */

  getPostsByTag: function (tag) {
    const BLOG_URL = config.BLOG_URL;
    const url = `${BLOG_URL}/page-data/tags/${tag}/page-data.json`;
    return (async function (url) {
      let data;
      await fetch(url).then(r => r.json()).then(r => { data = r.result.data; });

      return data?.posts?.edges?.map(({ node: { frontmatter } }) => {
        let date = frontmatter.date.split('T')[0]
        if (date?.length === 0) date = '0'.repeat(6).split('');
        return {
          title: frontmatter.title,
          slug: frontmatter.slug,
          date: date, 
        };
      });
    })(url);
  },

  /*
  getAccessLog: function (userID) {
    return fetch(`/user/${userID}/access-log`).then(r => r.json());
  },

  getUsage: function (userID) {
    return fetch(`/user/${userID}/usage-statistics`).then(r => r.json());
  },
  */

  getAllUsage: function () {
    return fetch('/stat/all-usage-stat').then(r => r.json());
  },

  initSSHKey : function (userID) {
    return fetch(`/user/${userID}/auth/ssh-key`, {
      method : 'PUT',
    }).then(r => r.json())
  },

  addSSHKey: function (userID, data) {
    return fetch(`/user/${userID}/auth/ssh-key`, {
      method : 'POST',
      body : data,
    }).then(r => r.json())
  },
};

export default Server;


