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
        imageUrl : "https://lh3.googleusercontent.com/a-/AOh14GjZgcI_rLJUYPRn3pigCRzEths4_KAfl08-DfgYag=s96-c"
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
  res.json({status : 'running'})
})

app.post('/user/:userID/notebook', (req, res) => {
  let data = req.body; //.json();
  if (data.action == 'start') {
    res.json({status : "OK", passcode : '12345678' })
  } else {
    res.json({status : 'OK'})
  }
})

app.get('/user/:userID', (req, res) => {
  res.json([
    {   status: null,
        description: "For Python & R",
        notebookName: "datascience", 
        displayName: "Datascience Notebook", }, 

     {  status: null,
        description: "For Deep Learning (Coming Soon ... )",
        notebookName: "tensorflow", 
        displayName: "Tensorflow Notebook",
      }, 

     {  status: null,
        description: "Web Terminal",
        notebookName: "wetty", 
        displayName: "Web TTY Terminal", 
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
      notebookKind : "jupyter/minimal-notebook",
      role : "admin",
    },
    {
      groupID : "2",
      name : "인공지능 프로그래밍 기초",
      owner : "jyc",
      ownerName : '쟁쟁한',
      notebookKind : "jupyter/minimal-notebook",
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
    { id : "a", name : "홍길동",email : "jyc@jclab.org", dept: "소프트웨어학과", role: "A", status : "OK"},
    { id : "b", name : "모모",email : "jyc@jclab.org", dept: "SW", role: "U", status : "pending"},
    { id : "c", name : "제니",email : "jyc@jclab.org", dept: "소프트웨어학과", role: "U", status : "OK"},
    { id : "d", name : "학생1",email : "jyc@jclab.org", dept: "소프트웨어학과C", role: "U", status : "OK"},
    { id : "e", name : "학생2",email : "jyc@jclab.org", dept: "소프트웨어학과", role: "U", status : "OK"},    
    { id : "e1", name : "학생2",email : "jyc@jclab.org", dept: "소프트웨어학과", role: "U", status : "OK"},    
    { id : "e2", name : "학생2",email : "jyc@jclab.org", dept: "소프트웨어학과", role: "U", status : "OK"},    
    { id : "e3", name : "학생2",email : "jyc@jclab.org", dept: "소프트웨어학과", role: "U", status : "OK"},    
    { id : "e4", name : "학생2",email : "jyc@jclab.org", dept: "소프트웨어학과", role: "U", status : "OK"},    
    { id : "e5", name : "학생2",email : "jyc@jclab.org", dept: "소프트웨어학과", role: "U", status : "OK"},    
    { id : "e6", name : "학생2",email : "jyc@jclab.org", dept: "소프트웨어학과", role: "U", status : "OK"},    
    { id : "e7", name : "학생2",email : "jyc@jclab.org", dept: "소프트웨어학과", role: "U", status : "OK"},    
    { id : "e8", name : "학생2",email : "jyc@jclab.org", dept: "소프트웨어학과", role: "U", status : "OK"},    
    { id : "e9", name : "학생2",email : "jyc@jclab.org", dept: "소프트웨어학과", role: "U", status : "OK"},    
  ]})
})

app.post('/group/:groupID/members', (req, res) => {
  res.json({validated : 
    [{id : "f", name: "학생f", email : "f@ajou.ac.kr", dept : "CIA", role: "U"},
     {id : "a", name: "학생a", email : "a@ajou.ac.kr", dept : "CIA", role: "U"}]})
})

app.delete('/group/:groupID/members', (req, res) => {
  res.json({deleted : req.body.members})
})

app.put('/group/:groupID/members', (req, res) => {
  res.json({roleChangeFailed : [ 'a', 'b' ]})
})

app.get('/notice', (req, res) => {
  res.json([
    {title: "중요 공지 사항", message : "매일 오전 4시에 모든 노트북 서버가 Reset됩니다. Reset 되기 전에 변경사항을 저장해야 합니다."}
  ])
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
