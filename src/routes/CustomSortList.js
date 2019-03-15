import React, { memo, useState } from 'react';
import { DragDropWrapper, SortableList } from '../components/SortableList'
import { Switch, Divider, Icon } from 'antd';
import cn from 'classnames';

import styles from './CustomSortList.less';

const defaultList1 = [
  {
    name: 'name',
    title: '姓名',
  },
  {
    name: 'dept',
    title: '部门',
  },
  {
    name: 'sex',
    title: '性别',
  },
  {
    name: 'age',
    title: '年龄',
  },
  {
    name: 'jobNo',
    title: '工号',
  },
];

const initListData = { 
  value: {
    list1: defaultList1,
    list2: [],
  },
}

const FixedItem = memo(props => {
  const { connectDragRef, connectDrag, connectDragHandle, connectDragStyle, connectSelect, 
    data, index, listId, isDragging, isSelected, isDraggedItem, draggedItemsCount, ...otherProps } = props;
  const { name, title } = data;
  return (
    <div
      ref={connectDragRef}
      {...connectDrag}
      {...connectDragHandle}
      className={cn(styles.item, {
        [styles.dragging]: isDragging,
        [styles.selected]: isSelected,
        [styles.dragged]: isDraggedItem,
      })}
      onClick={connectSelect}
    >
      {title}
      {/* <Icon className={styles.dragHandle} type="drag" {...connectDragHandle} />
      {isDragging && isDraggedItem &&
          <div className={styles.count}>{draggedItemsCount}</div>
      } */}
    </div>
  );
});

const SortItem = memo(props => {
  const { connectDragRef, connectDrag, connectDragHandle, connectSelect,
    data, index, listId, isDragging, isDraggedItem, isSelected, ...otherProps } = props;
  const { name, title } = data;
  return (
    <div
      ref={connectDragRef}
      {...connectDrag}
      {...connectDragHandle}
      onClick={e => e.target.className.indexOf(styles.item) !== -1 && connectSelect(e)}
      className={cn(styles.item, {
        [styles.dragging]: isDragging,
        [styles.selected]: isSelected,
        [styles.dragged]: isDraggedItem,
      })}
    >
      {title}
      <Switch checkedChildren="显示" unCheckedChildren="隐藏" defaultChecked />
    </div>
  );
});

const CustomSortList = props => {
  const [listData, setListData] = useState(initListData);
  const { isDragging, draggedItemIndex, selectedList, selectedItems } = listData;
  const onChange = (newValue) => setListData(newValue);

  return (
    <DragDropWrapper data={listData} onChange={onChange}>
      <SortableList
        className={`${styles.sortList} ${isDragging && selectedList === 'list1' ? styles.dragging : ''}`}
        listId='list1'
        data={listData}
        onChange={onChange}
        ItemRender={FixedItem}
        keyword='name'
        multiDrag
      >
        {listData.value['list1'].length === 0 && <span> 固定项目拖到上方:</span>}
      </SortableList>
      <Divider />
      <SortableList
        className={`${styles.sortList} ${isDragging && selectedList === 'list2' ? styles.dragging : ''}`}
        listId='list2'
        data={listData}
        onChange={onChange}
        ItemRender={SortItem}
        keyword='name'
        multiDrag
      />
    </DragDropWrapper>
  );
}

export default CustomSortList;
