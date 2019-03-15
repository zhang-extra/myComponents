import React, { memo, useState, useRef } from 'react';
import { Spin, Icon } from 'antd';
import Head from './Head';
import List from './List';
import Input from './Input';
import Setting from './Setting';
import styles from './index.less';

const PanelRight = props => {
  const { userData, curChatData, groupsData, timeNow, showSetting, setShowSetting, 
    chatListRef, measureCache, messageInputRef, inputedValues, loading, setLoading, onChange } = props;
  const [showInviteNewMember, setShowInviteNewMember] = useState(false);
  const groupIdInput = useRef(null);

  return (
    <div className={styles.panelRightWrapper}>
      <Head
        userData={userData}
        curChatData={curChatData}
        showSetting={showSetting}
        groupIdInput={groupIdInput}
        setShowSetting={setShowSetting}
        setShowInviteNewMember={setShowInviteNewMember}
        setLoading={setLoading}
        onChange={onChange}
      />
      <Spin className={styles.spin} spinning={loading} delay={50} />
      <List
        chatListRef={chatListRef}
        measureCache={measureCache}
        userData={userData}
        curChatData={curChatData}
        timeNow={timeNow}
        setLoading={setLoading}
        onChange={onChange}
      />
      {curChatData &&
        <Input
          curChatData={curChatData}
          messageInputRef={messageInputRef}
          inputedValues={inputedValues}
          onChange={onChange}
        />
      }
      {curChatData &&
        <Setting
          userData={userData}
          curChatData={curChatData}
          groupsData={groupsData}
          groupIdInput={groupIdInput}
          setLoading={setLoading}
          showSetting={showSetting}
          showInviteNewMember={showInviteNewMember}
          setShowInviteNewMember={setShowInviteNewMember}
          onChange={onChange}
        />
      }
      {!curChatData && <Icon className={styles.noChatIcon} type="wechat" />}
      {!curChatData && <span className={styles.noChatText}>暂时没有消息</span>}
    </div>
  );
};

export default memo(PanelRight);