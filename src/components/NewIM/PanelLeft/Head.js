import React, { memo } from 'react';
import { Menu, Icon, Dropdown } from 'antd';
import styles from './Head.less';

const handleClickMenu =  (type, onChange) => {
  if (onChange) onChange(type, { group: null, key: null });
};

const Head = props => {
  const { inSponsor, setInSponsor, onChange } = props;

  const EllipsisMenu = (
    <Menu onClick={event => handleClickMenu(event.key, onChange)}>
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

  return (
    <div className={`${styles.headWrapper} ${inSponsor ? styles.inSponsor : ''}`} >
      <Icon type={inSponsor ? 'left' : 'contacts'} onClick={() => setInSponsor(preState => !preState)} />
      {inSponsor && <span>发起聊天</span>}
      <Dropdown overlay={EllipsisMenu} placement="bottomCenter" trigger={['click']} disabled={inSponsor} >
        <Icon type="ellipsis" />
      </Dropdown>
    </div>
  )
};

export default memo(Head);