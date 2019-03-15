/** @format */

// @flow
import React, { memo } from 'react';
import { Button } from 'antd';
import EvalTplConclusion from './EvalTplConclusion';
// import TestQuestion from './questionBank/TestQuestion'; 拖拽
import TestQuestion from './questionBank/TestQuestion.1';
import styles from './EvalTplDetail.less';

const Loading = () => {
  return <div className={styles.loading}>loading</div>;
};

const EvalTplDetail = memo(props => {
  const {
    className,
    intl,
    mode,
    result,
    summary,
    evalTpl,
    onSave,
    onRemove,
    onChange,
    onTplChange,
    onTplCategoriesChange,
  } = props;
  if (!evalTpl) {
    return <Loading />;
  }
  return (
    <div className={`${styles.wrapper} ${className}`}>
      {evalTpl.categories.map((item, index) => 
        <TestQuestion
          key={index}
          index={index}
          onChange={onTplCategoriesChange}
          intl={intl}
          title={item.name}
          dataSource={item.items}
          mode={mode}
          remove={onRemove}
        />)}
      {mode === 'check' && evalTpl.requireResult && 
        <EvalTplConclusion
          className={styles.evalTplConclusion}
          mode={mode}
          result={result}
          summary={summary}
          onResultChange={event => onChange({ result: event.target.value })}
          onSummaryChange={event => onChange({ summary: event.target.value })}
          resultTitle={intl.formatMessage({ id: 'common.text.option' })}
          summaryTitle={intl.formatMessage({ id: 'common.text.synthesis' })}
        />}
      {mode !== 'check' &&
        <Button className={styles.saveButton} onClick={onSave}>
          {intl.formatMessage({ id: 'common.text.save' })}
        </Button>}
    </div>
  );
});

export default EvalTplDetail;
