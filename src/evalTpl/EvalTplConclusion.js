import React, { memo } from 'react';
import { Input } from 'antd';

const { TextArea } = Input;

const EvalTplConclusion = memo(props => {
  const { className, resultTitle, result, mode, summaryTitle, summary, onResultChange, onSummaryChange } = props;
  return (
    <div className={className}>
      {resultTitle}
      <Input onChange={onResultChange} value={result} disabled={mode !== 'write'} />
      {summaryTitle}
      <TextArea disabled={mode !== 'write'} rows={6} onChange={onSummaryChange} value={summary} />
    </div>
  );
});

export default EvalTplConclusion;
