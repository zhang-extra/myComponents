import React, { memo, useState, useRef } from 'react';
import styles from './Task.less';

const Task = props => {
  const [process, setProcess] = useState(0.1);
  const taskRef = useRef(null);
  const processRef = useRef(null);
  const processBarRef = useRef(null);
  const duration = 8;
  const width = 40;
  const height = 40;

  const handleSliderStart = () => {
    document.body.style.cursor = 'move';
    document.addEventListener('mouseleave', handleSliderEnd);
    document.addEventListener('mouseup', handleSliderEnd);
    document.addEventListener('mousemove', handleSlider);
  }

  const handleSliderEnd = event => {
    event.stopPropagation();
    event.preventDefault();
    document.body.style.cursor = 'default';
    document.removeEventListener('mouseleave', handleSliderEnd);
    document.removeEventListener('mouseup', handleSliderEnd);
    document.removeEventListener('mousemove', handleSlider);
  };

  const handleSlider = event => {
    event.stopPropagation();
    event.preventDefault();
    const taskBound = taskRef.current.getBoundingClientRect();
    let newProcess = (event.clientX - taskBound.left) / taskBound.width;
    if (newProcess < 0 || newProcess > 1) {
      newProcess = newProcess < 0 ? 0 : 1;
    }
    if (newProcess === 0) processBarRef.current.style.transform = 'translateX(100%)';
    else processBarRef.current.style.transform = 'translateX(0)';
    setProcess(newProcess);
  }

  const handleScaleStart = () => {
    document.body.style.cursor = 'col-resize';
    document.addEventListener('mouseleave', handleScaleEnd);
    document.addEventListener('mouseup', handleScaleEnd);
    document.addEventListener('mousemove', handleScale);
  };

  const handleScaleEnd = event => {
    event.stopPropagation();
    event.preventDefault();
    document.body.style.cursor = 'default';
    document.removeEventListener('mouseleave', handleScaleEnd);
    document.removeEventListener('mouseup', handleScaleEnd);
    document.removeEventListener('mousemove', handleScale);
  };

  const handleScale = () => {
    const taskBound = taskRef.current.getBoundingClientRect();
  };

  return (
    <div
      ref={taskRef}
      className={styles.task}
      style={{ width: duration * width, height: height }}
    >
      <div className={`${styles.scaleBar} ${styles.right}`} />
      <div ref={processRef} className={styles.process} style={{ width: `${process * 100}%` }}>
        <div className={`${styles.scaleBar} ${styles.left}`} />
        <div ref={processBarRef} className={styles.processBar} onMouseDown={handleSliderStart}/>
      </div>
    </div>
  )
};

export default memo(Task);