import React, { memo } from 'react';
import { Avatar, Icon, Badge } from 'antd';
import 'react-virtualized/styles.css';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import VirtualizedList from 'react-virtualized/dist/commonjs/List';
import { getTime } from '../utils';
import styles from './List.less';

const handleRemoveChat = (event, onChange, target, index) => {
  if (!onChange) return;
  event.stopPropagation();
  onChange('removeChat', target, index);
}

const handleSponsorChat = (setLoading, setShowSetting, setInSponsor, onChange, target) => {
  if (!onChange) return;
  setLoading(true);
  setInSponsor(false);
  setShowSetting(false);
  onChange('sponsorChat', target);
}

const handleOpenChat = (setLoading, setShowSetting, onChange, target, curChatData, messageInputRef, inputedValues) => {
  if (!onChange || (curChatData && curChatData.group === target.group && curChatData.key === target.key)) return;
  if (messageInputRef.current) messageInputRef.current.textAreaRef.value = inputedValues.current[`${target.group}-${target.key}`] || '';
  setLoading(true);
  setShowSetting(false);
  onChange('openChat', target);
}

const List = props => {
  const { data, curGroup, curChatData, inSponsor, setInSponsor, timeNow, setShowSetting, messageInputRef, 
    inputedValues, setLoading, onChange } = props;
  if (!inSponsor && data.length === 0) return <span className={styles.noMessage}>暂时没有新消息</span>
  const renderItem = props => {
    const { index, key, style } = props;
    const { id, avatar, description, group, unreadCount, lastData } = data[index];
    return (
      <div
        key={key}
        className={`${styles.item} ${!inSponsor && curChatData && curChatData.group === group && curChatData.key === data[index].key ? styles.selected: ''}`}
        style={style}
        onClick={() => inSponsor ?
          handleSponsorChat(setLoading, setShowSetting, setInSponsor, onChange, { group: curGroup, key: data[index].key })
            : handleOpenChat(setLoading, setShowSetting, onChange, { group: group, key: data[index].key }, curChatData, messageInputRef, inputedValues, onChange)
        }
      >
      <Badge count={!inSponsor ? unreadCount : 0} >
        <Avatar size="large">{avatar}</Avatar>
      </Badge>
        <div className={styles.text}>
          <pre className={styles.id}>{id}</pre>
          <pre className={styles.description}>{inSponsor ? description : `${lastData.id}:${lastData.value}`}</pre>
        </div>
        {!inSponsor && <time className={styles.time}>{getTime(lastData.date, timeNow)}</time>}
        {!inSponsor && 
          <Icon
            className={styles.close}
            type="close"
            onClick={event => handleRemoveChat(event, onChange, { group, key: data[index].key }, index)}
          />
        }
      </div>
    );
  };

  return (
    <div className={styles.list}>
      <AutoSizer>
        {({ width, height }) => {
          return (
            <VirtualizedList
              width={width}
              height={height}
              overscanRowCount={10}
              rowCount={data.length}
              rowRenderer={renderItem}
              rowHeight={64}
            />
          );
        }}
      </AutoSizer>
    </div>
  );

};

export default memo(List);