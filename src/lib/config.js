
const config = {
    notebook_list : [
        'jupyter/minimal-notebook', 
        'jupyter/r-notebook',
        'jupyter/scipy-notebook',
        'jupyter/datascience-notebook',
        'jupyter/tensorflow-notebook',
    ],
    /*
    notebookName : {
        // 'jupyter/datascience-notebook' : 'Data Science Notebook',
        // 'wetty' : 'Web Terminal',
        // 'jupyter/tensorflow-notebook' : 'Tebsorflow Notebook',
        'datascience' : 'Data Science Notebook',
        'term' : 'Web Terminal',
        'tensorflow' : 'Tensorflow Notebook',
    },
    */

    dept_list : [
        "소프트웨어학과",
        "인공지능융합학과",
        '사이버보안학과',
        '미디어학과',
        '국방디지털융합학과',
        '기타',
    ],

    roleMapping : {
        "O" : "교수",
        "S" : "조교",
        "U" : "학생",
    },

    statusMapping : {
        OK : '가입',
        pending : '가입 대기중'
    },

    HOST_DOMAIN : 'ajou.ac.kr',
    
    // AjouPyterHub 블로그
    BLOG_URL : 'http://ajoupyterhub.ajousw.kr',

    // 런타임 타입
    PROD : 'Google',
    DEV : 'dev',

    // 컨테이너 상태
    START : 'start',
    STOP : 'stop',

    // 계정 모드
    SIGN_IN : 'signin',
    SIGN_UP : 'signup',
}

export default config;