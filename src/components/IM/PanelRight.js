import React, { useState, useRef } from 'react';
import { findDOMNode } from 'react-dom';
import { Menu, Icon, Dropdown, Input, Button, Avatar, Tooltip, Modal, Switch, Upload, Spin, message, Popconfirm } from 'antd';
import 'react-virtualized/styles.css';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import VirtualizedList from 'react-virtualized/dist/commonjs/List';
import { CellMeasurer } from 'react-virtualized/dist/commonjs/CellMeasurer';
import dayjs from 'dayjs';
import styles from './PanelRight.less';

const uploadProps = {
  action: '//jsonplaceholder.typicode.com/posts/',
  listType: 'picture',
};

const handleClickMenu = (onChange, eventKey, type, id, value, showSettingGroup, showInviteNewMember) => {
  if (onChange && eventKey === 'changeDisturbing') onChange(eventKey, { type: type, id: id, value: value })
  if (onChange && eventKey === 'inviteNewMember') showInviteNewMember(true);
  if (eventKey === 'settingGroup') showSettingGroup(true);
};

const handleSendInput = (inputRef, inputValues, type, id, onChange, sendCallBack) => {
  if (onChange) onChange('sendInput', { type: type, id: id, value: inputRef.value, sendCallBack: sendCallBack });
  inputRef.value = '';
  inputRef.style.height = '31px';
  inputValues.current[`${type}-${id}`] = '';
};

const handleReSend = (chatData, index, value, type, id, onChange, sendCallBack) => {
  chatData[type][id].data.splice(index, 1);
  if (onChange) onChange('sendInput', { type: type, id: id, value: value, sendCallBack: sendCallBack });
};

const handleClickHeadIcon = (eventKey, onChange, type, id, value) => {
  if (onChange && eventKey === 'closeWindow') onChange(eventKey);
  else if (onChange && eventKey !== 'closeWindow' && eventKey !== 'changeGroupName') showConfirm(eventKey, onChange, type, id);
  else if (onChange && eventKey === 'changeGroupName') onChange(eventKey, { type: type, id: id, value: value });
};

function showConfirm(eventKey, onChange, type, id) {
  Modal.confirm({
    title: `是否确认${eventKey === 'quitGroup' ? '退出' : '删除'}群组?`,
    content: eventKey === 'quitGroup' ? '退出群组后，拥有者将移交给下一位群组成员' : '一旦你删除了群组，包括群组聊天在内的所有与群组相关的信息将会被永久删除，这是一个不可恢复的操作，请谨慎对待！',
    onOk() {
      onChange(eventKey, { type: type, id: id } );
    },
  });
}


const getTime = (date, time) => {
  let diffTime;
  if (dayjs(time).diff(date, 'second') < 60) diffTime = '几秒前';
  else if (dayjs(time).diff(date, 'minute') < 60) diffTime = `${dayjs(time).diff(date, 'minute')}分钟前`;
  else if (dayjs(time).diff(date, 'hour') < 24) diffTime = `${dayjs(time).diff(date, 'hour')}小时前`;
  else diffTime = dayjs(date).format('YYYY年M月D日H:m');
  return diffTime;
};

const PanelRight = props => {
  const { 
    loginUserData,
    chatUserData,
    chatData,
    selectedChat,
    measureCache,
    inputRef,
    inputValues,
    chatListRef,
    settingGroup,
    showSettingGroup,
    time,
    onChange
  } = props;
  const [inviteNewMember, showInviteNewMember] = useState(false);
  const [invitedMembers, setInvitedMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const groupNameInput = useRef(null);

  const sendCallBack = status => {
    if(status === 'success');
    else if(status === 'failed') message.error('消息发送失败，请检查网络连接！', 3);
  };

  const handleLoadMore = scrollInfo => {
    if (selectedChat && onChange && scrollInfo.scrollTop === 0) {
      const preDataLength = chatData[selectedChat.type][selectedChat.id].data.length;
      setLoading(true);
      onChange('loadMore', { 
        type: selectedChat.type, 
        id: selectedChat.id, 
        loadCallBack: (status) => {
          if (status === 'success') {
            const newDataLength = chatData[selectedChat.type][selectedChat.id].data.length;
            setLoading(false); 
            measureCache.current.clearAll();
            chatListRef.current.recomputeRowHeights(0);
            chatListRef.current.scrollToRow(newDataLength - preDataLength + 1);
          } else if(status === 'failed') {
            setLoading(false); 
            message.error('加载历史记录失败，请检查网络连接！', 3);
          }
        }
      });
    }
  };

  const menu = (
    <Menu onClick={e => handleClickMenu(onChange, e.key, selectedChat.type, selectedChat.id, undefined, showSettingGroup, showInviteNewMember)}>
      <Menu.Item key="settingGroup">
        <Icon type="appstore" />
        查看群组详情
      </Menu.Item>
      <Menu.Item key="changeDisturbing" className={styles.meunDisable} disabled>
        <Icon type="info" />
        消息免打扰
        <Switch defaultChecked={false} size="small" onChange={value => handleClickMenu(onChange, 'changeDisturbing', selectedChat.type, selectedChat.id, value)}/>
      </Menu.Item>
      <Menu.Item key="inviteNewMember">
        <Icon type="plus" />
        邀请新成员
      </Menu.Item>
    </Menu>
  );

  const renderChatItem = props => {
    const { index, key, parent, style } = props;
    const data = chatData[selectedChat.type][selectedChat.id].data[index];
    return (
      <CellMeasurer
        key={`${selectedChat.type}-${selectedChat.id}-${key}`}
        cache={measureCache.current}
        parent={parent}
        rowIndex={index}
        columnIndex={0}
      >
        <div
          className={`${styles.chartItem} ${
            data.user === loginUserData.user ? styles.own : styles.others
          }`}
          style={style}
        >
          <Avatar className={styles.avatar}>
            {data.user === loginUserData.user ? loginUserData.avatar: chatUserData[data.user].avatar}
          </Avatar>
          <div>
            <div className={styles.text}>
              <pre>{data.content}</pre>
              {data.loading && <Icon type="loading" className={styles.sendingIcon} />}
              {data.failed &&
                <Popconfirm
                  icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                  title="是否重新发送该条消息？"
                  okText="是"
                  cancelText="否"
                  onConfirm={() => handleReSend(chatData, index, data.content, selectedChat.type, selectedChat.id, onChange, sendCallBack)}
                >
                  <Icon type="exclamation" className={`${styles.sendingIcon} ${styles.failed}`} />
                </Popconfirm>
              }
            </div>
            <time className={styles.time}>{getTime(data.date, time)}</time>
          </div>
        </div>
      </CellMeasurer>
    );
  };

  return (
    <div className={styles.panelRight}>
      <div className={`${styles.panelRightHeader} ${!selectedChat ? styles.noSelect : ''}`}>
        {selectedChat && settingGroup && 
          <Icon
            className={styles.backSettingIcon} 
            type="left" 
            onClick={() => {
              showSettingGroup(false);
              if (findDOMNode(groupNameInput.current).value !== chatData[selectedChat.type][selectedChat.id].name)
                handleClickHeadIcon('changeGroupName', onChange, selectedChat.type, selectedChat.id, findDOMNode(groupNameInput.current).value);
            }} 
          />
        }
        {selectedChat && !settingGroup && <span>{selectedChat.id}</span>}
        {selectedChat && settingGroup && <span className={styles.settingGroup}>群组设置</span>}
        <div className={styles.iconGroup}>
          {selectedChat  && !settingGroup && selectedChat.type !== 'private' && (
            <Dropdown overlay={menu} placement="bottomCenter" trigger={['click']}>
              <Icon type="ellipsis" />
            </Dropdown>
          )}
          {selectedChat  && settingGroup &&
            <Tooltip placement='top' title='退出群组'　>
              <Icon type="logout" onClick={() => handleClickHeadIcon('quitGroup', onChange, selectedChat.type, selectedChat.id)} />
            </Tooltip>
          }
          {selectedChat  && settingGroup &&
            <Tooltip placement='top' title='删除群组'　>
              <Icon type="delete" onClick={() => handleClickHeadIcon('deleteGroup', onChange, selectedChat.type, selectedChat.id)} />
            </Tooltip>
          }
          <Icon type="close" onClick={() => {
              if (settingGroup && findDOMNode(groupNameInput.current).value !== chatData[selectedChat.type][selectedChat.id].name)
                handleClickHeadIcon('changeGroupName', onChange, selectedChat.type, selectedChat.id, findDOMNode(groupNameInput.current).value);
              handleClickHeadIcon('closeWindow', onChange);
            }} 
          />
        </div>
      </div>
      <Spin className={styles.spin} spinning={loading} delay={50} />
      <div className={styles.chartList}>
        <AutoSizer>
          {({ width, height }) => {
            return (
              <VirtualizedList
                ref={chatListRef}
                width={width}
                height={height} // Object.values(heights).reduce((preHeights, curHeight) => preHeights + curHeight, 0)
                overscanRowCount={10}
                rowCount={selectedChat ? chatData[selectedChat.type][selectedChat.id].data.length : 0}
                rowRenderer={renderChatItem}
                deferredMeasurementCache={measureCache.current}
                rowHeight={measureCache.current.rowHeight}
                onScroll={handleLoadMore}
              />
            );
          }}
        </AutoSizer>
      </div>
      {selectedChat && (
        <div className={styles.inputArea}>
          <div>
            <Upload {...uploadProps} showUploadList={false}>
              <Button size="small">
                <Icon type="upload" />附件
              </Button>
            </Upload>
            <Tooltip placement='bottom' title='Ctrl+Enter发送消息' >
              <Button
                type="primary"
                size="small"
                onClick={() => inputRef.current.textAreaRef.value && handleSendInput(inputRef.current.textAreaRef, inputValues, selectedChat.type, selectedChat.id, onChange, sendCallBack)}>
                发送
              </Button>
            </Tooltip>
          </div>
          <Input.TextArea
            ref={inputRef}
            defaultValue=""
            autosize={{ minRows: 1, maxRows: 12 }}
            onChange={e => inputValues.current[`${selectedChat.type}-${selectedChat.id}`] = e.target.value}
            onKeyDown={e => e.ctrlKey && e.keyCode === 13 && inputRef.current.textAreaRef.value && handleSendInput(inputRef.current.textAreaRef, inputValues, selectedChat.type, selectedChat.id, onChange, sendCallBack)}
          />
        </div>
      )}
      {!selectedChat && <Icon className={styles.noSelectChatIcon}type="wechat" />}
      {!selectedChat && <span className={styles.noSelectChatText}>暂时没有消息</span>}
      {settingGroup && 
        <div className={styles.settingGroup}>
          <div>
            <span>群组名称</span>
            <Input ref={groupNameInput} placeholder="请输入群组名称" defaultValue={chatData[selectedChat.type][selectedChat.id].name} />
          </div>
          <div>
            <span>群组成员</span>
            <div className={`${styles.user} ${styles.invite}`} onClick={() => showInviteNewMember(true)} >
              <Avatar className={styles.avatar} size="small" icon="plus" />
              添加新成员
            </div>
            {chatData[selectedChat.type][selectedChat.id].users.map(user =>
              <div key={user} className={styles.user}>
                <Avatar className={styles.avatar} size="small" >
                  {user === loginUserData.user ? loginUserData.avatar: chatUserData[user].avatar}
                </Avatar>
                {user}
              </div>
            )}
          </div>
        </div>
      }
    </div>
  );
};

export default PanelRight;
