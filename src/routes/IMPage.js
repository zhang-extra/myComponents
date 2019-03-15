import React, { useState, useRef } from 'react';
import { Button } from 'antd';
import IM from '../components/IM';
import dayjs from 'dayjs';
import uniqueId from 'lodash/uniqueId';
import styles from './IMPage.less';

import initChatUserData from '../components/IM/chatUserData';
import initChatData from '../components/IM/chatData';
import initLoginUserData from '../components/IM/loginUserData';

const IMPage = props => {
  const [loginUserData, setLoginUserData] = useState(initLoginUserData);
  const [chatData, setChatData] = useState(initChatData);
  const [chatUserData, setChatUserData] = useState(initChatUserData);
  const addDataCallBack = useRef(null);
  const handleAddData = () => {
    const { selectedChat, scrollChatListToBottom } = addDataCallBack.current;
    const target = { type: 'private', id: 'b' };
    chatData[target.type][target.id].data.push({
      user: "a",
      type: "string",
      content: uniqueId(),
      date: dayjs(new Date()).toJSON()
    });
    setChatData(chatData);
    if (selectedChat && selectedChat.type === target.type && selectedChat.id === target.id) scrollChatListToBottom();
  };

  const onChange = (type, info) => {
    const { selectedChat, scrollChatListToBottom } = addDataCallBack.current;
    if (type === 'loadMore') {
      const { type, id, loadCallBack } = info;
      if (Math.random() < 0.5) 
        setTimeout(() => loadCallBack('failed'), 500);
      else 
        setTimeout(() => {
          for (let i = 0; i < Math.random() * 1000; i++) {
            chatData[type][id].data.unshift({
              user: "a",
              type: "string",
              content: uniqueId(),
              date: dayjs(new Date()).toJSON()
            });
          }
          setChatData(chatData);
          loadCallBack('success');
        }, Math.random() * 2000);
    } else if (type === 'sendInput') {
      const { type, id, value, sendCallBack } = info;
      chatData[type][id].data.push({
        user: "a",
        type: "string",
        content: value,
        date: dayjs(new Date()).toJSON(),
        loading: true
      });
      setChatData(chatData);
      scrollChatListToBottom();
      setTimeout(() => {
        if (Math.random() < 0.5) {
          delete chatData[type][id].data[chatData[type][id].data.length - 1].loading;
          chatData[type][id].data[chatData[type][id].data.length - 1].failed = true;
          setChatData(chatData);
          sendCallBack('failed');
        } else {
          delete chatData[type][id].data[chatData[type][id].data.length - 1].loading;
          setChatData(chatData);
          sendCallBack('success');
        }
      }, Math.random() * 2000);
    }
  };

  return (
    <div className={styles.iMpageWrapper} >
      <IM
        className={styles.imWrapper}
        loginUserData={loginUserData}
        chatData={chatData}
        chatUserData={chatUserData}
        onChange={onChange}
        addDataCallBack={addDataCallBack}
      />
      <Button onClick={handleAddData}>AddDataTob</Button>
    </div>
  );
}

export default IMPage;