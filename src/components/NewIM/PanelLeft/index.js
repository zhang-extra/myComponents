import React, { useState, memo } from 'react';
import { Input } from 'antd';
import Head from './Head';
import List from './List';
import styles from './index.less';

const PanelLeft = props => {
  const { groupsData, userData, timeNow, curChatData, setShowSetting, setLoading, messageInputRef, 
    inputedValues, onChange } = props;
  const [inSponsor, setInSponsor] = useState(false); // 是否在发起聊天界面
  const [curGroup, setCurGroup] = useState('private'); // 是否在发起聊天界面
  const [searchRule, setSearchRule] = useState(''); // 搜索过滤词

  return (
    <div className={styles.panelLeftWrapper}>
      <Head inSponsor={inSponsor} setInSponsor={setInSponsor} onChange={onChange} />
      {inSponsor &&
        <Input.Search
          className={styles.search}
          placeholder={`搜索 ${curGroup}`}
          value={searchRule}
          onChange={event => setSearchRule(event.target.value)}
        />
      }
      {inSponsor && groupsData &&
        <div className={styles.tabs}>
          {Object.entries(groupsData).map(group =>
            <a
              key={group[0]}
              className={`${styles.tabItem} ${curGroup === group[0] ? styles.current : ''}`}
              onClick={() => setCurGroup(group[0])}
            >
              {group[0]}
            </a>
          )}
        </div>
      }
      {(groupsData || userData) &&
        <List
          inSponsor={inSponsor}
          setInSponsor={setInSponsor}
          timeNow={timeNow}
          curGroup={curGroup}
          curChatData={curChatData}
          setShowSetting={setShowSetting}
          messageInputRef={messageInputRef}
          inputedValues={inputedValues}
          setLoading={setLoading}
          data={
            inSponsor ? 
              Object.values(groupsData[curGroup]).filter(item => item.id.indexOf(searchRule) !== -1)
                : userData.recentChats
          }
          onChange={onChange}
        />
      }
    </div>
  );
};

export default memo(PanelLeft);