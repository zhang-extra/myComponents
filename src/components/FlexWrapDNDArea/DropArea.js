import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { DropTarget, DragSource } from 'react-dnd';
import uniqueId from 'lodash/uniqueId';
import flow from 'lodash/flow';
import cloneDeep from 'lodash/cloneDeep';
import DragItem from './DragItem';
import styles from './DropArea.less';

const SourceSpec = { // 预留，dropArea可拖拽
  beginDrag(props, monitor, component){
    // 返回需要注入的属性
    return {
      id: '123'
    }
  },
}

function SourceCollect(connect, monitor) { // 预留，dropArea可拖拽
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    dragging: monitor.isDragging(),
  }
}

const TargetSpec = {
  canDrop(props, monitor) {
    return monitor.isOver() && monitor.isOver({ shallow: true }); // 浅层响应，不响应冒泡下来的事件
  },// drop跨区域增减
  drop(props, monitor, component) { // draggedItem落在DropArea上的响应事件
// 与落在DragItem上的响应事件相比唯一的区别是props.addItem()函数只有一个data参数,默认insertIndex为value长度,即插到最末尾。
    const draggedItem = monitor.getItem();
    if (props.areaId === draggedItem.areaId) return; // DropArea不响应来自自身的拖拽Item
    if(!props.itemFasten) props.addItem(draggedItem.data); // 如果当前区域不固定, 则新增Item
    if (!draggedItem.itemFasten) draggedItem.remove();  // 如果被拖拽item所在区域不固定, 则移除被拖拽item
  },
};

function TargetCollect(connect, monitor) {
  // Collect中return的对象将作为props传递给当前DropArea组件
  return {
    connectDropTarget: connect.dropTarget(), // 将hover于上的draggedItem信息作为props传递给DropArea组件
    hoverDraggedItem: monitor.isOver() && monitor.isOver({ shallow: true }) && monitor.getItem(), 
  };
}

const DropArea = flow(
  DragSource('FLEX_DND', SourceSpec, SourceCollect),
  DropTarget('FLEX_DND', TargetSpec, TargetCollect),
)(props => {
  const { connectDropTarget, connectDragSource, className, style, children, ItemRender, value,
    areaId, couldAreaDrag, itemFasten, flexDirection,
    addItem, swapItem, removeItem,
    hoverDraggedItem,
    ...otherProps
  } = props;

  let dropArea = connectDropTarget(
    <div className={`${className || ''} ${styles.scrollWrapper}`} style={{ ...style, flexDirection }} >
      {value && value.map((data, index) =>
        <DragItem
          key={data.key}
          index={index}
          data={data}
          ItemRender={ItemRender}

          areaId={areaId}
          itemFasten={itemFasten}

          swapItem={swapItem}
          addItem={addItem}
          removeItem={removeItem}

          {...otherProps}
        /> 
      )}{/* 渲染预览组件会需要用到DND传递N层的数据，性能较低，在长列表里快速移动的时候会有明显卡顿。 */}
      {hoverDraggedItem && hoverDraggedItem.areaId !== areaId && !itemFasten && // 是否hover有跨区域的draggedItem，并且区域不固定
        <DragItem isPreview data={hoverDraggedItem.data} ItemRender={ItemRender} {...otherProps} /> // 渲染hover于上的draggitem信息于所有item之后
      }
      {children}
    </div>
  );
  if (couldAreaDrag) dropArea = connectDragSource(dropArea); // 预留，dropArea可拖拽
  return dropArea;
});

// React-DND没法获取纯函数组件实例中的局部变量方法， 用高阶组件把状态提出来，通过props传进去获取.
const WithDataHandle = ({ value, defaultValue, onChange, ...props }) => { 
  const [innerValue, setValue] = useState(defaultValue || []) // 非受控模式渲染用值
  const usedValue = value || innerValue; // 受控和非受控使用不同值渲染Item

  const swapItem = (dragItemIndex, hoverItemIndex) => { // 同块区域交换顺序单独拿出来只需要一次reRender, 不与跨区域的addItem, removeItem抽象在一起。
    const newValue = value ? cloneDeep(usedValue) : usedValue; // 非受控不用深拷贝
    const [draggedItem] = newValue.splice(dragItemIndex, 1);
    newValue.splice(hoverItemIndex, 0, draggedItem);
    if (!value) setValue(newValue);
    if (onChange) onChange(newValue);
  }

  const addItem = (data, insertIndex = usedValue.length) => {
    const newValue = value ? cloneDeep(usedValue) : usedValue;
    newValue.splice(insertIndex, 0, { ...data, key: uniqueId() });
    if (!value) setValue(newValue);
    if (onChange) onChange(newValue);
  }

  const removeItem = (removeIndex) => {
    const newValue = value ? cloneDeep(usedValue) : usedValue;
    newValue.splice(removeIndex, 1);
    if (!value) setValue(newValue);
    if (onChange) onChange(newValue);
  }

  return (
    <DropArea value={usedValue} addItem={addItem} swapItem={swapItem} removeItem={removeItem} {...props} />
  );
};

WithDataHandle.defaultProps = {
  itemFasten: false,
  flexDirection: "row",
  couldAreaDrag: false,
};

WithDataHandle.PropTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
  areaId: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(PropTypes.object),
  defaultValue: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func,
  ItemRender: PropTypes.node.isRequired,
  itemFasten: PropTypes.bool.isRequired,
  flexDirection: PropTypes.oneOf(['row', 'column']),
  couldAreaDrag: PropTypes.bool,
};

export default memo(WithDataHandle);