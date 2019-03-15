import React, { memo } from 'react';
import { Icon, Row, Col,Button } from 'antd';
import styles from './CollapseItem.less';

/**
 * 折叠面板列表Item组件  自定义折叠面板基本构成组件
 * 
 */

const CollapseItem = memo(props => {
  const { inTplDetial, text, onAddTpl, edit, add, onEdit, onRemove } = props;
  return (
    <div className={styles.wrapper}>
      {add && <Button className={styles.addIcon} icon={inTplDetial ? 'check' : 'plus'} size="small" shape="circle" disabled={inTplDetial} onClick={!inTplDetial ? onAddTpl : null} />}
      <span className={styles.text}>{text}</span>
      {edit && <Icon type="edit" className={styles.editAndDeleteIcon} onClick={onEdit} />}
      {edit && <Icon type="delete" className={styles.editAndDeleteIcon} onClick={onRemove} />}
    </div>
  );
});  

export default CollapseItem;
