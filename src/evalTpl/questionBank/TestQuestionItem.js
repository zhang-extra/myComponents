// @flow
import React from 'react';
import { Row, Col, Icon, Radio, InputNumber, Input } from 'antd';
import classNames from 'classnames/bind';
import styles from './TestQuestionItem.less';

import isEmpty from 'lodash/isEmpty';
import isObject from 'lodash/isObject';
import cloneDeep from 'lodash/cloneDeep';
import findIndex from 'lodash/findIndex';

const classnames = classNames.bind(styles);
const RadioGroup = Radio.Group;
const { TextArea } = Input;

type Props = {
  // 计数
  count: number,
  // 类型  出题模式或做题模式或查看模式
  mode: string,
  // icon大小
  iconSize: number,
  // 编辑
  edit: () => void,
  // 移除
  remove: () => void,
  // onChange
  onChange: Object => void
};

/**
 * 评价表Item
 * 内容组件
 * @param {Props}
 */
const TestQuestionItem = ({ intl, data, onChange, mode, count, iconSize, remove }: Props) => {
  const onScoreChange = (event) => {
    const newData = cloneDeep(data);
    if (isObject(event)) {
      const index = findIndex(data.options, { text: event.target.value });
      newData.score = data.options[index].score;
      newData.value = event.target.value;
    } else {
      newData.score = event;
    }
    if (onChange) onChange(newData);
  };
  const onValueChange = (event) => {
    data.value = event.target.value;
    if (onChange) onChange(data);
  };
  const isEditMode = mode === 'edit';
  return (
    <Row
      className={classnames({
        item: mode === 'edit',
        itemSelect: mode === 'write',
        itemCheck: mode === 'check'
      })}
    >
      <Col span={20}>
        <div className={styles.title}>
          {count}
          .&nbsp;
          {data.name}
        </div>
        {data.type === 2 && (
          <RadioGroup value={data.value} className={styles.radioGroup} onChange={onScoreChange} disabled={mode !== 'write'}>
            {data.options &&
              data.options.map((item) => {
                return (
                  <Col span={8} key={item.text}>
                    <Radio value={item.text} score={item.score} className={styles.radio}>
                      {item.text}
                      {data.isScoring &&
                        item.score && (
                          <span>
                            ({item.score}
                            {intl.formatMessage({ id: 'common.text.score' })})
                          </span>
                        )}
                    </Radio>
                  </Col>
                );
              })}
          </RadioGroup>
        )}
        {data.type === 1 && (
          <div className={styles.radioGroup}>
            <TextArea style={{ width: '80%' }} rows={4} disabled={mode !== 'write'} onChange={onValueChange} />
            {data.isScoring && (
              <div className={styles.inputNumber}>
                <span>{intl.formatMessage({ id: 'common.text.graded' })}:</span>
                <InputNumber disabled={mode !== 'write'} value={data.score} min={0} max={data.defaultScore} onChange={onScoreChange} />
              </div>
            )}
          </div>
        )}
      </Col>
      {isEditMode && <Icon type="delete" className={styles.deleteIcon} onClick={remove} />}
    </Row>
  );
};

export default TestQuestionItem;
