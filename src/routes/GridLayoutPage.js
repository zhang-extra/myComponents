import React, { memo, useState, useRef } from 'react';
import { Button, Tooltip, Icon } from 'antd';
import uniqueId from 'lodash/uniqueId';
import GridLayout from '../components/GridLayout/';
import styles from './GridLayoutPage.less';


const A = props => {
  const btnIcon =useRef(null);
  console.log(btnIcon.current);
  // btnIcon.current.getAttribute("title");
  const { title, i, deleteItem } = props;
  const handleDelete = () => deleteItem(i);
  return (
    <div className={styles.item}>
      <div className={styles.itemTop}>
        <span>人事信息</span>
        <Button ref={btnIcon} className={styles.circleButton} style={{right:'48px'}} size='small' shape="circle" icon="setting" />        
        <Button className={styles.circleButton} style={{right:'16px'}} size='small' shape="circle" icon="minus" onClick={handleDelete} />
      </div>
      <div className={styles.tableWrapper} >{title}{/*这里是表格数据*/}</div>
      <div className={styles.itemBottom}>
        Rows
        <Icon className={styles.pagingIcon} style={{marginLeft:'8px'}} type="caret-left" />
        <Icon className={styles.pagingIcon} type="caret-right" />
      </div>    
    </div>
  )
}

const itemMap = { a: A, b: A, c: A, d: A, e: A, f: A, g: A, h: A, i: A }

const Item = memo(({ value, i, h, deleteItem }) => {
  const { type, ...props } = value;
  const RenderItem = itemMap[type]
  return (
    <RenderItem {...props} i={i} deleteItem={deleteItem} />
  )
});

const initData = [
  { value: { type:'a', title: 'nsml' }, i: 'nsml', x: 0, y: 0, w: 1, h: 1, static: true },
  { value: { type:'b', title: '表格' }, i: 'wsnd', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4},
  { value: { type:'c', title: 'zmcd' }, i: 'zmcd', x: 4, y: 0, w: 1, h: 2},
  { value: { type:'d', title: 'dsmzy' }, i: 'dsmzy', x: 2, y: 0, w: 1, h: 2},
]; // i x y w h minW maxW minH maxH static:bool isDraggable:bool isResizable:bool

const GridLayoutPage = props => {
  const [data, setData] = useState(initData);

  const addItem = () => {
    data.push({ value: { type: 'a', title: uniqueId()}, i: uniqueId(), x: 5, y: 4, w: 3, h: 4 });
    setData(data);
  }

  const deleteItem = (i) => {
    data.splice(data.findIndex(item => item.i === i), 1);
    setData(data);
  }

  return (
    <div className={styles.gridLayoutPageWrapper}>
      <div className={styles.gridLayoutHead} >
        <Tooltip placement='bottom' title="Add Item"><Button shape="circle" icon="plus" onClick={addItem} /></Tooltip>
      </div>
      <GridLayout
        className={styles.gridLayout}
        data={data}
        autoSize={true} // 容器高度是否自适应
        cols={12}
        rowHeight={50} // 行高
        margin={[10,10]} // 项目间的x、y轴间距
        containerPadding={[10, 10]} // 容器padding属性
        verticalCompact={true} // 自否自动靠紧
        compactType='vertical' // 自动靠紧方向 'vertical' | 'horizontal'
        isDraggable // 允许项目拖拽
        isResizable // 允许项目缩放
        preventCollision={false} // 是否阻止挤开项目
        onLayoutChange={newLayout => setData(newLayout) }
        ItemRender={Item}
        showGrid
        gridClassName={styles.grid}
        // customProps
        deleteItem={deleteItem}
      />
    </div>
  )
}

export default GridLayoutPage;