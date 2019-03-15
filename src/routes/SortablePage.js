import React, { memo, useState } from 'react';
import { DragDropWrapper, SortableList } from '../components/SortableList';
import styles from './SortablePage.less';

const getItems = (count, listId) =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    key: `${listId}-item-${k}`,
    title: `${listId}-item ${k}`,
  }));

const initListData = { 
  value: {
    list1: getItems(25, 'multiDrag25'),
    list2: getItems(25, 'singDrag25'),
  },
}

const Item = props => {
  const { connectDragRef, connectDrag, connectDragHandle, connectDragStyle, connectSelect, 
    data, index, listId, isDragging, isSelected, isDraggedItem, draggedItemsCount, ...otherProps } = props;
  const { type, title } = data;

  return (
    <div
      className={`${styles.item} ${isDragging ? styles.dragging : ''} ${isSelected ? styles.selected : ''}`}
      ref={connectDragRef}
      {...connectDrag}
      {...connectDragHandle}
      onClick={connectSelect}
    >
      <div>{data.title}</div>
      {isDragging && isDraggedItem && draggedItemsCount && <div className={styles.count}>{draggedItemsCount}</div>}
    </div>
  );
}

const SortablePage = props => {
  const [listData, setListData] = useState(initListData);
  const direction = 'horizontal'; // vertical horizontal
  const onListDataChange = newData => setListData(newData);
  const { isDragging, draggedItemIndex, selectedList, selectedItems } = listData;

  return (
    <div className={`${styles.wrapper} ${direction === 'vertical' ? styles.vertical : styles.horizontal}`}> 
      <DragDropWrapper data={listData} onChange={onListDataChange} >
        <SortableList
          className={`${styles.list} ${direction === 'vertical' ? styles.vertical : styles.horizontal} ${isDragging && selectedList === 'list1' ? styles.dragging : ''}`}
          listId='list1'
          data={listData}
          onChange={onListDataChange}
          ItemRender={Item}
          direction={direction}
          multiDrag
        />          
        <SortableList
          className={`${styles.list} ${direction === 'vertical' ? styles.vertical : styles.horizontal} ${isDragging && selectedList === 'list2' ? styles.dragging : ''}`}
          listId='list2'
          data={listData}
          onChange={onListDataChange}
          ItemRender={Item}
          direction={direction}
          keyword='title'
        />
      </DragDropWrapper>
    </div>
  );
}

export default SortablePage;