import React, { memo, useState, useRef } from 'react';
import Task from './Task';
import styles from './index.less';

const Gantt = props => {

  return (
    <div className={styles.gantt}>
      <Task />
    </div>
  )
};

export default memo(Gantt);