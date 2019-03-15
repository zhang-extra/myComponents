import React from 'react';
import { Calendar, Icon, Avatar, Input, Button, Radio } from 'antd';
import classnames from 'classnames';
import styles from './TrendsPage.less';

const members = [
  { key: 0, id: '蔡老师', avatar: '蔡', description: '项目负责人' },
  { key: 1, id: '张老师', avatar: '张', description: '项目负责人' }
]

const trends = [{
  type: 'a',
}, {
  type: 'b',
}, {
  type: 'c',
}, {
  type: 'c',
}]


const TrendsPage = props => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.panelLeft}>
        <div className={styles.inputArea}>
          <Input.TextArea placeholder="输入" autosize={{ minRows: 3, maxRows: 12 }} />
            <div className={styles.buttonArea}>
              <Radio.Group>
                <Button className={styles.button} type="primary" icon="check" />
                <Button className={styles.button} type="primary" icon="tag" />
                <Button className={styles.button} type="primary" icon="mobile" />
              </Radio.Group>
              <Button className={`${styles.button} ${styles.green}`} type="primary">发表</Button>
            </div>
        </div>
        <ul className={styles.trendsArea}>
          {trends && trends.length > 0 && <div className={styles.line} />}
          {trends && trends.map((trend, index) => 
            <li key={index} className={styles.trend}>
              <div className={styles.IconWrapper}>
                <Button
                  className={classnames(styles.typeIcon, {
                    [styles.a]: trend.type === 'a',
                    [styles.b]: trend.type === 'b',
                    [styles.c]: trend.type === 'c',
                  })}
                  shape="circle"
                  type="primary"
                  icon={trend.type === 'a' ? 'check' : trend.type === 'b' ? 'tag' : 'mobile'}
                  disabled
                />
              </div>
            </li>
          )}
        </ul>
      </div>
      <div className={styles.panelRight}>
        <Calendar fullscreen={false} />
        <ul className={styles.membersWrapper}>
          <span className={styles.memberTitle}>项目组成员 ({members.length})</span>
          <span className={styles.setting}>成员管理</span>
          <Icon className={styles.settingIcon} type="setting" />
          {members.map(member =>
            <li key={member.key} className={styles.member}>
              <Avatar size={48}>{member.avatar}</Avatar>
              <div className={styles.text}>
                <pre className={styles.id}>{member.id}</pre>
                <pre className={styles.description}>{member.description}</pre>
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default TrendsPage;