import React, { memo, useRef } from 'react';
import { Icon } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import uniqueId from 'lodash/uniqueId';
import { ReactUtil } from '../../utils'
import Item from './Item';
import styles from './Section.less';

const getTotalScore = (items) => {
  let totalScore = 0;
  items.filter(item => item.calcScore).map(eachItem => totalScore += typeof eachItem.score === 'string' ? 0 : eachItem.score);
  totalScore = `${(totalScore - parseInt(totalScore)) > 0 ? totalScore.toFixed(2) : totalScore}分`;
  const notCalcScoreItems = items.filter(item => !item.calcScore);
  if (notCalcScoreItems.length === items.length) totalScore = '';
  return totalScore;
}

const setAllScore = (value, items, setItemData, sectionIndex) => {
  for (let i = 0, length = items.length; i < length; i += 1) {
    if (items[i].type !== 'SectionTitle') setItemData(sectionIndex, i, 'scoreRange', value);
  }
};

const Section = ({ sectionIndex, mode, data, selectedItem, setData, setItemData, setItemType, reorderItems, ...props }) => {
  const thisSection = useRef(null);
  ReactUtil.init(() => sectionIndex !== 0 && thisSection.current.scrollIntoView({ behavior: 'smooth' }));
  const { items, id, showItemIndex } = data;

  return (
    <DragDropContext onDragEnd={result => result.destination && reorderItems(sectionIndex, result.source.index, result.destination.index)}>
      <Droppable droppableId={id} >
        {(provided, snapshot) => (
          <ol
            ref={ref => { provided.innerRef(ref); thisSection.current = ref; }}
            className={`${styles.wrapper} ${mode !== 'edit' ? styles.notEdit : ''} ${snapshot.isDraggingOver ? styles.dragging : ''}`}
          >
            {(mode !== 'edit') && <span className={styles.totalScore}>{getTotalScore(items)}</span>}
            <Item
              itemIndex={0}
              mode={mode}
              data={items[0]}
              setData={(prop, newPropData) => setItemData(sectionIndex, 0, prop, newPropData)}
              setAllScore={value => setAllScore(value, items, setItemData, sectionIndex)}
              isSelected={mode === 'edit' && selectedItem.id === items[0].id}
              couldSectionDelete={sectionIndex !== 0}
              showItemIndex={showItemIndex}
              setShowItemIndex={value => setData('showItemIndex', value)}
              {...props}
            />
            {items && items.map((item, itemIndex) => {
              if (itemIndex === 0) return null;
              return (
                <Draggable key={item.id} draggableId={item.id} index={itemIndex} isDragDisabled={mode !== 'edit' || selectedItem.id !== item.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`${styles.ItemWrapper} ${snapshot.isDragging ? styles.dragging : ''}`}
                    >
                      <Icon className={`${styles.dragIcon} ${selectedItem.id === item.id && mode === 'edit' && styles.couldDrag}`} type="drag" {...provided.dragHandleProps} />
                      <Item
                        itemIndex={itemIndex}
                        showItemIndex={showItemIndex}
                        mode={mode}
                        data={item}
                        setData={(prop, newPropData) => setItemData(sectionIndex, itemIndex, prop, newPropData)}
                        setType={newType => setItemType(sectionIndex, itemIndex, newType)}
                        isSelected={mode === 'edit' && selectedItem.id === item.id}
                        {...props}
                      />
                    </div>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};

const shouldNotUpdate = (preProps, nextProps) => {
  return preProps.data === nextProps.data && preProps.mode === nextProps.mode && preProps.selectedItem.id === nextProps.selectedItem.id && preProps.sectionIndex === nextProps.sectionIndex;
}

export default memo(Section, shouldNotUpdate);