import React, { memo } from 'react';
import styles from './TestQuestionTitle.less';

const TestQuestionTitle = memo((props) => {
  const { title, score, intl } = props;
  return (
    <div className={styles.title}>
      {title}
      <div className={styles.score}>{score}<span>{intl.formatMessage({ id: 'common.text.score' })}</span></div>
    </div>
  );
});

export default TestQuestionTitle;
