import React, { useState, useRef, useEffect } from 'react';
import { Button, message, Drawer } from 'antd';
import cloneDeep from 'lodash/cloneDeep';
import IM from '../components/NewIM';
import dayjs from 'dayjs';
import uniqueId from 'lodash/uniqueId';
import styles from './NewIMPage.less';

import allGroup1ChatsData from '../components/NewIM/mockData/allGroup1ChatsData';
import allPrivateChatsData from '../components/NewIM/mockData/allPrivateChatsData';
import allGroup1Chats from '../components/NewIM/mockData/allGroup1Chats';
import allOtherUser from '../components/NewIM/mockData/allOtherUsers';
import initUserData from '../components/NewIM/mockData/user';

const dataMap = { private: allPrivateChatsData, group1: allGroup1ChatsData }; // 将group类型与对应的数据集映射
const infoMap = { private: allOtherUser, group1: allGroup1Chats }; // 将group类型与对应的数据集映射

const getChatLengthAndLastData = (group, key) => {
  const queryKey = group === 'private' ? // 两个人之间的chat key为两个人各自的key如下拼接:key1-key2 按ascii字符排序
    `${initUserData.key < key ? initUserData.key: key}-${initUserData.key > key ? initUserData.key: key}` : 
      key; // 群组的chat key就是群组的key
  return [dataMap[group][queryKey].length, dataMap[group][queryKey][dataMap[group][queryKey].length - 1]]; // 返回服务器上的查询数据长度与最后的数据。
}

const IMPage = props => {
  const isInit = useRef(false);
  const [userData, setUserData] = useState(null); // 需要保存在服务器的个人数据.userData.rencentChat为左栏的最近聊天窗口
  const [groupsData, setGroupsData] = useState(null); // 本地拼接生成.构建发起聊天界面分栏和具体信息
  const [curChatData, setCurChatData] = useState(null); // 当前打开的聊天 数据， 从服务器拉取
  const [showDrawer, setShowDrawer] = useState(false);
  const updatedChatData = useRef(null); // 通知IM数据有更新的函数

  const sendMessage = (target) => {
    const { group, key } = target;
    const data = {
      user: key,
      type: "string",
      value: uniqueId(),
      date: dayjs(new Date()).toJSON(),
    };
    const serverData = group === 'private' ? dataMap[group][`${userData.key < key ? userData.key: key}-${userData.key > key ? userData.key: key}`]
    : dataMap[group][key];    
    serverData.push(cloneDeep(data));
    const targetChatInRecent = userData.recentChats.findIndex(chat => chat.group === group && chat.key === key);
    if (targetChatInRecent === -1) {
      userData.recentChats.unshift({
        group,
        key,
        id: groupsData[group][key].id,
        avatar: groupsData[group][key].avatar,
        lastData: { 
          value: data.value, 
          id: data.user === userData.key ? userData.id : groupsData['private'][data.user].id, 
          date: data.date
        },
        unreadCount: 1
      });
    } else {
      const [target] = userData.recentChats.splice(targetChatInRecent, 1);
      target.lastData = {
        value: data.value, 
        id: data.user === userData.key ? userData.id : groupsData['private'][data.user].id, 
        date: data.date
      };
      if (!curChatData || curChatData.group !== group || curChatData.key !== key) target.unreadCount = target.unreadCount + 1;
      userData.recentChats.splice(0, 0, target);
    }
    if (curChatData && curChatData.group === group && curChatData.key === key) {
      curChatData.data = cloneDeep(serverData);
      setCurChatData(curChatData);
      updatedChatData.current(curChatData.data.length);
    }
    setUserData(userData);
  }

  const onChange = (type, target, value) => {
    console.log(type, target, value);
    const { group, key } = target;
    if (type === 'removeChat') { // 从最近聊天页表冲移除
      userData.recentChats.splice(value, 1);
      setUserData(userData);
      if (curChatData && group === curChatData.group && key === curChatData.key)
        setCurChatData(null);
    } else if (type === 'sponsorChat') { // 加入到最近聊天列表并打开
      const inRecently = userData.recentChats.findIndex(chat => chat.key === key && chat.group === group);
      if (inRecently === -1) {
        const [_, lastData] = getChatLengthAndLastData(group, key);
        userData.recentChats.unshift({
          group,
          key,
          preDataLength: 0,
          id: groupsData[group][key].id,
          avatar: groupsData[group][key].avatar,
          lastData: {
            value: lastData.value, 
            id: lastData.user === initUserData.key ? initUserData.id : groupsData['private'][lastData.user].id, 
            date: lastData.date
          },
          unreadCount: 0,
        });
      } else {
        const removed = userData.recentChats.splice(inRecently, 1);
        userData.recentChats.unshift(...removed)
      }
      setUserData(userData);
      onChange('openChat', target)
    } else if (type === 'openChat') { // 打开聊天  本地读取服务器
      setCurChatData(null);
      setTimeout(() => { // 为了防止从长窗口切换到短窗口滚动条位移触发loadMore, 先设为null再推到异步队列。
        setTimeout(() => {
          if (Math.random() < 0.3) {
            setCurChatData(null);
            updatedChatData.current(null, 'endLoading');
            message.error('获取聊天数据失败，请检查网络连接！', 2);
          } else {
            const users = {};
            if (group === 'private') {
              users[userData.key] = {
                key: userData.key,
                id: userData.id,
                avatar: userData.avatar
              }
              users[key] = {
                key: key,
                id: groupsData[group][key].id,
                avatar: groupsData[group][key].avatar
              };
            } else {
              groupsData[group][key].users.forEach(userKey => users[userKey] = { 
                key: userKey,
                id: userKey === userData.key ? userData.id : groupsData['private'][userKey].id,
                avatar: userKey === userData.key ? userData.avatar :  groupsData['private'][userKey].avatar
              })
            }
            const serverData = cloneDeep(group === 'private' ? dataMap[group][`${userData.key < key ? userData.key: key}-${userData.key > key ? userData.key: key}`]
            : dataMap[group][key]);
            const targetChatInRecent = userData.recentChats.filter(chat => chat.group === group && chat.key === key)[0];
            targetChatInRecent.lastData = {
              value: serverData[serverData.length - 1].value, 
              id: serverData[serverData.length - 1].user === userData.key ? 
                userData.id : groupsData['private'][serverData[serverData.length - 1].user].id, 
              date: serverData[serverData.length - 1].date,
            };
            targetChatInRecent.unreadCount = 0;
            setUserData(userData);
            setCurChatData({
              id: groupsData[group][key].id,
              users,
              group,
              key,
              data: serverData,
              owner: groupsData[group][key].owner
            });
            updatedChatData.current(serverData.length);
          }
        }, Math.random() * 1000);
      }, 0);
    } else if (type === 'sendInput') {
      const data = {
        user: userData.key,
        type: "string",
        value,
        date: dayjs(new Date()).toJSON(),
        loading: true
      }
      // 本地
      const targetChatInRecentIndex = userData.recentChats.findIndex(chat => chat.group === group && chat.key === key);
      userData.recentChats[targetChatInRecentIndex].lastData = {
        value: data.value,
        id: data.user === userData.key ? userData.id : ownGroupsData['private'][data.user].id,
        date: data.date
      }
      if (targetChatInRecentIndex !== 0) {
        const [targetChat] = userData.recentChats.splice(targetChatInRecentIndex, 1);
        userData.recentChats.splice(0, 0, targetChat);
      }
      setUserData(userData); // 更新本地 userData
      /* 并将userData内容推送到服务器 */
      curChatData.data.push(data);
      setCurChatData(curChatData);
      updatedChatData.current(curChatData.data.length);
      const pos = curChatData.data.length - 1;
      setTimeout(() => {
        if (Math.random() < 0.5) {
          // 本地
          delete curChatData.data[pos].loading;
          curChatData.data[pos].failed = true;
          message.error('消息发送失败，请检查网络连接！', 2);
        } else {
          // 本地
          delete curChatData.data[pos].loading;

          // 服务器
          const serverData = group === 'private' ? dataMap[group][`${userData.key < key ? userData.key: key}-${userData.key > key ? userData.key: key}`]
          : dataMap[group][key];
          serverData.push(data);
        }
        setCurChatData(curChatData);
      }, Math.random() * 1000);      
    } else if (type === 'loadMore') { // 本地读取服务器
      let preLength = 0;
      setTimeout(() => {
        if (Math.random() < 0.35) {
          setTimeout(() => {
            message.error('加载历史记录失败，请检查网络连接！', 2);
            updatedChatData.current(null, 'endLoading');
          }, 500);
        } else {
          preLength = curChatData.data.length;
          for (let i = 0; i < Math.random() * 1000; i++) {
            curChatData.data.unshift({
              user: userData.key,
              type: "string",
              value: uniqueId(),
              date: dayjs(new Date()).toJSON()
            });
          }
          setCurChatData(curChatData);
          updatedChatData.current(curChatData.data.length - preLength, 'loadingMore');
        }
      }, Math.random() * 1000);
    } else if (type === 'inviteNewMember') {
      setTimeout(() => {
        updatedChatData.current(null, 'endLoading');
        if (Math.random() < 0.35) {
          message.error('邀请新成员失败，请检查网络连接!', 2);
        }
        else {
          // 本地
          value.forEach(userKey => curChatData.users[userKey] = { 
            key: userKey,
            id: userKey === userData.key ? userData.id : groupsData['private'][userKey].id,
            avatar: userKey === userData.key ? userData.avatar :  groupsData['private'][userKey].avatar
          });
          setCurChatData(curChatData);
          groupsData[group][key].users.push(...value);
          setGroupsData(groupsData);

          // 服务器
          infoMap[group][key].users.push(...value);
        }
      }, Math.random() * 1000);
    } else if (type === 'changeGroupId') {
      setTimeout(() => {
        updatedChatData.current(null, 'endLoading');
        if (Math.random() < 0.35) {
          message.error('修改群组Id失败，请检查网络连接!', 2);
        } else {
          //本地
          curChatData.id = value;
          setCurChatData(curChatData);
          userData.recentChats.filter(chat => chat.group === group && chat.key === key)[0].id = value; 
          setUserData(userData);
          groupsData[group][key].id = value;
          setGroupsData(groupsData);

          // 服务器
          infoMap[group][key].id = value;
          message.success('修改群组id成功!', 2);
        }
      }, Math.random() * 1000);
    } else if (type === 'closeWindow') {
      setShowDrawer(false);
    } else if (type === 'quitGroup') {
      setTimeout(() => {
        updatedChatData.current(null, 'endLoading');
        if (Math.random() < 0.8) {
          message.error('退出群组失败，请检查网络连接!', 2);
        } else {
          // 本地
          delete groupsData[group][key];
          setGroupsData(groupsData)
          userData.chatGroups[group].splice(userData.chatGroups[group].indexOf(key), 1);
          userData.recentChats.splice(userData.recentChats.findIndex(chat => chat.group === group && chat.key === key));
          setUserData(userData);
          
          // 服务器 
          // 将变更后的userData个人内容上传服务器
          // 将变更后的group群组信息上传服务器,
          infoMap[group][key].users.splice(infoMap[group][key].users.indexOf(userData.key), 1);
          if (curChatData.owner === userData.key) infoMap[group][key].owner = infoMap[group][key].users[0];
          setCurChatData(null);
        }
      }, Math.random() * 1000);
    } else if (type === 'deleteGroup') {
    } else if (type === 'changeDisturbing') {

    }
  };

  useEffect(() => {
    if (!isInit.current) {
      // 发起聊天界面需要获取user有的group内的所有chat的头像、描述等信息. ownGroups[index][0]为group类型, ownGroups[index][1]为group值
      // 类型为private保存的即为private列表里所有好友的头像，简介等信息，从allOtherUser中找；不为private保存的即为所有加入的群组的头像，简介等信息。
      const ownGroupsData = {};
      Object.entries(initUserData.chatGroups).forEach(([group, _]) => ownGroupsData[group] = cloneDeep(infoMap[group]))
      setGroupsData(ownGroupsData);
      const { recentChats } = initUserData;
      recentChats.forEach(chat => {
        const { group, key, preDataLength } = chat;
        const [dataLength, lastData] = getChatLengthAndLastData(group, key); // 初始化窗口获取每个chat的最新数据
        chat.id = ownGroupsData[group][key].id;
        chat.avatar = ownGroupsData[group][key].avatar;
        chat.lastData = { 
          value: lastData.value, 
          id: lastData.user === initUserData.key ? initUserData.id : ownGroupsData['private'][lastData.user].id, 
          date: lastData.date
        };
        chat.unreadCount = !preDataLength ? 0 : dataLength - preDataLength; // 与上次退出时保存的做对比， 更新unReadCount
      });
      setUserData(initUserData);
      /* 
        此处加入不在线时推送的数据
      */

      isInit.current = true;
    }
  });

  return (
    <div className={styles.iMpageWrapper} >
      {/* <Drawer
        className={styles.drawer}
        visible={showDrawer}
        onClose={() => {
          setShowDrawer(false);
          setCurChatData(null);
        }}
        closable={false}
        title=""
        placement="top"
      >
        {showDrawer &&  */}
          <IM
            className={styles.imWrapper}
            userData={userData}
            groupsData={groupsData}
            curChatData={curChatData}
            updatedChatData={updatedChatData}
            onChange={onChange}
          />
        {/* }
      </Drawer> */}
      <Button onClick={() => setShowDrawer(true)}>Show Drawer</Button>
      <div style={{ position: 'absolute', bottom: '40px', left: '80px' }}>
        <Button onClick={() => sendMessage({ group: 'private', key: 1 })}>UziSendMessage</Button>
        <Button onClick={() => sendMessage({ group: 'group1', key: 0 })}>产品设计SendMessage</Button>
        <Button onClick={() => sendMessage({ group: 'private', key: 2 })}>RookieSendMessage</Button>
      </div>
    </div>
  );
}

export default IMPage;