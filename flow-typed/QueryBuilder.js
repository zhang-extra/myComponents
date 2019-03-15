// 查询条件的操作符
declare type QueryOperation = 'in' | 'between' | 'like' | 'null' | 'notNull' | '=' | '>' | '<' | '<=' | '>=';

// 查询条件
declare type QueryCondition = {
  name: string,
  op: QueryOperation,
  value: any; // 可以是数组，字符串、数字等,
  or: Array<QueryCondition>
};

declare type QueryType = 'and' | 'or';

declare type QueryConditions = {
  type: QueryType,
  conditions: Array<QueryCondition>
}; 

