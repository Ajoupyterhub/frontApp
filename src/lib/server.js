import config from './config';

const Server = {

login : function(data) {
    return fetch("/login", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)})
            .then(d => d.json());
},


googleLogin : function (user) {
    return fetch("/login", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({'loginType' : 'Google', 'email' : user.email})})
    .then(d => d.json());
        
    /*
    return fetch("/oauth/google__/authorize", {mode : 'no-cors'}).then(d => d.text)
    .catch(e=>{
        console.log(e);
    });*/    
},

logout : function(userEmail, signInMode) {
    let response = {level : 'success', msg : 'OK'};

    if(signInMode == 'Google') {
        if(googleSignOut(userEmail) == false) {
          response = {level : 'warning', msg :'Google Signout Error'};
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

statusNotebook : function(userID, kind) {
    const url = `/user/${userID}/notebook/${kind}`
    return fetch(url).then(d => d.json()).catch(e => {
        console.log(`Error in Fetch.statusNotebook: ${e}`);
    });
},

startNotebook : function(userID, notebook) {
    const url = `/user/${userID}/notebook`;
    const body  = { action: "start", notebookKind : notebook.notebookName};
    return fetch(url, {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((d) => d.json());
},

stopNotebook : function (userID, notebook) {
    const body  = { action: "stop",  notebookKind : notebook.notebookName };
    return fetch(`/user/${userID}/notebook`, {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((d)=> d.json());
},

getNotebooks : function(userID) {
    return fetch(`/user/${userID}`).then(d => d.json());
},

registerUser : function(data) {
    return fetch('/user', {
        method: 'POST',
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify(data),
      }).then((response) => response.json())
},

forgotPassword : function(data) {
    return fetch('/account/forgotPassword', {
        method: 'POST',
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify(data),
      }).then((response) => response.json());
},

newPassword : function(data) {

    return fetch("/account/newPassword", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).then(d => d.json());
},

addMembers : function(groupID, data) {

    return fetch(`/group/${groupID}/members`, {
        method : "POST",
        headers : {"Content-Type" : "application/json",},
        body : JSON.stringify(data),
      }).then(resp => resp.json())
},

deleteMembers : function(groupID, members) {

    return fetch(`/group/${groupID}/members`, {
        method : "DELETE",
        headers : {"Content-Type" : "application/json",},
        body : JSON.stringify(members),
      }).then(resp => resp.json())
},

changeRole : function(groupID, member, role) {
    return fetch(`/group/${groupID}/members`, {
        method : 'PUT',
        headers : {"Content-Type" : "application/json",},
        body : JSON.stringify({'user' : member, 'role' : role}),
    }).then(res => res.json());
},

updateUserProfile : function(userID, data) {
    
    return fetch("/user/" + userID, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    }).then((response) => response.json());
},

addGroup : function(data) {
    return fetch("/group", {
        method : "POST",
        headers: {
            "Content-Type" : "application/json",
        },
        body: JSON.stringify(data)
    }).then((response) => response.json());
},

updateGroup : function(groupID, data) {
    return fetch(`/group/${groupID}`, {
        method : "PUT",
        headers: {
            "Content-Type" : "application/json",
        },
        body: JSON.stringify(data)
    }).then((response) => response.json());
},

getGroupListByUserID : function(userID) {

    return fetch(`/user/${userID}/groups`).then((res) => res.json());
},

getMembersByGroupID : function(groupID) {
    return fetch(`/group/${groupID}/members`).then((res) => res.json());
},

getNotice : function () {
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
/*
export function getAllPosts(page = 0) {
    return http.get(
      page === 0
        ? `${BLOG_URL}/page-data/index/page-data.json`
        : `${BLOG_URL}/page-data/pages/${page + 1}/page-data.json`,
    );
  }
  */

  getAllPosts : function (page = 0) {
    const BLOG_URL = config.BLOG_URL
    const url = (page === 0)
    ? `${BLOG_URL}/page-data/index/page-data.json`
    : `${BLOG_URL}/page-data/pages/${page + 1}/page-data.json`

    return (async function(url) {
        let data;
        await fetch(url).then(r => r.json()).then(r => {data = r.result.data;});

        return data?.posts?.edges?.map(({ node: { frontmatter } }) => {
          let date = frontmatter.slug.match(/\d*$/)[0].split('');
          if (date.length === 0) date = '0'.repeat(6).split('');
          return {
            title: frontmatter.title,
            slug: frontmatter.slug,
            date: `${date[0]}${date[1]}.${date[2]}${date[3]}.${date[4]}${date[5]}`,
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
  /*
  export function getPostsByTag(tag) {
    return http.get(`${BLOG_URL}/page-data/tags/${tag}/page-data.json`);
  }
  */

  getPostsByTag: function (tag) {
    const BLOG_URL = config.BLOG_URL;
    const url = `${BLOG_URL}/page-data/tags/${tag}/page-data.json`;
    return (async function (url) {
      let data;
      await fetch(url).then(r => r.json()).then(r => { data = r.result.data; });

      return data?.posts?.edges?.map(({ node: { frontmatter } }) => {
        let date = frontmatter.slug.match(/\d*$/)[0].split('');
        if (date.length === 0) date = '0'.repeat(6).split('');
        return {
          title: frontmatter.title,
          slug: frontmatter.slug,
          date: `${date[0]}${date[1]}.${date[2]}${date[3]}.${date[4]}${date[5]}`,
        };
      });
    })(url);
  }
};



export default Server;


