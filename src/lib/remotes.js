import { http } from '@lib/utils/http';
import config from './config';

const BLOG_URL = config.BLOG_URL;
const PROD = config.PROD;
const START = config.START;
const STOP = config.STOP;

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
export function getAllPosts(page = 0) {
  return http.get(
    page === 0
      ? `${BLOG_URL}/page-data/index/page-data.json`
      : `${BLOG_URL}/page-data/pages/${page + 1}/page-data.json`,
  );
}

/**
 * @iMUngHee
 * @description 블로그 태그 글 API
 * @method GET
 * @param {string} tag
 * @returns {object}
 */
export function getPostsByTag(tag) {
  return http.get(`${BLOG_URL}/page-data/tags/${tag}/page-data.json`);
}

/**
 * * 컨테이너 API
 * 1. 컨테이너 정보 API
 * 2. 컨테이너 시작 API
 * 3. 컨테이너 윈도우 API
 * 4. 컨테이너 정지 API
 */
/**
 * @iMUngHee
 * @description 컨테이너 정보 API
 * @method GET
 * @param {string} userID
 * @returns {object}
 */
export function getNotebooks(userID) {
  return http.get(`/user/${userID}`);
}

/**
 * @iMUngHee
 * @description 컨테이너 시작 API
 * @method POST
 * @param {string} userID
 * @param {string} notebookName
 * @returns {object}
 */
export function startNotebook(userID, notebookName) {
  return http.post(`/user/${userID}/notebook`, {
    action: START,
    notebookKind: notebookName,
  });
}

/**
 * @iMUngHee
 * @description 컨테이너 윈도우 API
 * @method POST
 * @param {string} userID
 * @param {string} kind
 * @returns {object}
 */
export function statusNotebook(userID, kind) {
  return http.get(`/user/${userID}/notebook/${kind}`);
}

/**
 * @iMUngHee
 * @description 컨테이너 정지 API
 * @method POST
 * @param {string} userID
 * @param {string} notebookName
 * @returns {object}
 */
export function stopNotebook(userID, notebookName) {
  return http.post(`/user/${userID}/notebook`, {
    action: STOP,
    notebookKind: notebookName,
  });
}

/**
 * * 계정 API
 * 1. 로그인 API
 * 2. 회원가입 API
 * 3. 로그아웃 API
 */
/**
 * @iMUngHee
 * @description 로그인 API
 * @method POST
 * @param {string} email
 * @param {'Google' | 'Dev'} signInMode
 * @returns {object}
 */
export function login(email, signInMode = PROD) {
  return http.post('/login', {
    loginType: signInMode === PROD && PROD,
    email,
  });
}

/**
 * @iMUngHee
 * @description 회원가입 API
 * @method POST
 * @param {string} email
 * @param {'Google' | 'Dev'} signInMode
 * @returns {object}
 */
export function register(data, signInMode = PROD) {
  return http.post('/user', {
    loginType: signInMode === PROD && PROD,
    data,
  });
}

/**
 * @iMUngHee
 * @description 로그아웃 API
 * @method GET
 * @returns {object}
 */
export function logout() {
  return http.get('/logout');
}
