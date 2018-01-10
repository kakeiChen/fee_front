import 'whatwg-fetch';
import { getBaseUrl } from '../util';

const decorateParams = (params = {}) => { // compatible with the param like "foo: {value: 'xxx', ...}"
  const res = {};
  const keys = Object.keys(params);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const param = params[key];
    let value = typeof param === 'object' && // fields is a object perhaps
    !(param instanceof Array) && // not array
    !(param._d) // not moment
      ? ((param.value && param.value.trim && param.value.trim()) || param.value) : param;

    if (value instanceof Array && value.length === 2) { // dateRange, datetimeRange, numberRange
      if (param.type === 'datetimeRange' || param.type === 'numberRange') {
        res[`${key}Start`] = value[0] || undefined;
        res[`${key}End`] = value[1] || undefined;
      } else if (param.type === 'dateRange') {
        res[`${key}Start`] = value[0].format('YYYY-MM-DD 00:00:00');
        res[`${key}End`] = value[1].format('YYYY-MM-DD 23:59:59');
      } else {
        res[key] = value;
      }
    } else {
      if (/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}$/.test(value)) { // fix time string to second
        value += ':00';
      }
      res[key] = typeof value === 'undefined' ? '' : ((value && value.trim && value.trim()) || value);
    }
  }
  return res;
};

export default (url, params = {}, opts = {}) => {
  const defaultOpts = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      // Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MTI0NjA5MjAsImp0aSI6IjY' +
      // '5NDhkNzI5ZTk2YTQwZTE5ZTM3MTYxNzVjYzZlYzlmIn0.1EOuBRaywivrrhDfEExyxwHBS3y8iK9xh1MBbSng4aw',
    },
  };

  const newOpts = {
    ...defaultOpts,
    ...opts,
  };

  if (newOpts.method === 'POST') {
    newOpts.body = JSON.stringify(decorateParams(params));
  }
  document.querySelector('#overlay').style.display = 'block';
  return fetch(url.indexOf('//') > -1 ? url : (getBaseUrl() + url), newOpts)
    .then((res) => {
      document.querySelector('#overlay').style.display = 'none';
      // console.log(res);
      // if (res.status < 200 || res.status >= 300) {
      //   location.assign('/Error'); // go to error page
      //   return {
      //     resultCode: '-1',
      //     resultDesc: `${res.status} ${res.statusText}`,
      //   };
      // }
      const contentType = res.headers.get('content-type');
      if (contentType.indexOf('application/json') > -1) {
        return res.json();
      }
      return res.blob();
    })
    .then((json) => {
      if (json.type) { // blob
        return json;
      }
      if (json.resultCode === '0004' || json.resultCode === '0002') { // 登录过期或未登录
        sessionStorage.setItem('accessToken', '');
        sessionStorage.setItem('user', '{}');
        location.assign('/SignIn');
      }
      return json;
    })
    .catch(() => {
      document.querySelector('#overlay').style.display = 'none';

      return {
        resultCode: '-1',
        resultDesc: '网络异常，请重试',
      };
    });
};
