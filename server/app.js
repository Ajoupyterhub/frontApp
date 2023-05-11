var express = require('express');
const logger = require('morgan');
const axios = require('axios');
//const list = require('./data');
//const firebase = require('./firebase');

var app = express()
const port = 5000

app.use(express.json())
app.use(express.urlencoded({'extended' : true}));
app.use(logger('dev'));
app.use(express.static(__dirname + '/public'));   // html, image 등 정적파일 제공 폴더 지정

var containers = {
  'code' : {
    status : null,
  },
  'tensorflow' : {
    status : null,
  },
  'datascience' : {
    status : null,
  }
};

app.get('/', (req, res) => {
  res.sendFile('index.html', {root : __dirname + '/public'})
})

app.get('/dev', (req, res) => {
    res.sendFile('index.html', {root : __dirname + '/public'})
})

app.post('/login', (req, res) => {
  res.json({
    msg : "OK", 
    user : { 
        id: "jyc", 
        name: "훈남", 
        dept: "CIA", 
        email: "jyc@jclab.org", 
        status : "OK", 
        primary_role : "O",
        imageUrl : "https://lh3.googleusercontent.com/a-/AOh14GjZgcI_rLJUYPRn3pigCRzEths4_KAfl08-DfgYag=s96-c",
        accessLogs : [
          {datetime : "2023-05-07T14:23:00", container : 'code'},
          {datetime : "2023-04-30T17:37:00", container : 'datascience'},
          {datetime : "2023-04-23T19:17:00", container : 'code'},
        ],
        usageStat : [
          ["Container", "Number of Runs"],
          ["code",  12],
          ["datascience", 16],
          ["tensorflow", 7],
        ],
    }
  })
});

app.post('/login', (req, res) => {
  if(req.body.loginType == 'Google') {
    res.json(
      {
        msg : "OK", 
        user : { 
          id: "jyc", 
          name: "훈남", 
          dept: "CIA", 
          email: "jyc@jclab.org", 
          status : "OK", 
          primary_role : "O",
          imageUrl : "https://lh3.googleusercontent.com/a-/AOh14GjZgcI_rLJUYPRn3pigCRzEths4_KAfl08-DfgYag=s96-c"
        }
      })
  }
  else {
    res.json({
      msg : "OK", 
      user : { 
          id: "jyc", 
          name: "훈남", 
          dept: "CIA", 
          email: "jyc@jclab.org", 
          status : "OK", 
          primary_role : "O", 
          imageUrl : "https://lh3.googleusercontent.com/a-/AOh14GjZgcI_rLJUYPRn3pigCRzEths4_KAfl08-DfgYag=s96-c",
          groupsToControl : ['1', '2', '3'],
          numGroupsToControl : 7,
      }
    })  
  }
});
  
app.get('/logout', (req, res) => {
  res.json({
    msg : 'OK'
  });
})

app.get('/user/:userID/notebook/:kind', (req, res) => {
  console.log(containers[req.params.kind]);
  res.json(containers[req.params.kind] /*{status : 'running', passcode : '12345678'}*/);
})

app.post('/user/:userID/notebook', (req, res) => {
  let data = req.body; //.json();
  console.log(data);
  if (data.action == 'start') {
    containers[data.kind].status = 'running';
    setTimeout(() => {res.json({status : "OK", passcode : '12345678' })}, 3000) // was status : 'OK'
  } else {
    containers[data.kind].status = null;
    res.json({status : "OK"})   // was status : 'OK'
  }
})

app.get('/user/:userID', (req, res) => {
  res.json([
    {   status: null,
        description: "For Python & R",
        kind: "datascience", 
        displayName: "Datascience Notebook", }, 

     {  status: null,
        description: "For Deep Learning (Coming Soon ... )",
        kind: "tensorflow", 
        displayName: "Tensorflow Notebook",
      }, 

     {  status: null,
        description: "VS Code",
        kind: "code", 
        displayName: "Visual Studio Code", 
      }, 
    ])
})

app.post('/user', (req, res) => {
  res.json({msg: "OK"})
})

app.put('/user/:userID', (req, res) => {
  res.json({msg: "OK"})
})

app.get('/user/:userID/groups', (req, res) => {
  res.json([{
      groupID : "1",
      name : "빅데이터개론",
      owner : "jyc",
      ownerName : '훈남',
      kind : "jupyter/minimal-notebook",
      role : "admin",
    },
    {
      groupID : "2",
      name : "인공지능 프로그래밍 기초",
      owner : "jyc",
      ownerName : '쟁쟁한',
      kind : "jupyter/minimal-notebook",
      role: "user",
    }]
  )
})

app.post('/group', (req, res) => {
  res.json({msg: "OK", groupID : '9999'})
})

app.put('/group/:groupID', (req, res) => {
  res.json({msg: "OK",})
})

app.get('/group/:groupID/members', (req, res) => {
  res.json({ "msg" : "OK" , "data" : [
    { id : "jyc", name : "훈남", email : "jyc@jclab.org", dept: "jclab", role: "O", status : "OK"},
    { id : "a", name : "홍길동",email : "a@jclab.org", dept: "소프트웨어학과", role: "A", status : "OK"},
    { id : "b", name : "모모",email : "b@jclab.org", dept: "SW", role: "U", status : "pending"},
    { id : "c", name : "제니",email : "c@jclab.org", dept: "소프트웨어학과", role: "U", status : "OK"},
    { id : "d", name : "학생1",email : "d@jclab.org", dept: "소프트웨어학과C", role: "U", status : "OK"},
    { id : "e", name : "학생2",email : "e@jclab.org", dept: "소프트웨어학과", role: "U", status : "OK"},    
    { id : "e1", name : "학생3",email : "e1@jclab.org", dept: "소프트웨어학과", role: "U", status : "OK"},    
    { id : "e2", name : "학생4",email : "e2@jclab.org", dept: "소프트웨어학과", role: "U", status : "OK"},    
    { id : "e3", name : "학생5",email : "e3@jclab.org", dept: "소프트웨어학과", role: "U", status : "OK"},    
    { id : "e4", name : "학생6",email : "e4@jclab.org", dept: "소프트웨어학과", role: "U", status : "OK"},    
    { id : "e5", name : "학생7",email : "e5@jclab.org", dept: "소프트웨어학과", role: "U", status : "OK"},    
    { id : "e6", name : "학생8",email : "e6@jclab.org", dept: "소프트웨어학과", role: "U", status : "OK"},    
    { id : "e7", name : "학생9",email : "e7@jclab.org", dept: "소프트웨어학과", role: "U", status : "OK"},    
    { id : "e8", name : "학생10",email : "e8@jclab.org", dept: "소프트웨어학과", role: "U", status : "OK"},    
    { id : "e9", name : "학생11",email : "e9@jclab.org", dept: "소프트웨어학과", role: "U", status : "OK"},    
  ]})
})

app.post('/group/:groupID/members', (req, res) => {
  res.json({validated : 
    [{id : "f", name: "학생f", email : "f@ajou.ac.kr", dept : "CIA", role: "U"},
     {id : "a", name: "학생a", email : "a@ajou.ac.kr", dept : "CIA", role: "U"}]})
})

app.delete('/group/:groupID/members', (req, res) => {
  console.log(req.body)
  res.json({deleted : req.body})
})

app.put('/group/:groupID/members', (req, res) => {
  res.json({roleChangeFailed : [ 'a', 'b' ]})
})

app.get('/user/:userID/access-log', (req, res) => {
  res.json({
    logs : [
      {datetime : "2023-05-07T14:23:00", container : 'code'},
      {datetime : "2023-04-30T17:37:00", container : 'datascience'},
      {datetime : "2023-04-23T19:17:00", container : 'code'},
    ]
  })
})

app.get('/user/:userID/usage-statistics', (req, res) => {
  res.json({
    usage : [
      ["Container", "Number of Runs"],
      ["code",  12],
      ["datascience", 16],
      ["tensorflow", 7],
    ]
  })
})

app.get('/stat/all-usage-stat', (req, res) => {
  res.json( { msg : 'OK', data : 
    [
      ["Container", "Number of Runs"],
      ["code", 45],
      ['datascience', 39],
      ["tensorflow", 17]
    ]
  })
})

app.post('/user/:userId/send', (req, res) => {
  /* curl -X POST -H 'Content-type: application/json' 
     --data '{"text":"Hello, World!"}' 
     https://hooks.slack.com/services/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 */

  axios.post('https://hooks.slack.com/services/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', 
    { text : `[${req.params.userId}] ${req.body.text}`}).then(r => console.log(r.data));
  res.sendStatus(200);
})

app.get('/notice', (req, res) => {
  res.json([
    {title: "중요 공지 사항", message : "매일 오전 4시에 모든 노트북 서버가 Reset됩니다. Reset 되기 전에 변경사항을 저장해야 합니다."}
  ])
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
