import React, { memo } from 'react';
import { DatePicker, TimePicker, Radio } from 'antd';
import styles from './Time.less';
import moment from 'moment';

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

const calcDefaultValue = (inputValue, dataFormat) => {
  return inputValue.length > 0 ? moment(inputValue[0], dataFormat) : undefined;
}

const Time = memo(({ data, mode, isSelected, setData, ...props}) => {
  const { timeType, inputValue } = data;
  
  return (
    <div className={styles.wrapper}>
      {mode === 'edit' && <p>请选择时间类型：&nbsp;</p>}
      {mode === 'edit' && 
        <Radio.Group size='small' disabled={!isSelected}  value={timeType} onChange={e => setData('timeType', e.target.value)}>
          <Radio.Button value={'startEndDate'}>开始/结束日期</Radio.Button>
          <Radio.Button value={'dateTime'}>日期/时间</Radio.Button>
          <Radio.Button value={'date'}>日期</Radio.Button>
          <Radio.Button value={'time'}>时间</Radio.Button>
      </Radio.Group>
      }
      {mode === 'write' && <p>请选择时间：&nbsp;</p>}
      {mode !== 'edit' && timeType === 'startEndDate' &&  <RangePicker className={styles.timerPick} disabled={mode !== 'write'} value={[moment(inputValue[0] ,'YYYY-MM-DD'), moment(inputValue[1] ,'YYYY-MM-DD')]} onChange={(_, value) => setData('inputValue', value)} />}
      {mode !== 'edit' && timeType === 'dateTime' &&  <DatePicker className={styles.timerPick} disabled={mode !== 'write'} value={calcDefaultValue(inputValue,'YYYY-MM-DD HH:mm')} onChange={( _,value) => setData('inputValue',[value])} showTime format="YYYY-MM-DD HH:mm" />}
      {mode !== 'edit' && timeType === 'date' &&  <DatePicker className={styles.timerPick} disabled={mode !== 'write'} value={calcDefaultValue(inputValue,'YYYY-MM-DD')} onChange={( _,value) => setData('inputValue',[value])}/>}
      {mode !== 'edit' && timeType === 'time' &&  <TimePicker className={styles.timerPick} disabled={mode !== 'write'} value={calcDefaultValue(inputValue,'HH:mm:ss')} onChange={( _,value) => setData('inputValue',[value])}/>} 
    </div>
    
  );
});

export default Time;