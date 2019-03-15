import React, { memo } from 'react';
import { Input } from 'antd';
import styles from './Answer.less';

const { TextArea } = Input;

const Answer = props => {
  const { data, mode, setData } = props;
  const { inputValue } = data;
  return (
    <TextArea
      className={styles.wrapper} 
      rows={4}
      disabled={mode !== 'write' }
      value={inputValue}onChange={event => setData('inputValue', event.target.value)}
      placeholder='请回答...'
    />
  );
};

export default memo(Answer);