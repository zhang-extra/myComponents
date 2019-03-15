/** @format */

import React, { memo, useState, useEffect, useRef } from 'react';
import { Popconfirm, Tooltip, Table } from 'antd';
import DrTable from '../components/DrTable';
import styles from './TablePage.less';
import { getData } from '../lib/utils';

const init = (props, info, setLoading) => {
  const [table, setTable] = useState({ dataSource: null, columns: null, pageSize: 20, schema: null, scrollX: 0 });
  useEffect(() => {
    if (!info.isInit.current) {
      getData('/api/class/pers_employee', { page: 1, pageSize: table.pageSize }).then(({ error, data }) => {
        const columns = [];
        for (let prop in data.rows[0]) {
          columns.push({ key: prop, title: prop, dataIndex: prop });
        }
        data.rows.map(row => (row.key = row.id));
        table.dataSource = data.rows;
        table.columns = columns;
        setTable(table);
      });
      setLoading(false);
      info.isInit.current = true;
    }
  });
  return table;
};

const handleDelete = (key) => {
  console.log(key);
};

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
};

const TablePage = props => {
  const info = { isInit: useRef(false), calWidth: useRef(null) };
  const [loading, setLoading] = useState(true);
  const { dataSource, columns, pageSize, scrollX } = init(props, info, setLoading);
  return (
    <div className={styles.tablePageWrapper}>
      <DrTable
        className={styles.table}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        rowSelection={rowSelection}
        loading={loading}
        extraOptions={{
          lazyload: false,
          fixItem: [2, 0], // numbers of left, right
          tableHeight: 700,
          cellOptions: { 
            cellHeight: 60,
            align: 'center',
            titleAlign: 'center',
            specialCell: { 
              id: {
                width: 80,
                align: 'left',
              }, 
              name: {
                width: 120,
                align: 'center',
              }, 
              yearold: {
                width: 60,
                align: 'right',
              },
              birthday: {
                width: 120,
                align: 'left',
                type: 'ellipsis-tip', // 'ellipsis', 'ellipsis-tip', 'wrap'
              }, 
            } 
          }, 
        }}
      />
    </div>
  );
};

export default TablePage;
