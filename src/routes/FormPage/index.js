/** @format */

import React, { useRef } from 'react';
import { Button, Icon, Tooltip, Modal, message } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import cloneDeep from 'lodash/cloneDeep'
import Section from './Section';
import Input from './components/Input';
import styles from './index.less';
import sectionStyle from './Section.less';

import { pipe } from '../../rehook/';
import { initPage, withSetData } from './handler';

message.config({
  top: 72,
  duration: 1,
  maxCount: 3,
});

const reorderSectionsModal = (showModal, setModal, sections, setData, setSelectedItem, pageInfo) => {
  const reorderSections = (startItemIndex, endItemIndex) => {
    console.log(cloneDeep(sections), startItemIndex, endItemIndex)
    const [removed] = sections.splice(startItemIndex, 1);
    console.log(cloneDeep(sections))
    sections.splice(endItemIndex, 0, removed);
    console.log(removed, cloneDeep(sections))
  };
  
  return (
    <Modal
      title="重排块序"
      visible={showModal}
      closable={false}
      okText="确认"
      cancelText="取消"
      onOk={() => { setData('sections', sections); setModal(false); setSelectedItem(sections[0].items[0]); pageInfo.header.current.scrollIntoView(); }}
      onCancel={() => setModal(false)}
    >
      <DragDropContext onDragEnd={result => result.destination && reorderSections(result.source.index, result.destination.index)}>
        <Droppable droppableId={'ReorderSections'} >
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              className={`${styles.modalWrapper} ${snapshot.isDraggingOver ? styles.dragging : ''}`}
            >
              {sections && sections.map((section, index) => 
                <Draggable key={section.id} draggableId={section.id} index={index} >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`${styles.modalItemWrapper} ${snapshot.isDragging ? styles.dragging : ''}`}
                    >
                      <Icon type="ordered-list" className={styles.modalItemIcon}/>
                      {section.items[0].title || `未命名块${section.id}`}
                    </div>
                  )}
                </Draggable>
                )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Modal>
  );
};

const FormsPage = ({ getData, data, setData, setSectionData, mode, showModal, setModal, setMode, addSection, addItem, setSelectedItem, ...props }) => {
  const { title, sections } = data;
  const pageInfo = { deleteTimer: null, header: useRef(null) };

  return (
    <div className={styles.wrapper} >
      <div ref={pageInfo.header} className={styles.header} >
        {/* <Button size='small' onClick={value => setMode('edit')}>编辑模式</Button>
        <Button size='small' onClick={value => setMode('write')}>答题模式</Button>
        <Button size='small' onClick={value => setMode('result')}>结果模式</Button> */}
        <Button className={styles.saveButton} icon='cloud-upload' size='large' onClick={() => message.success('成功', 1)}>{mode === 'edit' ? '保存' : '提交'}</Button>
        <Input
          inputWrapperClassName={styles.title}
          inputClassName={styles.titleInput} 
          focusUnderlineClassName={styles.titleFocusUnderline} 
          placeholder="请输入表单标题..."
          value={title}
          autoSize
          showUnderline={false}
          disabled={mode !== 'edit'}
          onChange={event => setData('title', event.target.value)} 
        />
      </div>
      <div className={styles.content}>
        {sections && sections.map((section, sectionIndex) => (
          <Section
            key={section.id}
            sectionIndex={sectionIndex}
            data={section}
            setData={(prop, newPropData) => setSectionData(sectionIndex, prop, newPropData)}
            mode={mode}
            pageInfo={pageInfo}
            setSelectedItem={setSelectedItem}
            {...props}
          />
        ))}
      </div>
      {mode === 'edit' &&
        <div className={styles.affix}>
          <Tooltip placement='right' title={'新增项'}>
            <Button shape="circle" icon='plus' size='large' onClick={addItem}/>
          </Tooltip>
          <Tooltip placement='right' title={'新增块'}>
            <Button shape="circle" icon='block' size='large' onClick={addSection}/>
          </Tooltip>
          <Tooltip placement='right' title={'排序块'}>
            <Button shape='circle' icon='sort-ascending' size='large' onClick={() => setModal(true) }/>
          </Tooltip>
        </div>
      }
      <Tooltip placement="top" title={'回到顶部'}>
        <Button className={styles.toTop} size="large" shape="circle" icon="to-top" onClick={() => { setSelectedItem(sections[0].items[0]); pageInfo.header.current.scrollIntoView({ behavior: 'smooth' }); } } />
      </Tooltip>
      {showModal && reorderSectionsModal(showModal, setModal, cloneDeep(sections), setData, setSelectedItem, pageInfo)}
    </div>
  );
};

export default pipe(initPage, FormsPage);
