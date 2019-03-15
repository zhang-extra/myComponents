import {get,post} from './request';
import isArray from 'lodash/isArray';

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDA5NiwiYXBwSWQiOiJkZWZhdWx0IiwibmFtZSI6ImRhcmVuIiwiZXhwIjoxNTQ5MDI5MjM2LCJpYXQiOjE1NDY0MzcyMzZ9.6U7w1JRDFqhCXnhpK3L3qf7t3kmoIVavPNKY-8gkAHg";

/**
 *解析错误信息
 * @export
 * @param {*} error
 * @returns
 */
export function parseError(error) {
  if (isArray(error)) {
    return error.join(';');
  }
  return error;
}

/**
 * 解析api响应结果,按约定的格式返回
 * @export
 * @param {*} resp
 * @returns
 */
export function parseResponse(resp) {
  const { success, data, error, errors } = resp || {};
  if (success !== true) {
    if (errors) {
      return { result: null, error: parseError(errors) };
    }
    return { result: null, error };
  }
  return { data, error };
}

/**
 * 重载的平台get，封装了登录认证Token
 *
 * @export
 * @param {string} url
 * @param {mixed} params
 * @returns
 */
export async function getData(url: string, params: mixed) { 
  return get(url, params, { authorization: `Token ${token}` });
}

/**
 * 重载的平台post，封装了登录认证Token
 *
 * @export
 * @param {string} url
 * @param {mixed} params
 * @returns
 */
export async function postData(url: string, body: mixed, method?: string, formData?: boolean) {
   return post(url, body, { authorization: `Token ${token}` }, method, formData);
}