import React, { memo, useState } from 'react';
import { Input, Avatar, Modal, Icon } from 'antd';
import styles from './Setting.less';

const Setting = props => {
  const { userData, curChatData, groupsData, groupIdInput, showSetting, showInviteNewMember,
    setShowInviteNewMember, setLoading, onChange } = props;
  const [invitedMembers, setInvitedMembers] = useState([]);
  return (
    [showSetting && 
      <div key="groupSetting" className={styles.setting}>
        <div>
          <span>群组名称</span>
          <Input ref={groupIdInput} placeholder="请输入群组名称" defaultValue={curChatData.id} />
        </div>
        <div>
          <span>群组成员</span>
          <div className={`${styles.user} ${styles.invite}`} onClick={() => setShowInviteNewMember(true)} >
            <Avatar className={styles.avatar} size="small" icon="plus" />
            邀请新成员
          </div>
          {Object.values(curChatData.users).map(user =>
            <div key={user.key} className={styles.user}>
              <Avatar className={styles.avatar} size="small" >
                {user.avatar}
              </Avatar>
              {user.id}
              {user.key === curChatData.owner && <span className={styles.owner}>(群主)</span>}
            </div>
          )}
        </div>
      </div>,
    <Modal 
      key="groupModal"
      title="邀请新成员"
      okText="确认"
      cancelText="取消"
      visible={showInviteNewMember}
      onOk={() => {
        if (onChange && invitedMembers.length >= 1) {
          setLoading(true)
          onChange('inviteNewMember', { group: curChatData.group, key: curChatData.key}, invitedMembers);
        };
        setInvitedMembers([]);
        setShowInviteNewMember(false);
      }}
      onCancel={() => {setShowInviteNewMember(false); setInvitedMembers([]);} }
    >
      {curChatData && Object.values(groupsData['private']).filter(user => !curChatData.users[user.key]).map(user =>
        <div
          key={user.key}
          className={`${styles.user}
          ${invitedMembers.includes(user.key) ? styles.selected : ''}`} 
          onClick={() => {
            if (!invitedMembers.includes(user.key)) invitedMembers.push(user.key);
            else invitedMembers.splice(invitedMembers.indexOf(user.key), 1);
            setInvitedMembers(invitedMembers);
          }}
        >
          <Avatar className={styles.avatar} size="small" >
            {user.key === userData.key ? userData.avatar: groupsData['private'][user.key].avatar}
          </Avatar>
          {user.id}
          {invitedMembers.includes(user.key) && <Icon className={styles.check} type="check" />}
        </div>
      )}
    </Modal>]
  );
}

export default memo(Setting);