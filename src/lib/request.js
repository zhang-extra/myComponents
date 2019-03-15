// @flow
import fetch from 'dva/fetch';
import qs from 'query-string';

/**
 * 解析JSON数据
 * 
 * @param {Object} response 
 * @returns {Promise<ResponseResult>} 
 */
export async function parseJSON(response: Object) {
  const contentType = response.headers.get('content-type');
  let textType = contentType && contentType.includes('text/html');
  let jsonType = contentType && contentType.includes('application/json');
  let json: Object = {};
  let text: string = '';
  if (jsonType) {
    json = await response.json();
  } else if (textType) {
    text = await response.text();
  }
  if (!response.ok) {
    return { error: text || (json || {}).message, success: false };
  }
  if (json && json.hasOwnProperty('success')) {
    const { success, error, errors } = json;
    delete json.success;
    delete json.errors;
    delete json.error;
    return { success, error, errors, data: json };
  } else {
    return { success: true, error: '', data: json };
  }
}


/**
 * HTTP GET
 * 
 * @export
 * @param {string} url 
 * @param {mixed} params 
 * @param {mixed} headers 
 * @returns {Promise<ResponseResult>} 
 */
export async function get(url: string, params: mixed, headers: Object) {
  let url2 = url;
  if (params) {
    if (url.indexOf('?') === -1) {
      url2 = url + '?';
    }
    url2 += `&${qs.stringify(params)}`;
  }
  const response = await fetch(url2, {
    method: 'GET',
    headers,
    credentials: 'same-origin'
  });
  return parseJSON(response);
}


/**
 * HTTP POST/PUT/DELETE
 * 默认是POST,PUT等传入第3个参数
 * @export
 * @param {string} url 
 * @param {mixed} body 
 * @param {mixed} headers 
 * @param {string} [method] 
 * @returns {Promise<ResponseResult>} 
 */
export async function post(url: string, body: mixed, headers?: Object, method?: string, formData) {
  const headers2 = headers || {};
  if (!headers2.Accept) {
    headers2.Accept = 'application/json';
  }
  if (!formData) {
    if (!headers2['Content-Type']) {
      headers2['Content-Type'] = 'application/json';
    }
  }
  const response = await fetch(url, {
    method: method || 'POST',
    headers: headers2,
    credentials: 'same-origin',
    body: formData ? body : JSON.stringify(body)
  });
  return parseJSON(response);
}