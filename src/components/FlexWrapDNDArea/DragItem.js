import React, { memo, useState } from 'react';
import { findDOMNode } from 'react-dom';
import { DropTarget, DragSource } from 'react-dnd';
import flow from 'lodash/flow';

const TargetSpec = {
  canDrop(props, monitor) {
    return monitor.isOver();
  },// hover同区域交换
  hover(props, monitor, component) {
    if (!component || props.itemFasten) return; // 不响应固定区域
    const draggedItem = monitor.getItem();// 不响应固定区域
    if (props.areaId !== draggedItem.areaId || props.index === draggedItem.index) return;// 不响应跨区或者同区hover自身
    props.swapItem(draggedItem.index, props.index);// 交换项目
    monitor.getItem().index = props.index; // 更改beginDrag中记录的，即下次hover响应事件中获取的被拖拽项draggedItem的index值。
  },// drop跨区域增减
  drop(props, monitor, component) {// draggedItem落在DragItem上的响应事件
// 与落在DragItem上的响应事件相比唯一的区别是props.addItem()函数同时有data和insertIndex参数(即为被drop的item的index)。
    const draggedItem = monitor.getItem();
    if (props.areaId === draggedItem.areaId) return; // DropArea不响应来自自身的拖拽Item
    if(!props.itemFasten) props.addItem(draggedItem.data, props.index); // 如果当前区域不固定, 则新增Item
    if (!draggedItem.itemFasten) draggedItem.remove(); // 如果被拖拽item所在区域不固定, 则移除被拖拽item
  }
};

function TargetCollect(connect, monitor) { // Collect中return的对象将作为props传递给当前DraggableComponent组件
  return {
    connectDropTarget: connect.dropTarget(), // 将hover于上的draggedItem信息作为props传递给DragItem组件
    hoverDraggedItem: monitor.isOver() && monitor.isOver({ shallow: true }) && monitor.getItem(), 
  };
}

const SourceSpec = {
  beginDrag(props, monitor, component){
    // 返回draggedItem的信息
    const { data, index, areaId, itemFasten, removeItem } = props;
    return {
      data: data,
      index: index,
      areaId: areaId,
      itemFasten: itemFasten,
      remove: () => removeItem(index),
    }
  },
}

function SourceCollect(connect, monitor) { // Collect中return的对象将作为props传递给当前DraggableComponent组件
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(), // 判断当前DraggableComponent是否处于被拖拽状态
  };
}

const DragItem = props => {
  const { connectDragSource, connectDropTarget, ItemRender, data, index, areaId, itemFasten, hoverDraggedItem,
    isPreview, isDragging, addItem, swapItem, removeItem, ...otherProps
  } = props;

  // 是否hover有跨区域的draggedItem，并且自身所在区域不固定
  const isHover = hoverDraggedItem && hoverDraggedItem.areaId !== areaId && !itemFasten;

  return [
    <ItemRender
      key='item'  // preview的item不需要connectToDrag， 传递一个空的包装函数。
      connectDrag={!isPreview ? flow(connectDragSource, connectDropTarget) : node => node}
      data={isHover ? hoverDraggedItem.data : data} // 被hover时显示draggedItem的信息示意如果落在这里会是什么样子
      index={isHover ? -1 : index} // 占位预览的item下标为-1
      areaId={areaId}
      isDragging={isDragging}
      isPreview={isHover? true : isPreview} // 被hover时等效preview, 以及本身可能是个preview Item
      isFasten={itemFasten}
      {...otherProps} 
    />,// 渲染预览组件会需要用到DND传递N层的数据，性能较低，在长列表里快速移动的时候会有明显卡顿。
    isHover ? // 被hover时新渲染一个组件紧随其后，显示原本组件的信息
      <ItemRender
        key='preview'
        connectDrag={node => node} // 传递一个空包装函数
        data={data}
        index={index}
        areaId={areaId}
        isPlaced // 传递一个表示被占位的prop
        {...otherProps} 
      /> : null,
  ]
};

export default memo(flow(
  DragSource('FLEX_DND', SourceSpec, SourceCollect),
  DropTarget('FLEX_DND', TargetSpec, TargetCollect),
)(DragItem));
