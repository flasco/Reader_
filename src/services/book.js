
import axios from 'axios';

const ServerIp = 'https://testdb.leanapp.cn';

export async function content(url) {
  return await axios.get(`${ServerIp}/Analy_x?action=2&url=${url}`);
}

export async function list(url) {
  let { data } = await axios.get(`${ServerIp}/Analy_x?action=1&url=${url}`);
  let n = [], i = 0;
  while (i < data.length) {
    n.push({
      key: data[i].url,
      title: (data[i].title.length > 25 ? data[i].title.substr(0, 18) + '...' : data[i].title)
    });
    i++;
  }
  return n;
}

export async function rnk(page) {
  return await axios.get(`${ServerIp}/rnklist?p=${page}`);
}

export async function stay(hour = 6) {
  return await axios.get(`${ServerIp}/start?h=${hour}`);
}

export async function search(text) {
  return await axios.get(`${ServerIp}/sear?name=${text}`);
}