/** @format */

// @flow
import React, { memo } from 'react';
import { Icon } from 'antd';
import styles from './CollapseHeader.less';

type Props = {
  // 头部文本内容
  text: string,
  // 图标
  icon: Object,
};

/**
 * 折叠面板头部组价 自定义折叠面板头部基本组件
 *
 * @param {Props}
 */
const CollapseHeader = memo((props: Props) => {
  const { text, icon, onDelGroup, opened } = props;
  return (
    <div className={styles.wrapper}>
      <Icon type={opened ? 'folder-open' : 'folder'} className={styles.folderIcon}/>
      <span className={styles.text}>
        {text}
        <Icon type="delete" className={styles.deleteIcon} onClick={onDelGroup}/>
      </span>
    </div>
  );
});

export default CollapseHeader;
