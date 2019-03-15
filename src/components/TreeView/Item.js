import React, { memo, useState } from 'react';
import { Icon, Menu, Dropdown, Modal, Input } from 'antd';
import styles from './Item.less';

const Item = props => {
  const { data, parentData, treeNodeSize, direction, isExpand, isExpandRecently, onItemClick, mode } = props;
  const onClick = ({ key }) => onItemClick(key, data, parentData);

  
  const [visible, setVisible] = useState(false);
  const showModal = () => {
    setVisible(true);
    console.log(visible);
  }

  const handleOk = (e) => {
    setVisible(false);
    console.log('确定     ' + visible);
  }

  const handleCancel = (e) => {
    setVisible(false);
    console.log('cancel    ' + visible);
  }

  const leftMenu = (
    <Menu onClick={onClick}>
      <Menu.Item key="addBrotherDepartMent" >
        新增同级部门
      </Menu.Item>
      <Menu.Item key="addChildDepartMent">
        新增子部门
      </Menu.Item>
    </Menu>
  );

  const rightMenu = (
    <Menu onClick={onClick} >
      <Menu.Item key="renameDepartMent" onClick={showModal}>
        更名
      </Menu.Item>
      <Modal
          title="更名"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Input />
        </Modal>
      <Menu.Item key="transferDepartMent">
        划转
      </Menu.Item>
      <Menu.Item key="mergeDepartMent">
        合并
      </Menu.Item>
    </Menu>
  );

  return (
    <div
      className={`${styles.wrapper} ${isExpandRecently ? styles.ExpandRecently : ''}`}
      style={{ width: treeNodeSize[0], height: treeNodeSize[1] }}
    >
      <div
        className={`${styles.label} ${mode === 'simple' ? styles.simple : ''}`}
        style={{ writingMode: mode === 'simple' && direction === 'vertical' ? 'vertical-lr' : '' }}
      >
        {data.label}
      </div>
      {mode === 'detail' &&
        <div className={styles.footer} >
          <Dropdown overlay={leftMenu} placement='bottomCenter' >
            <Icon className={styles.icon} type="plus" />
          </Dropdown>
          <Dropdown overlay={rightMenu} placement='bottomCenter' >
            <Icon className={styles.icon} type="bars" />
          </Dropdown>
        </div>
      }
        <Icon
          className={`${styles.simpleModeExpand} treeView-expand`}
          style={{
            bottom: mode === 'simple' && direction === 'horizontal' ? '6.5px' : '',
            right: mode === 'simple' && direction === 'horizontal' ? '3px' : '',
            display: data.children && data.children.length > 0 ? '' : 'none',
          }}
          type={isExpand ? mode === 'simple' && direction === 'horizontal' ? 'left' : 'up' : mode === 'simple' && direction === 'horizontal' ? 'right' : 'down'} />
    </div>
  );
}

export default memo(Item);