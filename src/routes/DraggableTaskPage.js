import React, { memo, useState, useRef } from 'react';
import { Icon, Checkbox, Modal, Avatar, message, Input, Button } from 'antd';
import { DragDropWrapper, SortableList } from '../components/SortableList';
import classNames from 'classnames';
import cloneDeep from 'lodash/cloneDeep';
import dayjs from 'dayjs';
import styles from './DraggableTaskPage.less';

let itemIndex = 1;

const getLabels = (count) => {
  return Array.from({ length: count }, (v, k) => k).map(k => {
    if (Math.random() < 0.2) return '重要';
    else if (Math.random() < 0.4) return 'logo问题';
    else if (Math.random() < 0.6) return '不重要';
    else if (Math.random() < 0.8) return '还好';
    else return '立即';
  });

}

const getItems = (count, listId) =>
  Array.from({ length: count }, (v, k) => k).map(k => ({
    key: `${listId}-item-${itemIndex}`,
    title: `item ${itemIndex++}`,
    description: '习近平指出，贯彻落实党的十九大确定的目标任务，是当前和未来中央政治局的工作主题，也是中央政治局同志的主要任务。',
    avatar: itemIndex,
    labels: getLabels(Math.random() * 12),
    date: new Date(),
    message: parseInt(Math.random() * 1000),
    members: [0, 4, 7],
    link: parseInt(Math.random()* 3 + 1),
    trends: [{
      member: '甘昊明',
      action: '创建了任务',
      date: '2017-12-20'
    }, {
      member: '甘昊明',
      action: '把任务分配给谁谁谁',
      date: '今天'
    }]
  }));

const initListData = { 
  value: {
    合同阶段: getItems(2, '合同阶段'),
    需求阶段: getItems(4, '需求阶段'),
    检验阶段: getItems(6, '检验阶段'),
    验收阶段: getItems(8, '验收阶段'),
  },
}

const Item = memo(props => {
  const { connectDragRef, connectDrag, connectDragHandle, connectDragStyle, connectSelect, 
    data, index, listId, isDragging, isSelected, isDraggedItem, draggedItemsCount, setSettingItem, ...otherProps } = props;
  const { title, avatar, labels, date, message, link } = data;
  const [checked, setChecked] = useState(false);

  return (
    <div
      className={classNames(styles.item, {
        [styles.dragging]: isDragging,
        [styles.selected]: isSelected,
        [styles.draggedItem]: isDraggedItem,
        [styles.checked]: checked
      }, `-${index}`)}
      ref={connectDragRef}
      {...connectDrag}
      {...connectDragHandle}
      onClick={event => connectSelect && typeof event.target.className === 'string' && event.target.className.indexOf('ant-checkbox-input') === -1 && connectSelect(event)}
    > 
      <div><Checkbox defaultChecked={false} onChange={event => setChecked(event.target.checked)} /></div>
      <div>
        <p>{title}</p>
        <div className={styles.labels}>{labels.map((label, index) => 
          <p 
            key={index} 
            style={{ background: label === '还好' || label === 'logo问题' ? '#69c0ff' : label === '重要' ? '#ff7875' : '#95de64' }}
          >
          {label}
          </p>)}
        </div>
        <div className={styles.footPanel}>
          <Icon type="clock-circle" />
          <span>{dayjs(date).format('MM-DD')}</span>
          <Icon type="bars" onClick={() => setSettingItem({ listId, index, data: cloneDeep(data) })}/>
          <Icon type="message" />
          <span>{message}</span>
          <Icon type="link" />
          <span>{link}</span>
        </div>
      </div>
      <div><Avatar size="large" >{avatar}</Avatar></div>
      {isDragging && isDraggedItem && draggedItemsCount > 1 && <div className={styles.count}>{draggedItemsCount}</div>}
    </div>
  );
})

const List = memo(props => {
  const { listId, listData, listOrder, onChange, isDragging, setSettingItem, setListOrder } = props;
  const list = useRef(null);

  const handleDeleteChecked = () => {
    const checkedItemIndex = [];
    list.current.querySelectorAll(`.${styles.checked}`).forEach(item => checkedItemIndex.push(parseInt(item.className.substr(item.className.lastIndexOf('-') + 1))));
    if (checkedItemIndex.length === 0) message.warning('没有选中任何项目', 1);
    else Modal.confirm({
      title: '是否确认删除选中项目?',
      content: '删除后数据无法回复',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        listData.value[listId] = listData.value[listId].filter((_, index) => checkedItemIndex.indexOf(index) === -1);
        onChange(listData);
      },
    });
  }

  const handleClickSetting = () => {

  }

  return (
    <div
      ref={list}
      className={styles.listWrapper}
      draggable
      onDragStart={e => {
          e.dataTransfer.setData("dragList", listId);
        }
      }
      onDragOver={e => {
          e.preventDefault();
        }
      }
      onDrop={e => {
          const draggedListId = e.dataTransfer.getData("dragList");
          if (!draggedListId || draggedListId === listId) return;
          [listOrder[draggedListId], listOrder[listId]] = [listOrder[listId], listOrder[draggedListId]];
          setListOrder(listOrder);
        }
      }    
    >
      <div className={styles.head}>
        <span className={styles.title}>{listId}</span>
        <div className={styles.iconGroup}>
          <Icon type="delete" onClick={handleDeleteChecked} />
          <Icon type="setting" onClick={handleClickSetting} />
        </div>
      </div>
      <SortableList
        className={`${styles.list} ${isDragging ? styles.dragging : ''}`}
        listId={listId}
        data={listData}
        onChange={onChange}
        ItemRender={Item}
        direction='vertical'
        // multiDrag

        setSettingItem={setSettingItem}
      />
      <div className={styles.foot}>
        <Icon type="plus-circle" />
        <span className={styles.title}>新建任务</span>
      </div>
    </div>
  )
});

const initListOrder = {
  合同阶段: 0,
  需求阶段: 1,
  检验阶段: 2,
  验收阶段: 3,
}

const DraggableTaskPage = props => {
  const [listData, setListData] = useState(initListData);
  const [listOrder, setListOrder] = useState(initListOrder);
  const [settingItem, setSettingItem] = useState(null);
  const onListDataChange = newData => setListData(newData);
  const { isDragging, draggedItemIndex, selectedList, selectedItems } = listData;
  return (
    <div className={styles.wrapper}> 
      <DragDropWrapper data={listData} onChange={onListDataChange} >
        {Object.entries(listData.value).sort((list1, list2) => listOrder[list1[0]] < listOrder[list2[0]] ? -1 : 1).map(([listId, _]) =>
          <List
            key={listId}
            listId={listId}
            listData={listData}
            listOrder={listOrder}
            onChange={onListDataChange}
            isDragging={isDragging && selectedList === listId}
            setSettingItem={setSettingItem}
            setListOrder={setListOrder}
          />
        )}
      </DragDropWrapper>
      <Modal
        visible={settingItem !== null}
        closable={true}
        onOk={() => {
            setSettingItem(null);
            Modal.confirm({
              title: '是否确认保存修改?',
              okText: '确认',
              okType: 'danger',
              cancelText: '取消',
              onOk() {
                listData.value[settingItem.listId][settingItem.index] = settingItem.data;
                setListData(listData);
              }
            });
          }
        }
        onCancel={() => setSettingItem(null)}
        >
          {settingItem && 
            <div className={styles.setting}>
              <p className={styles.title}>{settingItem.data.title}</p>
              <p className={styles.description}>{settingItem.data.description}</p>
              <p className={styles.memberText}>参与者</p>
              <div className={styles.members}>
                {settingItem.data.members.map(member =>
                  <Avatar key={member} className={styles.avatar} size="small" >{member}</Avatar>
                )}
                <Avatar className={styles.addMember} size="small" icon="plus" />
              </div>
              <hr className={styles.areaLine} />
              <div className={styles.tagArea} >
                <Icon className={styles.tagIcon} type="clock-circle" />
                <p>截止日期</p>
                <span className={styles.deadline}>{dayjs(settingItem.data.date).format('MM-DD')}</span>
              </div>
              <div className={styles.tagArea}>
                <Icon className={styles.tagIcon} type="tag" />
                <p>标签</p>
                <div className={styles.labels}>
                  {settingItem.data.labels.map((label, index) => 
                    <p 
                      key={index}
                      className={styles.label}
                      style={{ background: label === '还好' || label === 'logo问题' ? '#69c0ff' : label === '重要' ? '#ff7875' : '#95de64' }}
                    >
                    {label}
                    </p>
                  )}
                  <Icon
                    className={styles.addLabel}
                    type="plus-circle"
                    onClick={() => {
                        settingItem.data.labels.push('123');
                        setSettingItem(settingItem);
                      }
                    } 
                  />
                </div>
              </div>
              <div className={styles.tagArea}>
                <Icon className={styles.tagIcon} type="link" />
                <a>添加链接</a>
              </div>
              <p className={styles.areaText}>评论</p>
              <hr className={styles.areaLine} />
              <Input.TextArea
                className={styles.textArea}
                autosize={{ minRows: 3, maxRows: 7 }}
                placeholder="输入评论内容"
              />
              <div className={styles.button}><Button type="primary">发布评论</Button></div>
              <p className={styles.areaText}>动态</p>
              <hr className={styles.areaLine} />
              {settingItem.data.trends.map((trend, index) => 
                <p key={index} className={styles.trends}>
                  <span className={styles.member}>{trend.member}</span>
                  <span className={styles.action}>{trend.action}</span>
                  <time className={styles.date}>{trend.date}</time>
                </p>
              )}
          </div>
        }
      </Modal>
    </div>
  );
}

export default DraggableTaskPage;