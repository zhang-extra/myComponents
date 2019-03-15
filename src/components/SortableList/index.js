import React, { memo, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import uniqueId from 'lodash/uniqueId';
import cloneDeep from 'lodash/cloneDeep';
import styles from './index.less';

export const DragDropWrapper = memo(props => { // 布局无关，只负责拖拽开始，结束时候的数据处理。
  const { data, onChange, children } = props;
  const { value, selectedList, selectedItems } = data;

  const reorderList = (sourceItems, draggedItemIndex, sourceListId, destinationItemIndex, destinationListId) => {
    // 先通过列id找到目标列和来源列位于data中的value值
    let newSourceListValue = cloneDeep(value[sourceListId]);
    let newDestinationListValue = sourceListId !== destinationListId ? cloneDeep(value[destinationListId]) : newSourceListValue;
    //  如果拖拽来源和落点所在列是同一个，那就直接指向引用而不是再拷贝一个。

    const addedItems = []; // 把所有被选中项目都克隆一份扔到这里
    sourceItems.map(sourceItemIndex => {
        addedItems.push(cloneDeep(newSourceListValue[sourceItemIndex]));
        newSourceListValue[sourceItemIndex].reorderShouldDelete = true; // 加个绝对不可能出现在数据里面的字段名标记一下方便删除
      } // 为了方便所以用了这种方式删除， 更科学的应该是先记录下index对于的item的唯一key，然后直接一个个删掉，通过key来找每次删除后的新下标。
    );

    // 将被选中的项目都新增到目标所在列中。这个增加的落点分三种情况。
    // 一是来源和目标不同列，那就直接增加在目标的索引位置。
    // 二是来源和目标同一列， 来源的索引大于目标的索引， 也是同样增加在目标的索引处。
    // 三是来源和目标同一列， 来源的索引小于目标的索引， 则增加在目标的索引后一位。
    newDestinationListValue.splice(destinationItemIndex + (sourceListId === destinationListId ? (destinationItemIndex > draggedItemIndex ? 1 : 0) : 0), 0, ...addedItems);

    // 从来源列中删除标记的被选中项目
    newSourceListValue = newSourceListValue.filter(sourceItem => !sourceItem.reorderShouldDelete);

    // 如果来源列和目标列是同一个。 因为filter会产生一个新的数组， 所以此时newDestinationListValue还指在老的数组上。
    if (destinationListId === sourceListId) newDestinationListValue = newSourceListValue;

    const newValue = { ...data.value };
    newValue[sourceListId] = newSourceListValue;
    newValue[destinationListId] = newDestinationListValue;
    onChange({ ...data, isDragging: false, selectedItems: [], value: newValue }); // 清空选中，同理没必要写selectedList: null
  };

  const onDragStart = result => { // 开始拖拽时触发一次
    if (!onChange || !result.source) return;
    const { droppableId, index } = result.source; // 能从result.source中获得拖拽项目所在列id和其位于列中的下标索引。
    // 判断当前被拖拽项目是否位于刺客被选中项目中. 即是否当前被拖拽项目所在列和被选中列id一致，若一致，当前被拖拽项目索引是否位于被选中项目索引集合数组中。
    const isDragItemInSelectItems = droppableId === selectedList && selectedItems && selectedItems.indexOf(index) !== -1;
    onChange({ // 把单选和多选抽象到一起, 每次开始拖拽改变全局绑定的data对象
      ...data, 
      isDragging: true, //  标志有任一项目开始拖拽
      draggedItemIndex: index, // 被拖拽项目索引

      // 被拖拽项目所在列的id. 开始一次新的拖拽时，若被拖拽项目不在此刻的被选中项目中，则更新值为拖拽项目所在的列。
      selectedList: isDragItemInSelectItems ? selectedList : droppableId,

      // 被选中项目的的索引集合数组. 开始一次新的拖拽时，若被拖拽项目不在此刻的被选中项目中，则更新值为仅包含了被拖拽项目索引的数组。
      selectedItems: isDragItemInSelectItems ? selectedItems: [index], 
    });
  }

  const onDragEnd = result => {// source, destination都有index和droppableId俩字段
    const { source, destination } = result; // 拖拽结束时可以获得被拖拽项目和落点项目的索引和所在列id
    if(!onChange) return;
    if (!destination) { // 存在没有落到任何项目的情况， 清空选中项目集合数组selectedItems。
      onChange({ ...data, isDragging: false, selectedItems: [] }) // 没必要写selectedList: null
      return;// 因为选中项目组清空了，下次开始拖拽时是必然不在选中项目组中的， 所以没必要在这里把selectedList也清一遍。
    } // 开始重新排序。传入被选中项目的索引集合， 被拖拽项目的索引， 被选中项目所在列id,   落点项目的索引和所在列id.
    reorderList(selectedItems, source.index, selectedList, destination.index, destination.droppableId)
  }// 这里的selectedList和source.droppableId是绝对一致的， 为了语义上和selectedItems统一所以填入selectedList

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd} >
      {children}
    </DragDropContext>
  );
});

export const SortableList = memo(props => {
  const { className, style, listId, data, ItemRender, direction, multiDrag, onChange, keyword, children, ...otherProps } = props;
  const value = data.value[listId];
  const connectSelect = (event, index) => {
    if (!onChange || event.defaultPrevented || event.button !== 0) return;
    event.preventDefault();
    // 当初始化状态或新的选中项所在的列和当前选中项所在的列不是同一个，则清空选中项集合组， 同时更新选中列信息。
    const newSelectItems = !data.selectedList || data.selectedList !== listId ? [] : cloneDeep(data.selectedItems);
    // 若是同一列，则在选本选中项集合组的基础上，把新的选中项添加、移除进集合组。
    if (newSelectItems.indexOf(index) === -1) newSelectItems.push(index);
    else newSelectItems.splice(newSelectItems.indexOf(index), 1);
    onChange({ ...data, selectedList: listId, selectedItems: newSelectItems });
  }

  return (
    <Droppable droppableId={listId} direction={direction}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          className={`${className} ${styles.scrollListWrapper} ${direction === 'horizontal' ? styles.horizontal : styles.vertical}`}
          style={style}
        >
          {value.map((itemData, index) => 
            <Draggable key={itemData[keyword]} draggableId={itemData[keyword]} index={index} >
              {(provided, snapshot) => (
                <ItemRender
                  connectDragRef={provided.innerRef}
                  connectDrag={provided.draggableProps}
                  connectDragHandle={provided.dragHandleProps}
                  connectDragStyle={provided.draggableProps.style}
                  connectSelect={multiDrag ? event => connectSelect(event, index) : null}
                  data={itemData}
                  index={index}
                  listId={listId}
                  isDraggedItem={multiDrag ? data.isDragging && (data.selectedList === listId && data.selectedItems && data.selectedItems.indexOf(index) !== -1) && data.draggedItemIndex === index : data.isDragging}
                  draggedItemsCount={multiDrag ? data.isDragging && (data.selectedList === listId && data.selectedItems && data.selectedItems.indexOf(index) !== -1) ? data.selectedItems.length : 0: undefined}
                  isDragging={data.isDragging && (data.selectedList === listId && data.selectedItems && data.selectedItems.indexOf(index) !== -1)}
                  isSelected={multiDrag ? (data.selectedList === listId && data.selectedItems && data.selectedItems.indexOf(index) !== -1) : undefined}
                  {...otherProps}
                />
              )}
            </Draggable>
            )}
            {children}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
});

DragDropWrapper.PropTypes = {
  data: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
}

SortableList.defaultProps = {
  keyword: 'key',
  direction: "vertical",
  multiDrag: false,
};

SortableList.PropTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  listId: PropTypes.string.isRequired,
  keyword: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  ItemRender: PropTypes.node.isRequired,
  direction: PropTypes.oneOf(['vertical', 'horizontal']),
  multiDrag: PropTypes.bool,
};