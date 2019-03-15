import React, { memo, useState, useRef } from 'react';
import { Tabs, Icon } from 'antd';
import History from './History/';
// import Oneitem from './Oneitem/';
import styles from './index.less';
import data from './History/menuData';



//  <TabPane tab="Tab 1" key="1"><Home /></TabPane>

// const renderPaneContent = (tabPane) => {
//     if (tabPane === '历史记录') return <History />;
//   return null;
// }
const ControlBoard = props => {
    
  const [tabPanes, setTabPanes] = useState(['']);
  const wrapper = useRef(null);
  const TabPane = Tabs.TabPane;

  const addTabPanes = (value) => {
    if(tabPanes.indexOf(value.target.innerHTML) === -1) tabPanes.unshift(value.target.innerHTML);
    setTabPanes(tabPanes);
  }
  const hidden = () => {
    console.log(wrapper);
    console.log(wrapper.current);
    console.log(wrapper.current.querySelector(`.${styles.footer}`));





    // console.log(wrapper.current.querySelectorAll({styles.footer}));
    // const wrapper = document.getElementById('wrapper');
    // const footer = document.getElementById('footer');
    // wrapper.style.height='0px';
    // wrapper.style.border='0px';
    // footer.style.display='none';
  }
  return (
    <div ref={wrapper}  className={`${styles.wrapper} ${data.length > 3 ? styles.wrapperWidth : styles.wrapperWidthFit}`}>
      <Tabs tabPosition='left' >
        {tabPanes.map((tabPane, index) =>
          <TabPane tab={tabPane} key={index}>
            <p className={styles.leftHead}>历史记录</p>
            <History addTabPanes={addTabPanes} />
            {/* {renderPaneContent(tabPane)} */}
          </TabPane>
        )}
      </Tabs>
      <div className={styles.footer} onClick={hidden} id='footer'><Icon type='up' className={styles.footIcon} />&nbsp;关闭</div>
    </div>
  );
}

export default memo(ControlBoard);