import React, { memo } from 'react';
import { findDOMNode } from 'react-dom';
import { Menu, Icon, Dropdown, Switch, Tooltip, Modal } from 'antd';
import styles from './Head.less';

const handleClickMenu =  (type, onChange, group, key, setShowSetting, setShowInviteNewMember, value) => {
  if (onChange && type === 'changeDisturbing') onChange(type, { group, key }, value)
  else if (onChange && type === 'inviteNewMember') setShowInviteNewMember(true);
  else if (type === 'showSetting') setShowSetting(true);
};

const handleClickHeadIcon = (setLoading, type, onChange, target, value, isOwner) => {
  if (!onChange) return;
  if (type === 'changeGroupId') {
    setLoading(true);
    onChange(type, target, value);
  } else if (type === 'closeWindow') onChange(type, target);
  else {
    setLoading(true)
    Modal.confirm({
      title: `是否确认${type === 'quitGroup' ? '退出' : '删除'}群组?`,
      content: type === 'quitGroup' ? `${isOwner ? '退出群组后，拥有者将移交给下一位群组成员' : '退出群组'}` : '一旦你删除了群组，包括群组聊天在内的所有与群组相关的信息将会被永久删除，这是一个不可恢复的操作，请谨慎对待！',
      onOk() {
        onChange(type, target );
      },
    });
  }
}

const Head = props => {
  const { userData, curChatData, groupIdInput, showSetting, setShowSetting, 
    setShowInviteNewMember, setLoading, onChange } = props;
  const menu = (
    <Menu onClick={e => handleClickMenu(e.key, onChange, curChatData.group, curChatData.key, setShowSetting, setShowInviteNewMember)}>
      <Menu.Item key="showSetting">
        <Icon type="appstore" />
        查看群组详情
      </Menu.Item>
      <Menu.Item key="changeDisturbing" className={styles.meunDisable} disabled>
        <Icon type="info" />
        消息免打扰
        <Switch defaultChecked={false} size="small" onChange={value => handleClickMenu('changeDisturbing', onChange, curChatData.group, curChatData.key, setShowSetting, setShowInviteNewMember, value)}/>
      </Menu.Item>
      <Menu.Item key="inviteNewMember" onChange={e => handleClickMenu(e.key, null, null, null, null, setShowInviteNewMember, null)}>
        <Icon type="plus" />
        邀请新成员
      </Menu.Item>
    </Menu>
  );

  return (
    <div className={`${styles.panelRightHeader} ${!curChatData ? styles.noChat : ''}`}>
      {curChatData && showSetting && 
        <Icon
          className={styles.backSettingIcon} 
          type="left" 
          onClick={() => {
            setShowSetting(false);
            if (findDOMNode(groupIdInput.current).value !== curChatData.id)
              handleClickHeadIcon(setLoading, 'changeGroupId', onChange, { group: curChatData.group, key: curChatData.key } , findDOMNode(groupIdInput.current).value);
          }} 
        />
      }
      {curChatData && !showSetting && <span>{curChatData.id}</span>}
      {curChatData && showSetting && <span className={styles.setting}>群组设置</span>}
      <div className={styles.iconGroup}>
        {curChatData  && !showSetting && curChatData.group !== 'private' && (
          <Dropdown overlay={menu} placement="bottomCenter" trigger={['click']}>
            <Icon type="ellipsis" />
          </Dropdown>
        )}
        {curChatData  && showSetting &&
          <Tooltip placement='top' title='退出群组'　>
            <Icon type="logout" onClick={() => handleClickHeadIcon(setLoading, 'quitGroup', onChange, { group: curChatData.group, key: curChatData.key }, null, curChatData.owner == userData.key)} />
          </Tooltip>
        }
        {curChatData  && showSetting && curChatData.owner === userData.key &&
          <Tooltip placement='top' title='删除群组' onClick={() => handleClickHeadIcon(setLoading, 'deleteGroup', onChange, { group: curChatData.group, key: curChatData.key })}>
            <Icon type="delete"  />
          </Tooltip>
        }
        <Icon type="close" 
          onClick={() => {
              if (showSetting && findDOMNode(groupIdInput.current).value !== curChatData.id)
                handleClickHeadIcon(setLoading, 'changeGroupId', onChange, { group: curChatData.group, key: curChatData.key } , findDOMNode(groupIdInput.current).value);
              handleClickHeadIcon(setLoading, 'closeWindow', onChange, {});
            }} 
        />
      </div>
    </div>
  )
};

export default memo(Head);