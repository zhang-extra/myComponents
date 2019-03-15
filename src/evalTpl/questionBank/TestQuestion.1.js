// @flow
import React from 'react';
import TestQuestionTitle from './TestQuestionTitle';
import TestQuestionItem from './TestQuestionItem';
import styles from './TestQuestion.less';
import { DropWrapper, DropArea } from '../../components/CustomSort';

import classNames from 'classnames/bind';

const className = classNames.bind(styles);

type Props = {
  // 类别
  title: string,
  // 问题数据源
  dataSource: Array<Object>,
  // mode(edit,write,check)
  mode: string,
  // 文本内容监听
  onTextChange: (value: string, title: string) => void,
  // 选择题监听
  onChange: (text: string, title: string) => void,
  remove: () => void,
  // TODO check模式下的数据传入
  isMove: Boolean
};

const getScore = (data) => {
  let score = 0;
  data.forEach((item) => {
    if (item.score) score += item.score;
  });
  return score;
};

const TestQuestion = ({ intl, title, isMove, dataSource, onChange, mode, categoryId, onScoreChange, onTextChange, remove }: Props) => {
  const score = getScore(dataSource);
  return (
    <div className={className('list', { isMove })}>
      <TestQuestionTitle intl={intl} title={title} score={score} />
      <div className={styles.itemWrapper}>
        {dataSource &&
          dataSource.map((item, index) => {
            return (
              <div
                className={className(styles.item, {
                  evaluateItem: mode !== 'edit',
                  evaluateItemEdit: mode === 'edit'
                })}
                key={item.name}
              >
                <TestQuestionItem
                  intl={intl}
                  count={index + 1}
                  data={item}
                  categoryId={categoryId}
                  categoryName={title}
                  value={item.value}
                  onChange={(data) => {
                    onChange(title, data);
                  }}
                  dataSource={item.options}
                  type={item.type}
                  onScoreChange={onScoreChange}
                  mode={mode}
                  onTextChange={onTextChange}
                  remove={() => remove(title, item.name)}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default TestQuestion;
