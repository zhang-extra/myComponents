import qs from 'query-string';
import isArray from 'lodash/isArray';
import isNumber from 'lodash/isNumber';
import omit from 'lodash/omit';

/**
 * react-router的location和match参数解析工具函数
 */

/**
 * 解析查询条件
 * @export
 * @param {any} { searchFields }
 * @param {any} { query, filter, search }
 * @returns
 */
export function parseWhere({ searchFields }, { query, filter, search }) {
  let where = [];
  if (query) {
    where = where.concat(JSON.parse(query));
  }
  if (filter) {
    where = where.concat(JSON.parse(filter));
  }
  if (search && searchFields) {
    if (searchFields) {
      if (isArray(searchFields)) {
        const or = [];
        searchFields.forEach((item) => {
          or.push({ name: item, op: 'like', value: search });
        });
        where.push({ or });
      } else {
        where.push({ name: searchFields, op: 'like', value: search });
      }
    }
  }
  return where;
}

/**
 * 解析match.params 参数
 * @export
 * @param {Object} match
 * @param {string} name
 * @param {*} defaultValue
 */
export function parseMatchParamValue(match: Object = {}, name: string, defaultValue: any) {
  const { params = {} } = match;
  const v = params[name] || defaultValue;
  if (isNumber(defaultValue)) {
    return parseFloat(v);
  }
  return v;
}

/**
 * location.search 参数
 * @export
 * @param {Object} props
 * @param {string} name
 * @param {*} defaultValue
 */
export function parseLocationSearchValue(location: Object = {}, name: string, defaultValue: any) {
  const q = qs.parse(location.search) || {};
  const v = q[name] || defaultValue;
  if (isNumber(defaultValue)) {
    return parseFloat(v);
  }
  return v;
}
