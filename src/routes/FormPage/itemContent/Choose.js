import React, { memo } from 'react'; 
import produce from 'immer';
import uniqueId from 'lodash/uniqueId';
import { Radio, Checkbox, Icon, InputNumber } from 'antd';
import Input from '../components/Input';
import styles from './Choose.less';

const MyRadio = memo(({ data, mode, isSelected, setData, ...props}) => {
  const { options, cols, type, inputValue, score, calcScore, } = data;
  const Choose = type === 'Radio' ? Radio : Checkbox;
  const Group = Choose.Group;

  const onTitleChange = (value, optionIndex) => {
    setData('options', produce(options, draftOptions => {
      draftOptions[optionIndex].title = value;
    }));
  }

  const onScoreChange = (value, optionIndex) => {
    setData('options', produce(options, draftOptions => {
      draftOptions[optionIndex].score = value;
    }));
  }

  const onAddRadio = () => {
    setData('options', produce(options, draftOptions => {
      draftOptions.push({ title: '', id: uniqueId(), score: 0 })
    }));
  }

  const onDeleteRadio = (optionIndex) => {
    setData('options', produce(options, draftOptions => {
      draftOptions.splice(optionIndex, 1)
    }));
  }

  const handleSelect = (event) => {
    if(type === 'Radio') {
      setData('inputValue', event.target.value)
      setData('score', options.filter(option => option.id === event.target.value)[0].score);
    } else {
      let totalScore = 0;
      options.filter(option => event.indexOf(option.id) !== -1).map(op => totalScore += op.score);
      setData('inputValue', event)
      setData('score', totalScore);
    };
  }

  return (
    <Group name="radiogroup" className={styles.wrapper} value={inputValue} onChange={handleSelect}>
      {options && options.map((option, optionIndex) => 
        <Choose key={option.id} className={`${styles.chooseLine} ${isSelected ? styles.selected : ''}`} style={{ width: `${100 / cols}%`, overflow:'hidden'}} value={option.id} disabled={mode !== 'write'}>
          <Input
            inputWrapperClassName={styles.optionInputWrapper}
            inputClassName={styles.optionInput} 
            // underlineClassName={styles.underLine}
            focusUnderlineClassName={styles.focusUnderline}
            autoSize={false}
            showUnderline={isSelected}
            value={option.title}
            disabled={mode !== 'edit'}          
            onChange={event => onTitleChange(event.target.value, optionIndex)} 
            placeholder={mode === 'edit' ? '请输入选项说明...' : ''}
          />
          {calcScore === 'auto' && mode === 'edit' && isSelected &&
            <InputNumber className={styles.scoreInput} value={option.score} onChange={value => onScoreChange(value, optionIndex)} />
          }
          {calcScore === 'auto' && mode !== 'edit' &&
            <span className={styles.score}>{option.score}分</span>
          }
          {isSelected && mode === 'edit' && <Icon className={styles.closeIcon} type='close' onClick={() => onDeleteRadio(optionIndex)}/>}         
        </Choose>)}
      {mode === 'edit' && isSelected &&
        <Choose disabled value={'AddGroup'} className={styles.chooseLine} > 
          <span className={styles.chooseAdd} onClick={onAddRadio}>点击新增选项</span>
        </Choose>
      }
    </Group>

  );
});

export default MyRadio;