import React, { memo } from 'react';
import { Input, Icon, Radio } from 'antd';
import styles from './index.less';
import data from './menuData';


const Home = props => {
  
  const { addTabPanes, menuWidth } = props;
  // const ModuleTitle = (event) =>{
  //   console.log(event.target.innerHTML);
  // }

  return (
    <div className={styles.homeWrapper}>
      { data.length > 3 &&
        <div className={styles.headWrapper}>
          <Input className={styles.searchInput} />
          <Radio.Group >
            <Radio.Button value="fenzu">分组</Radio.Button>
            <Radio.Button value="paixu">A ~ Z</Radio.Button>
          </Radio.Group>
        </div>
      }
      <div className={styles.itemWrapper}>
        {data.map((menu, index1) =>     
          <div key={index1} className={styles.item} >
            <div className={styles.menu}>
              <Icon className={styles.icon} type={menu.type || 'bank'} />
              <span className={styles.menuTitle}>{menu.menuTitle}</span>
            </div>
            {menu.modules.map((eachModule, index2) => 
              <div key={index2} className={styles.module} ><a onClick={addTabPanes.bind(this)}>{eachModule.moduleTitle}</a></div>
            )}
          </div>
          )}
      </div>
    </div>
  );
}

export default memo(Home);