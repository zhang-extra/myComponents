import React, { memo, useState, useRef } from 'react';
import { Icon, Input, Radio, Tooltip } from 'antd';
import styles from './index.less';
import initData from './menuData';


const ControlBoard = props => {
  const [data, setData] = useState(initData);
  const wrapper = useRef(null);

  const addHistory = (value) => {
    // console.log(value.target.innerText);
    if(data[0].history.indexOf(value.target.innerText) === -1) data[0].history.unshift(value.target.innerText);
    setData(data);
  }
  const hidden = () => {
    wrapper.current.style.height='0px';
    wrapper.current.style.border='0px';
    wrapper.current.style.overflow='hidden';
  }
  return (

    <div ref={wrapper}  className={`${styles.wrapper} 
      ${data.length === 1 ? styles.wrapperWidth1 : ''} 
      ${data.length === 2 ? styles.wrapperWidth2 : ''} 
      ${data.length === 3 ? styles.wrapperWidth3 : ''} `}> {/* 后面三个样式是为处理ie下宽度不自适应 */}
      <div className={styles.topInfo}>
        <div className={styles.historyWrapper}>
          <div className={styles.historyHead}>历史记录</div>
          { data[0].history.map((record,index) =>
            <p className={styles.historyRecord} key={index}>
              <Tooltip title={record}>{record}</Tooltip>
            </p>
            )}
        </div>

        <div className={`${styles.rightWrapper} 
          ${data.length === 1 ? styles.rightWrapperWidth1 : ''} 
          ${data.length === 2 ? styles.rightWrapperWidth2 : ''}
          ${data.length === 3 ? styles.rightWrapperWidth3 : ''} `}>
        { data.length > 4 &&
          <div className={styles.rightHead}>
            <Input className={styles.searchInput}/>
            <Radio.Group className={styles.btnGroup}>
              <Radio.Button value="fenzu">分组</Radio.Button>
              <Radio.Button value="paixu">A ~ Z</Radio.Button>
            </Radio.Group>
          </div>
        }
          <div className={`${styles.rightInfo} ${data.length < 5 ? styles.rightInfoWidth : ''} `} >          
            {data.map((menu, menuIndex) =>
                <div key={menuIndex} className={styles.item} >
                  <div className={styles.menu}>
                    <Icon className={styles.icon} type={menu.type || 'bank'} />
                    <span className={styles.menuTitle}>{menu.menuTitle}</span>
                  </div>
                  {menu.modules.map((eachModule, index2) => 
                    <div key={index2} className={styles.module} onClick={addHistory.bind(this)}><a>{eachModule.moduleTitle}</a></div>
                  )}
                </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.footer} onClick={hidden}><Icon type='up' className={styles.footIcon} />&nbsp;关闭</div>
    </div>
  );
}

export default memo(ControlBoard);