import Axios from 'axios';
const axios = Axios.create();

export const http = {
  get: function get(url) {
    return axios.get(url).then((res) => res.data);
  },
  post: function post(url, data) {
    return axios.post(url, { data }).then((res) => res.data);
  },
  put: function put(url, data) {
    return axios.put(url, { data }).then((res) => res.data);
  },
};

export async function googleAPI(token) {
  return await axios({
    url: 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
    headers: {
      Authorization: `${token.token_type} ${token.access_token}`,
    },
  });
}
