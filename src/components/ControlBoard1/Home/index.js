import React, { memo } from 'react';
import { Input, Icon, Radio } from 'antd';
import styles from './index.less';
import data from './menuData';


const Home = props => {
  // console.log(data);
  console.log(styles.icon);
  const { menuWidth } = props;
  return (
    <div className={styles.homeWrapper}>
      <div className={styles.headWrapper}>
        <Input className={styles.searchInput} />
        <Radio.Group >
          <Radio.Button value="fenzu">分组</Radio.Button>
          <Radio.Button value="paixu">A ~ Z</Radio.Button>
        </Radio.Group>
      </div>
      <div className={styles.itemWrapper}>
        {data.map((menu, index1) =>     
          <div key={index1} className={styles.item} >
            <div className={styles.menu}>
              <Icon className={styles.icon} type={menu.type || 'bank'} />
              <span className={styles.menuTitle}>{menu.menuTitle}</span>
            </div>
            {menu.modules.map((eachModule, index2) => 
              <div key={index2} className={styles.module}><a>{eachModule.moduleTitle}</a></div>
            )}
          </div>
          )}
      </div>
    </div>
  );
}

export default memo(Home);