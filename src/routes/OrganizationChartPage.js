import React, { useState } from 'react';
import { Slider, Select } from 'antd';
import TreeView from '../components/TreeView/'
import styles from './OrganizationChartPage.less';
import initData from './OrganizationChartPageData';
import Item from '../components/TreeView/Item';
import uniqueId from 'lodash/uniqueId';

const Option = Select.Option;

const OrganizaitonChartPage = props => {
  const [data, setData] = useState(initData);
  const [zoom, setZoom] = useState(100);
  const [direction, setDirection] = useState('vertical');
  const [mode, setMode] = useState('detail');
  const onItemClick = (key, data, parentData) => {
    switch (key) {
      case 'addBrotherDepartMent':
        parentData.children.push({
          key: uniqueId(),
          value: uniqueId(),
          label: uniqueId(),
          isLeaf: true,
          deleteable: true,
          deleted: false       
        })
        break;
      case 'addChildDepartMent':
        if (!data.children) data.children = [];
        data.children.push({
          key: uniqueId(),
          value: uniqueId(),
          label: uniqueId(),
          isLeaf: true,
          deleteable: true,
          deleted: false       
        })
        break;
      default:
        break;
    }
    setData(data => data);
  };
  
  return (
    <div className={styles.wrapper} >
      <div className={styles.panel} >
        <Slider className={styles.zoomSlider} defaultValue={zoom} onAfterChange={value => setZoom(value)} min={50} max={200} ipFormatter={(value) => `${value}%`} />
        <Select className={styles.select} value={direction} onChange={value => setDirection(value)} >
          <Option value="vertical">水平</Option>
          <Option value="horizontal">竖直</Option>
        </Select>
        <Select className={styles.select} value={mode} onChange={value => setMode(value)} >
          <Option value="detail">详情</Option>
          <Option value="simple">缩略</Option>
        </Select>
      </div>
      <TreeView
        className={styles.treeView}
        data={[data]}
        direction={direction} // vertical, horizontal
        treeNodeSize={mode === 'detail' ? [164, 128] : direction === 'vertical' ? [32, 164] : [164, 32]}  // width, height
        distance={mode === 'detail' ? [100, 50, 60] : [50, 15, 60]} // toParent, toBrother, rootNodeToBox
        zoom={zoom}
        lineOption={{ // 该属性为空则不显示连线
          width: '2px',
          color: 'black',
          background: 'white' // 因为实现的原因需要获取视图的背景色
        }}
        expandNotice={500} // 启用该属性，当节点触发expand时会得到持续时间为属性值毫秒的prop: isExpandRecently
        renderNode={Item}

        // TreeView无关的自定义属性会传给Item
        mode={mode}
        onItemClick={onItemClick}
      />
    </div>
  );
}

export default OrganizaitonChartPage;
