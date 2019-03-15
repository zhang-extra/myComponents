import React, { memo, useState, useRef, useEffect } from 'react';
import { findDOMNode } from 'react-dom';
import { CellMeasurerCache } from 'react-virtualized/dist/commonjs/CellMeasurer';
import PanelLeft from './PanelLeft';
import PanelRight from './PanelRight';
import styles from './index.less';

const IM = props => {
  const { className, loginUserData, chatData, chatUserData, onChange, addDataCallBack } = props;
  const [selectedChat, setSelectedChat] = useState(null);
  const [settingGroup, showSettingGroup] = useState(false);
  const [time, setTime] = useState(new Date());
  const measureCache = useRef(new CellMeasurerCache({ fixedWidth: true, minHeight: 80 }));
  const inputRef = useRef(null);
  const chatListRef = useRef(null);
  const inputValues = useRef({});
  const timer = useRef(null);
  useEffect(() => {
    timer.current = setInterval(() => setTime(new Date()), 60000);
    return () => { 
      if (timer.current) {
        clearInterval(timer.current);
        timer.current = null;
      }
    }
  });

  const scrollChatListToBottom = () => {
    setTimeout(() => {
      measureCache.current.clearAll();
      chatListRef.current.recomputeRowHeights();
      const chatListDOM = findDOMNode(chatListRef.current);
      if (chatListDOM.clientHeight + chatListDOM.scrollTop < chatListDOM.scrollHeight)
        chatListRef.current.scrollToPosition(chatListDOM.scrollHeight);
    }, 0);
  };
  addDataCallBack.current = { selectedChat, scrollChatListToBottom };

  return (
    <div className={`${styles.wrapper} ${className}`} >
      <PanelLeft
        loginUserData={loginUserData}
        chatUserData={chatUserData}
        chatData={chatData}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
        inputRef={inputRef}
        inputValues={inputValues}
        showSettingGroup={showSettingGroup}
        measureCache={measureCache}
        chatListRef={chatListRef}
        onChange={onChange}
      />
      <PanelRight
        loginUserData={loginUserData}
        chatUserData={chatUserData}
        chatData={chatData}
        selectedChat={selectedChat}
        measureCache={measureCache}
        inputRef={inputRef}
        inputValues={inputValues}
        chatListRef={chatListRef}
        settingGroup={settingGroup}
        showSettingGroup={showSettingGroup}
        time={time}
        onChange={onChange}
      />
    </div>
  );
};

export default memo(IM);