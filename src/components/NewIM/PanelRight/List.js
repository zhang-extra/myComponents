import React, { memo } from 'react';
import { Avatar, Icon, Popconfirm } from 'antd';
import 'react-virtualized/styles.css';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import VirtualizedList from 'react-virtualized/dist/commonjs/List';
import { CellMeasurer } from 'react-virtualized/dist/commonjs/CellMeasurer';
import { getTime } from '../utils';
import styles from './List.less';

const handleReSend = (curChatData, index, value, onChange) => {
  curChatData.data.splice(index, 1);
  if (onChange) onChange('sendInput', { group: curChatData.group, key: curChatData.key }, value);
};

const List = props => {
  const { userData, curChatData, timeNow , chatListRef, measureCache, setLoading, onChange } = props;

  const handleLoadMore = scrollInfo => {
    if (curChatData && onChange && scrollInfo.scrollTop === 0) {
      setLoading(true);
      onChange('loadMore', { group: curChatData.group, key: curChatData.key });
    }
  };

  const renderItem = props => {
    const { index, key, parent, style } = props;
    const data = curChatData.data[index];
    return (
      <CellMeasurer
        key={key}
        cache={measureCache.current}
        parent={parent}
        rowIndex={index}
        columnIndex={0}
      >
        <div
          className={`${styles.item} ${
            data.user === userData.key ? styles.own : styles.others
          }`}
          style={style}
        >
          <Avatar className={styles.avatar}>
            {Object.entries(curChatData.users).filter(([userKey, _]) => String(userKey) === String(data.user))[0][1].avatar}
          </Avatar>
          <div>
            <div className={styles.text}>
              <pre>{data.value}</pre>
              {data.loading && <Icon type="loading" className={styles.sendingIcon} />}
              {data.failed &&
                <Popconfirm
                  icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                  title="是否重新发送该条消息？"
                  okText="是"
                  cancelText="否"
                  onConfirm={() => handleReSend(curChatData, index, data.value, onChange)}
                >
                  <Icon type="exclamation" className={`${styles.sendingIcon} ${styles.failed}`} />
                </Popconfirm>
              }
            </div>
            <time className={styles.time}>{getTime(data.date, timeNow)}</time>
          </div>
        </div>
      </CellMeasurer>
    );
  };

  return (
    <div className={styles.chartList}>
      <AutoSizer>
        {({ width, height }) => {
          return (
            <VirtualizedList
              ref={chatListRef}
              width={width}
              height={height}
              overscanRowCount={10}
              rowCount={curChatData ? curChatData.data.length : 0}
              rowRenderer={renderItem}
              deferredMeasurementCache={measureCache.current}
              rowHeight={measureCache.current.rowHeight}
              onScroll={handleLoadMore}
            />
          );
        }}
      </AutoSizer>
    </div>
  );

};

export default memo(List);