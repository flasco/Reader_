
import axios from 'axios';

const ServerIp = 'https://testdb.leanapp.cn';

export async function content(url) {
  return await axios.get(`${ServerIp}/Analy_x?action=2&url=${url}`);
}

export async function list(url) {
  return await axios.get(`${ServerIp}/Analy_x?action=1&url=${url}`);
}

export async function rnk(page) {
  return await axios.get(`${ServerIp}/rnklist?p=${page}`);
}