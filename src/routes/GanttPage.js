import React from 'react';
import Gantt from '../components/Gantt';
import styles from './GanttPage.less';

const GanttPage = props => {
  return (
    <div className={styles.wrapper}>
      <Gantt />
    </div>
  );
}

export default GanttPage;
