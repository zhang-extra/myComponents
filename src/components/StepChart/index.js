/** @format */

import React from 'react';
import { Steps, Button } from 'antd';
import styles from './index.less';
const Step = Steps.Step;
const ButtonGroup = Button.Group;

const Title = props => {
  const { onAddStep, onDeleteStep, title, index } = props;
  return (
    <div className={styles.title}>
      <a>{title}</a>
      <div className={styles.actions}>
        <ButtonGroup>
          <Button className={`${styles.button}`} icon="plus" onClick={() => onAddStep(index)} />
          <Button className={`${styles.button}`} icon="delete" onClick={() => onDeleteStep(index)} />
        </ButtonGroup>
      </div>
    </div>
  );
};

const Description = props => {
  return (
    <div className={styles.description}>
      {props.description}
    </div>
  );
};

const StepChart = props => {
  const { data, onAddStep, onDeleteStep } = props;
  return (
    <Steps current={data.length} direction="vertical" className={styles.stepChart}>
      {data.map((node, index) => (
        <Step
          status="process"
          key={node.id || node.name || node.title}
          title={<Title title={node.title} onAddStep={onAddStep} onDeleteStep={onDeleteStep} index={index} />}
          description={<Description description={node.description} />}
        />
      ))}
    </Steps>
  );
};

export default StepChart;
