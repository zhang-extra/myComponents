import React, { memo, useState, useRef, useEffect } from 'react';
import { findDOMNode } from 'react-dom';
import { CellMeasurerCache } from 'react-virtualized/dist/commonjs/CellMeasurer';
import { Rnd } from 'react-rnd';
import PanelLeft from './PanelLeft';
import PanelRight from './PanelRight';
import styles from './index.less';

const IM = props => {
  const { className, userData, groupsData, curChatData, onChange, updatedChatData } = props;
  const [showSetting, setShowSetting] = useState(false);
  const [timeNow, setTimeNow] = useState(new Date());
  const measureCache = useRef(new CellMeasurerCache({ fixedWidth: true, minHeight: 80 }));
  const messageInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const inputedValues = useRef({}); // 切换窗口输入数据缓存
  const chatListRef = useRef(null);
  const timer = useRef(null);
  
  useEffect(() => {
    timer.current = setInterval(() => setTimeNow(new Date()), 60000); // 1分钟刷新次时间
    return () => { 
      if (timer.current) {
        clearInterval(timer.current);
        timer.current = null;
      }
    }
  });

  const scrollChatListToBottom = (dataLength, type) => {
    setTimeout(() => {
      if (loading) setLoading(false);
      if (type === 'endLoading') return;
      measureCache.current.clearAll();
      chatListRef.current.recomputeRowHeights();
      const chatListDOM = findDOMNode(chatListRef.current);
      if (dataLength) chatListRef.current.scrollToRow(dataLength + 1);
      if (type !== 'loadingMore' && chatListDOM.clientHeight + chatListDOM.scrollTop < chatListDOM.scrollHeight)
        chatListRef.current.scrollToPosition(chatListDOM.scrollHeight);
    }, 0);
  };

  updatedChatData.current = scrollChatListToBottom;
  // console.log(groupsData)
  return (
    // <Rnd
    //   className={`${styles.wrapper} ${className || ''}`}
    //   default={{ x: 0, y: 0, width: 800, height: 500 }}
    //   minWidth="600"
    //   minHeight="375"
    //   maxWidth="90%"
    //   maxHeight="80%"
    // >
    <div className={`${styles.wrapper} ${className || ''}`} style={{ margin: 'auto', height: 500, width: 800}}>
      <PanelLeft
        userData={userData}
        groupsData={groupsData}
        curChatData={curChatData}
        timeNow={timeNow}
        setShowSetting={setShowSetting}
        messageInputRef={messageInputRef}
        inputedValues={inputedValues}
        setLoading={setLoading}
        onChange={onChange}
      />
      <PanelRight
        userData={userData}
        curChatData={curChatData}
        groupsData={groupsData}
        showSetting={showSetting}
        setShowSetting={setShowSetting}
        timeNow={timeNow}
        messageInputRef={messageInputRef}
        inputedValues={inputedValues}
        chatListRef={chatListRef}
        measureCache={measureCache}
        loading={loading}
        setLoading={setLoading}
        onChange={onChange}
      />
    </div>
    // {/* </Rnd> */}
  );
};

export default memo(IM);