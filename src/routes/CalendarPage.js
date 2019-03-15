import React from 'react';
import { Calendar, Popover, Avatar, Input, Icon, Switch } from 'antd';
import classnames from 'classnames';
import styles from './CalendarPage.less';

function getListData(value) {
  let listData;
  switch (value.date()) {
    case 2:
      listData = [
        { type: 'a', title: '事假', startTime:'上午9:00', endTime: '上午11:00', content: 'This is warning event.', status: '审批中', by: '王杏' },
        { type: 'b', title: '年度总结dsssssssssssssssssssssss', showTime: '下午2:00', content: 'This is warning event.' },
        { type: 'b', title: '开会', showTime: '下午2:00', content: 'This is warning event.' },
        { type: 'a', title: '某某的生日', startTime:'上午9:00', endTime: '上午11:00', content: 'This is warning event.', status: '审批中', by: '王杏' },        { type: 'b', title: '开会', showTime: '下午2:00', content: 'This is warning event.' },
        { type: 'a', title: '某某的生日', startTime:'上午9:00', endTime: '上午11:00', content: 'This is warning event.', status: '审批中', by: '王杏' },
      ]; break;
    case 10:
      listData = [
        { type: 'b', title: '开会', showTime: '下午2:00', content: 'This is warning event.' },
        { type: 'a', title: '某某的生日', startTime:'上午9:00', endTime: '上午11:00', content: 'This is warning event.', status: '审批中', by: '王杏' },
      ]; break;
    case 15:
      listData = [
        { type: 'c', title: '绩效审核结果', content: 'This is warning event.' },
      ]; break;
    default:
  }
  return listData || [];
}

const ItemPopover = ({ data }) => {
  return (
    <div className={styles.popWrapper}>
    <div className={styles.popTitle}>{data.title}</div>
    {data.startTime && <p className={styles.time}>{data.startTime} 至 {data.endTime}</p>}
    {data.content && <p className={styles.content}>{data.content}</p>}
    {data.status && <p className={styles.status}>{data.status}</p>}
    {data.status && <p className={styles.by}><Avatar size="small" icon="user" />待{data.by}{data.status.slice(0, data.status.length - 1)}</p>}
    </div>
  );
}

function dateCellRender(value) {
  const listData = getListData(value);
  return (
    <ul className={styles.events}>
      {
        listData.map((item, index) => (
          <Popover key={index} content={<ItemPopover data={item} />} trigger="click" placement="rightTop">
            <li className={classnames(styles.item, {
              [styles.a]: item.type === 'a',
              [styles.b]: item.type === 'b',
              [styles.c]: item.type === 'c',
            })} >
              <div className={styles.placeholder} />
              <span className={styles.itemTitle}>{item.title}</span>
              {item.showTime && <span className={styles.showTime}>{item.showTime}</span>}
              {/* <Badge status={item.type} text={item.content} /> */}
            </li>
          </Popover>
        ))
      }
    </ul>
  );
}

const panelItems = ['所有日程', '任务', '事件流程', '流程审批', '考勤日历', '备忘', '其他']
const subordinates = ['蔡娟', '甘昊明']
const searchHistory = ['绩效任务', '生日', 'aa', '请假', '我的']

const CalendarPage = props => ( // monthCellRender={monthCellRender}
  <div className={styles.wrapper}>
    <div className={styles.calendar}>
      <div className={styles.title}>我的所有日程</div>
      <Calendar dateCellRender={dateCellRender}  /> 
    </div>
    <div className={styles.panel}>
      <div className={styles.panelTop}>
        <p className={styles.panelTitle} >我的日程</p>
        <ul className={styles.panelItems}>
          {panelItems.map(item => 
            <li key={item} className={styles.panelItem} >
              <div className={styles.itemTag} style={{ background: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)` }} />
              {item}
            </li>
          )}
        </ul>
        <p className={styles.panelSubordinate}>我的下属</p>
        <ul className={styles.panelItems}>
          {subordinates.map(item => 
            <li key={item} className={styles.panelItem} >
              <div className={styles.itemTag} style={{ background: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)` }} />
              {item}
            </li>
          )}
        </ul>
      </div>
      <div className={styles.panelBottom}>
        <p className={styles.panelTitle} >最近搜索</p>
        <div className={styles.searchWrapper}>
          <Input.Search
            className={styles.search}
            placeholder="搜索"
          />
        </div>
        <ul className={styles.searchHistory}>
          {searchHistory.map(histroy => 
            <li key={histroy} className={styles.history} >{histroy}<Icon type="close" /></li>
          )}
        </ul>
      </div>
      <p className={styles.switchWrapper}>我的日历: <span>公开</span><Switch className={styles.switch} /></p>
    </div>
  </div>
)

export default CalendarPage;