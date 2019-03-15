import React, { useState } from 'react';
import { Menu, Icon, Dropdown, List, Avatar, Badge, Input } from 'antd';
import styles from './PanelLeft.less';

const handleClickMenu = (event, onChange) => {
  if (onChange) onChange(event.key)
};

const handleDeleteChat = (type, id, showChat, onChange) => {
  if (onChange) onChange('deleteShowChat', showChat.findIndex(chat => chat.type === type && chat.id === id));
}

const handleReadChat = (isSelected, e, type, id, chatData, inputRef, inputValues, setSelectedChat, onChange, showSettingGroup, measureCache, chatListRef) => {
  if (!isSelected && typeof e.target.className === 'string') {
    if (onChange) onChange('readChat', { type: type, id: id });
    if (inputRef.current) inputRef.current.textAreaRef.value = inputValues.current[`${type}-${id}`] || '';
    showSettingGroup(false);
    setSelectedChat({ type: type, id: id });
    setTimeout(() => {
      measureCache.current.clearAll();
      chatListRef.current.recomputeRowHeights();
      chatListRef.current.scrollToRow(chatData[type][id].data.length + 1);
    }, 0);
  }
};

const handleOpenChat = (setOpenChat, type, id, onChange) => {
  if (onChange) onChange('openChat', { type: type, id: id });
  setOpenChat(false);
};

const PanelLeft = props => {
  const {
    loginUserData,
    chatUserData,
    chatData,
    selectedChat,
    setSelectedChat,
    inputRef,
    inputValues,
    showSettingGroup,
    measureCache,
    chatListRef,
    onChange,
  } = props;
  const [openChat, setOpenChat] = useState(false);
  const [currentChatGroup, setCurrentChatGroup] = useState((Object.entries(chatData)[0][0]));
  const [searchRule, setSearchRule] = useState('');

  const menu = (
    <Menu onClick={e => handleClickMenu(e, onChange)}>
      <Menu.Item key="addChatGroup-Group">
        <Icon type="team" />
        新建群组聊天
      </Menu.Item>
      <Menu.Item key="clearUnread">
        <Icon type="check" />
        标记全部已读
      </Menu.Item>
      <Menu.Item key="clearReaded">
        <Icon type="delete" />
        清空已读消息
      </Menu.Item>
    </Menu>
  );

  const ListItem = props => {
    let id, type, value;
    let users, name, avatar, description;
    if (!openChat) {
      id = props.id;
      type = props.type;
    } else {
      [id, value] = props;
      type = currentChatGroup;
      users = value.users;
      name = value.name;
      avatar = value.avatar;
      description = value.description;
    }
    const isSelected = selectedChat && id === selectedChat.id && type === selectedChat.type;

    return (
      <List.Item
        className={`${styles.listItem} ${ isSelected ? styles.selected : ''}`}
        actions={!openChat && [
          <Icon className={styles.close} type="close" onClick={() => handleDeleteChat(type, id, loginUserData.showChat, onChange)} />,
        ]}
        onClick={e => !openChat ? 
            handleReadChat(isSelected, e, type, id, chatData, inputRef, inputValues, setSelectedChat, onChange, showSettingGroup, measureCache, chatListRef) :
              handleOpenChat(setOpenChat, currentChatGroup, id, onChange)
          }
      >
        <List.Item.Meta
          className={styles.listItemMeta}
          avatar={
            <Badge count={!openChat ? chatData[type][id].unreadCount : 0} >
              <Avatar>
                {!openChat ? type === 'private' ? chatUserData[id].avatar : chatData[type][id].avatar : 
                  currentChatGroup === 'private' ? chatUserData[users.filter(user => user !== loginUserData.user)[0]].avatar : avatar
                }
              </Avatar>
            </Badge>
          }
          title={!openChat ? type === 'private' ? id : chatData[type][id].name : 
            type === 'private' ? users.filter(user => user !== loginUserData.user)[0] : name
          }
          description={
            <pre className={styles.description}>
              {!openChat ? chatData[type][id].data.slice(-1)[0].content : 
                  currentChatGroup === 'private' ? chatUserData[users.filter(user => user !== loginUserData.user)[0]].description : description
              }
            </pre>
          }
        />
      </List.Item>
    );
  };

  return (
    <div className={styles.panelLeft}>
      <div className={`${styles.panelLeftHeader} ${openChat ? styles.openChat : ''}`}>
        <Icon type={openChat ? 'left' : 'contacts'} onClick={() => setOpenChat(preState => !preState)} />
        {openChat && <span>发起聊天</span>}
        <Dropdown overlay={menu} placement="bottomCenter" trigger={['click']} disabled={openChat} >
          <Icon type="ellipsis" />
        </Dropdown>
      </div>
      {openChat &&
        <Input.Search
          className={styles.search}
          placeholder={`搜索 ${currentChatGroup}`}
          value={searchRule}
          onChange={e => setSearchRule(e.target.value)}
        />
      }
      {openChat &&
        <div className={styles.tabs}>
          {Object.entries(chatData).map(([tabKey,_]) => 
            <a
              key={tabKey}
              className={`${styles.tabItem} ${currentChatGroup === tabKey ? styles.current : ''}`}
              onClick={() => setCurrentChatGroup(tabKey)}
            >
              {tabKey}
            </a>
          )}
        </div>
      }
      <List
        className={styles.list}
        itemLayout="horizontal"
        dataSource={!openChat ? loginUserData.showChat : Object.entries(chatData[currentChatGroup]).filter(chat => (currentChatGroup === 'private' ? chat[0] : chat[1].name).indexOf(searchRule) !== -1)}
        renderItem={ListItem}
        size="large"
        locale={{ emptyText: `${!openChat ? '目前暂无消息' : `目前暂无${currentChatGroup}`}` }}
        split={false}
      />
    </div>
  );
};

export default PanelLeft;
