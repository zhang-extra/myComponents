// @flow
import React, { memo } from 'react';
import TestQuestionTitle from './TestQuestionTitle';
import TestQuestionItem from './TestQuestionItem';
import cn from 'classnames';
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


const TestQuestion = props => {
  const { intl, index, title, isMove, dataSource, onChange, mode, categoryId, onScoreChange, onTextChange, remove, setEvalTpl } = props;
  const score = getScore(dataSource);
  
  const Item = memo(props => {
    const { data, selectItem, dragging, AreaItemNotDragging, dropPreview, selected, placeholder, index, itemInAreaDragging } = props;
    return (
      <div className={cn(styles.item, {
          [styles.dragging]: dragging,
          [styles.placeholder]: placeholder,
          [styles.dropPreview]: dropPreview,
          [styles.selected]: selected,
          [styles.AreaItemNotDragging]: AreaItemNotDragging,
          evaluateItem: mode !== 'edit',
          evaluateItemEdit: mode === 'edit'
        })}
      >
        <TestQuestionItem
          intl={intl}
          count={index + 1}
          data={data}
          categoryId={categoryId}
          categoryName={title}
          value={data.value}
          onChange={(data) => {
            onChange(title, data);
          }}
          dataSource={data.options}
          type={data.type}
          onScoreChange={onScoreChange}
          mode={mode}
          onTextChange={onTextChange}
          remove={() => remove(title, data.name)}
        />
      </div>
    );
  });
  return (
    <div className={className('list', { isMove })}>
      <TestQuestionTitle intl={intl} title={title} score={score} />
      <DropWrapper className={styles.itemWrapper}>
        <DropArea
          AreaId={`Area${index}`}
          onlyDropItSelf
          fix={false} 
          direction="column" 
          defaultItems={dataSource}
          defaultItemProps={{ width: '100%', height: 'fit-content' }} // eslint-disable-line
          newItemProps={{ width: '100%', height: 'fit-content' }}
          className={styles.component}
          Item={Item} 
          itemWrapperStyle={{ marginTop: '0px', marginLeft:'0px' }}
          dragItemHidden={false}
          // onChange={newData => console.log(newData)}
        />
      </DropWrapper>
    </div>
  );
};

export default TestQuestion;
