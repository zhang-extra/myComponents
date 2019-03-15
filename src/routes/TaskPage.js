import React from 'react';
import { Collapse, Icon, Button, Checkbox } from 'antd';
import dayjs from 'dayjs';
import styles from './TaskPage.less';

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
    avatar: itemIndex,
    labels: getLabels(Math.random() * 12),
    date: new Date(),
    message: parseInt(Math.random() * 1000),
    members: [0, 4, 7],
    link: parseInt(Math.random()* 3 + 1),
    description: '习近平指出，贯彻落实党的十九大确定的目标任务，是当前和未来中央政治局的工作主题，也是中央政治局同志的主要任务。',
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

const Header = ({ title }) => {
  return (
    <div className={styles.header} >
      {title}
      <hr />
      <Icon className={styles.headerIcon} type="delete" />
      <Icon className={styles.headerIcon} type="setting" />
    </div>
  );
}

const TaskPage = props => {
  return (
    <div className={styles.wrapper}>
      <Collapse className={styles.collapse} bordered={false} >
        {Object.entries(initListData.value).map(([listId, listData]) => 
          <Collapse.Panel className={styles.panel} key={listId} header={<Header title={listId} />} >
            {listData.map((data, index) =>
              <div key={index} className={styles.item}>
                <Checkbox className={styles.checkbox} />
                <div className={styles.textArea}>
                  <p className={styles.title} >{data.title}</p>
                  <p className={styles.description}>{data.description}</p>
                </div>
                <div className={styles.labelArea}>{data.labels.map((label, index) => 
                  <p 
                    key={index} 
                    style={{ background: label === '还好' || label === 'logo问题' ? '#69c0ff' : label === '重要' ? '#ff7875' : '#95de64' }}
                  >
                  {label}
                  </p>)}
                </div>
                <Icon className={styles.timeIcon} type="clock-circle" />
                <span className={styles.timeText}>{dayjs(data.date).format('MM-DD')}</span>
              </div>
            )}
            <div className={styles.item}>
              <Button style={{ marginLeft: -36 }}>新建任务</Button>
            </div>
          </Collapse.Panel>
        )}
      </Collapse>
      <Button style={{ marginLeft: '10%' }}>新建</Button>
    </div>
  );
}

export default TaskPage;