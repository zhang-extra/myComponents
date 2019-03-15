/** @format */

import React, { memo, useRef, useState } from 'react';
import { Table, Tooltip } from 'antd';
import PropTypes from 'prop-types';
import LazyLoad from 'react-lazyload';
import cloneDeep from 'lodash/cloneDeep';
import styles from './index.less';

const getComponent = (lazyload, cellHeight = 60, titleAlign = 'center') => {
  return {
    table: props => <table {...props} />,
    header: {
      wrapper: props => <thead {...props} />,
      row: props => <tr {...props} />,
      cell: props => (
        <th style={{ height: `${cellHeight}px`, padding: 0, textAlign: titleAlign }} {...props} /> // , textAlign: 'center'
      ),
    },
    body: {
      wrapper: props => <tbody {...props} />,
      row: props =>
        !lazyload ? (
          <tr style={{ height: `${cellHeight}px` }} {...props} />
        ) : (
          <LazyLoad
            overflow
            once
            height={cellHeight}
            // throttle={222}
            placeholder={
              <tr>
                <td>
                  <div />
                </td>
              </tr>
            }
          >
            <tr {...props} />
          </LazyLoad>
        ),
      cell: props => <td style={{ height: `${cellHeight}px`, padding: 0 }} {...props} />
    },
  };
};

const getWidth = (prop, widthMap, calcPlaceholder) => {
  let maxLength = 0,
    propLength = 0;
  if (widthMap[prop]) {
    calcPlaceholder.innerHTML = widthMap[prop];
    propLength = calcPlaceholder.offsetWidth;
    if (maxLength < propLength) maxLength = propLength;
  }
  calcPlaceholder.innerHTML = prop;
  propLength = calcPlaceholder.offsetWidth;
  if (maxLength < propLength) maxLength = propLength;
  return maxLength + 24;
};

const calcWidth = (dataSource, columns, extraOptions, tableInfo) => {
  const { cellOptions } = extraOptions;
  const usedColumns = cloneDeep(columns);
  const usedDataSource = dataSource;
  let fixItem = extraOptions.fixItem || [0, 0];
  for (let i = 0; i < fixItem[0]; i += 1) usedColumns[i].fixed = 'left';
  for (let i = usedColumns.length - 1, length = usedColumns.length - 1 - fixItem[1];i > length;i -= 1) usedColumns[i].fixed = 'right';
  const widthMap = {};
  for (let i = 0, length = usedDataSource.length; i < length; i += 1) {
    for (let prop in usedDataSource[i]) {
      if (usedDataSource[i][prop] !== null) {
        if (
          !widthMap[prop] ||
          (typeof usedDataSource[i][prop] === 'number' &&
            usedDataSource[i][prop] > widthMap[prop]) ||
          (typeof usedDataSource[i][prop] === 'string' &&
            usedDataSource[i][prop].replace(/ /g, '').length >
              widthMap[prop].replace(/ /g, '').length)
        )
          widthMap[prop] = usedDataSource[i][prop];
      }
    }
  }
  for (let i = 0, length = usedColumns.length; i < length; i += 1) {
    const specialOption = cellOptions.specialCell && cellOptions.specialCell[usedColumns[i].title] ? cellOptions.specialCell[usedColumns[i].title] : null;
    const align =  specialOption ? specialOption.align === 'left' ? 'flex-start' : specialOption.align === 'right' ? 'flex-end' : 'center': 'center';
    usedColumns[i].width = (specialOption && specialOption.width)
      || getWidth(usedColumns[i].title, widthMap, tableInfo.calcPlaceholder.current);
    tableInfo.scroll.x += usedColumns[i].width;
    if (!usedColumns[i].render) {
      usedColumns[i].render = text => (
        <div
          className={`${styles.customTd} ${specialOption && specialOption.type ? specialOption.type.indexOf('ellipsis') !== -1? styles.ellipsis : styles.wrap : ''}`}
          style={{
            height: `${cellOptions.cellHeight}px`,
            lineHeight: specialOption && specialOption.type && specialOption.type.indexOf('ellipsis') !== -1 ? `${cellOptions.cellHeight}px` : '',
            justifyContent: align,
            textAlign: specialOption && specialOption.type && specialOption.type.indexOf('ellipsis') !== -1 ? specialOption.align || 'center' : 'center',
          }}
        >
          {specialOption && specialOption.type === 'ellipsis-tip' &&
            <Tooltip placement="top" title={text}>
              {text}
            </Tooltip>
          }
          {text}
        </div>)
    }
  }
  return [usedDataSource, usedColumns, tableInfo.scroll];
};

const DrTable = ({ className, extraOptions, dataSource, columns, ...props }) => {
  const { lazyload, cellOptions, tableHeight } = extraOptions;
  const tableInfo = { calcPlaceholder: useRef(null), scroll: { x: 0, y: tableHeight } };
  let usedDataSource = null;
  let usedColumns = null;
  let components = null;
  if (dataSource && columns && cellOptions && extraOptions) {
    [usedDataSource, usedColumns, scroll] = calcWidth(
      dataSource,
      columns,
      extraOptions,
      tableInfo,
    );
    components = getComponent(lazyload, cellOptions.cellHeight, cellOptions.titleAlign);
  }
  
  return [
    <div
      key="calcPlaceholder"
      className={styles.calcPlaceholder}
      ref={tableInfo.calcPlaceholder}
    />,
    <Table
      key="table"
      className={`${className} ${styles.drTable}`}
      dataSource={usedDataSource || []}
      columns={usedColumns || []}
      components={components || undefined}
      scroll={typeof scroll === 'function' ? {} : scroll}
      {...props}
    />
  ];
};

DrTable.PropTypes = {
  extraOptions: PropTypes.object.isRequired,
};

export default memo(DrTable);
