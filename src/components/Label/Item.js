import React from 'react';
import { Icon } from 'antd';
import styles from './Item.less';



const Item = (props) =>{
  return(
    <div className={styles.wrapper}>
      {props.text}
      <Icon onClick={event => console.log(index1)} className={styles.icon} type="close" />
    </div>
  );
} 
export default Item;