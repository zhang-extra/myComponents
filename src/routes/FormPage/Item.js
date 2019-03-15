import React, { useRef, memo } from 'react';
import { Select, Switch, Slider, Button, Radio, Tooltip, InputNumber, Popconfirm, Input } from 'antd';
import SliderInput from './components/SliderInput';
import Choose from './itemContent/Choose';
import Time from './itemContent/Time';
import Answer from './itemContent/Answer';
import MyInput from './components/Input';
import styles from './Item.less';

const { TextArea } = Input;
const Option = Select.Option;

const types = {
  Paragraph: { name: '段落', extraContent: null },
  Answer: { name: '回答', extraContent: Answer },
  Radio: { name: '单选', extraContent: Choose },
  Checkbox: { name: '多选', extraContent: Choose },
  Time: { name: '日期', extraContent: Time }
};

const onClickItem = (event, thisItem, props) => {
  const { mode, data, pageInfo, deleteItem, cloneItem, isSelected, setSelectedItem } = props;
  if (mode !== 'edit') return;
  if (typeof event.nativeEvent.target.className === 'string' && event.nativeEvent.target.className.indexOf(styles.deleteIcon) !== -1) {
    thisItem.current.style['max-height'] = `${thisItem.current.clientHeight}px`;
    thisItem.current.parentNode.childNodes[0].style.display = 'none';
    setTimeout(() => thisItem.current.classList.add(styles.delete), 0);
    let timeOut = 0;
    pageInfo.deleteTimer = setInterval(() => {
      timeOut += 1;
      if (thisItem.current.clientHeight === 0 || timeOut >= 30) {
        deleteItem();
        clearInterval(pageInfo.deleteTimer);
        pageInfo.deleteTimer = null;             
      }
    }, 17);
  } else if (typeof event.nativeEvent.target.className === 'string' && event.nativeEvent.target.className.indexOf(styles.cloneIcon) !== -1) cloneItem();
  else if (!pageInfo.deleteTimer && !isSelected) setSelectedItem(data);
}

const Item = props => {
  const {  mode, isSelected, data, setData, setType, pageInfo, couldSectionDelete, deleteSection, itemIndex, showItemIndex, setShowItemIndex, setAllScore } = props;
  const { title, description, type, inputValue, cols, timeType, isRequired, score, calcScore, scoreRange, comment } = data;
  const thisItem = useRef(null);
  const ExtraContent = types[type] && types[type].extraContent;

  return (
    <li ref={thisItem} className={`${styles.wrapper} ${mode === 'edit' ? styles.editMode : ''} ${isSelected ? styles.isSelected : ''} ${type === 'SectionTitle' ? styles.sectionTitle : ''} ${showItemIndex ? styles.showItemIndex : ''}`} onClick={(event) => onClickItem(event, thisItem, props)}>
      {isRequired && <span className={`${styles.required} ${!showItemIndex ? styles.notShowItemIndex : ''}`}>*</span>}
      {type !== 'SectionTitle' && showItemIndex && <span className={styles.itemIndex}>{itemIndex}.</span>}
      {type === 'SectionTitle' && isSelected &&
        <div className={`${styles.itemIndexSwitchWrapper} ${!couldSectionDelete ? styles.notShowSectionDeleteButton : ''}`} >显示项标：
          <Switch className={styles.itemIndexSwitch} checkedChildren="是" unCheckedChildren="否" checked={showItemIndex} onChange={value => setShowItemIndex(value)} />
        </div>
      }
      {type === 'SectionTitle' && couldSectionDelete && isSelected &&
        <Popconfirm title="确认删除该块？" onConfirm={deleteSection} okText="确认" cancelText="取消">
          <Button className={styles.sectionDeleteButton} shape="circle" icon="close" />
        </Popconfirm>
      }
      {type === 'SectionTitle' && isSelected &&
        <SliderInput title='全部分值范围：' wrapperClassName={`${styles.allScoreSliderInput} ${styles.sliderInput}`} range={[-20, 20]} defaultValue={[0, 10]} setValue={value => setAllScore(value)}/>
      }
      {type !== 'SectionTitle' && isSelected &&  mode === 'edit' &&
        <Select className={styles.typeSelect} value={types[type].name} onSelect={value => setType(value)}>
          {Object.keys(types) && Object.keys(types).filter(itemType => itemType !== type).map(itemType => <Option key={itemType} value={itemType}>{types[itemType].name}</Option>)}
        </Select>  
      }
      {type !== 'SectionTitle' &&  mode === 'write' && calcScore !== false && 
        <InputNumber className={`${styles.typeSelect} ${styles.scoreInput}`} disabled={calcScore === 'auto'} min={calcScore === true ? scoreRange[0] : undefined} max={calcScore === true ? scoreRange[1] : undefined} value={score} onChange={value => setData('score', value)} />
      }
      {type !== 'SectionTitle' &&  mode === 'result' && calcScore !== false && 
        <span className={styles.scoreResult}>{score}分</span>
      }
      <MyInput 
        inputWrapperClassName={`${styles.title} ${type === 'SectionTitle' ? styles.titleHead : ''} ${description === null ? styles.notShowDescription : ''}`} 
        inputClassName={`${styles.titleInput} ${type === 'SectionTitle' ? styles.titleInputHead : ''}`} 
        // underlineClassName={styles.underline}
        focusUnderlineClassName={styles.focusUnderline}
        autoSize={false}
        showUnderline={isSelected}
        value={title}
        disabled={mode !== 'edit'}
        onChange={event => setData('title', event.target.value)} 
        placeholder={mode === 'edit' ? type === 'SectionTitle' ? '请输入块标题...' : '请输入项标题...' : ''}
      />
      {description !== null &&
        <TextArea 
          className={`${styles.description} ${!isSelected || mode !==  'edit' ? styles.notEdit : ''}`} 
          value={description}
          disabled={mode !== 'edit'}          
          onChange={event => setData('description', event.target.value)}
          spellCheck={false}
          autosize
          placeholder={mode === 'edit' ? type === 'SectionTitle' ? '请输入块说明...' : '请输入项说明...' : ''}
        />
      }
      {ExtraContent && <ExtraContent data={data} mode={mode} setData={setData} isSelected={isSelected} {...props} />}
      {comment !== null &&
        <TextArea 
          className={`${styles.description} ${styles.comment} ${mode !==  'write' ? styles.notEdit : ''}`} 
          value={comment}
          disabled={mode !== 'write'}          
          onChange={event => setData('comment', event.target.value)}
          spellCheck={false}
          autosize
          placeholder={type === 'SectionTitle' ? '请输入项评论...' : '请输入项评论...'}
        />
      }      
      {<div className={styles.placeholder} />}
      {isSelected && type !== 'SectionTitle' && <hr className={styles.horizontalLine} /> }
      {type !== 'SectionTitle' && mode === 'edit' &&
        <div className={styles.footer}>
          {calcScore === true && isSelected && <span>分值范围：</span>}
          {calcScore === true && isSelected && <SliderInput wrapperClassName={`${styles.footerItem} ${styles.sliderInput}`}  range={[-20, 20]} value={scoreRange} setValue={value => setData('scoreRange', value)}/>}
          {calcScore !== false && isSelected && (type === 'Radio' || type === 'Checkbox') && <span>自动计分：</span>}
          {calcScore !== false && isSelected && (type === 'Radio' || type === 'Checkbox') && 
            <Switch className={styles.footerItem} size="small" checkedChildren="是" unCheckedChildren="否" checked={calcScore === 'auto'} onChange={value => setData('calcScore', value ? 'auto' : true)}/>
          }
          计分：{isSelected &&
            <Switch className={styles.footerItem} size="small" checkedChildren="是" unCheckedChildren="否" checked={calcScore !== false} onChange={value => setData('calcScore', value)}/>
          }
          {(type === 'Radio' || type === 'Checkbox') && isSelected &&
            <Radio.Group size='small' className={styles.footerItem} value={cols} onChange={e => setData('cols', e.target.value)}>
              <Radio.Button value={1}>一列</Radio.Button>
              <Radio.Button value={2}>两列</Radio.Button>
              <Radio.Button value={3}>三列</Radio.Button>
              <Radio.Button value={4}>四列</Radio.Button>
            </Radio.Group>
          }
          {isSelected &&
            <Tooltip placement="top" title={'克隆项'}>
              <Button className={`${styles.footerItem} ${styles.cloneIcon}`} size="small" shape="circle" icon="copy" />
            </Tooltip>
          }
          {isSelected &&
            <Tooltip placement="top" title={'删除项'}>
              <Button className={`${styles.footerItem} ${styles.deleteIcon}`} size="small" shape="circle" icon="delete" />
            </Tooltip>            
          }
          必填：{isSelected &&
            <Switch className={styles.footerItem} size="small" checkedChildren="是" unCheckedChildren="否" checked={isRequired} onChange={value => setData('isRequired', value)}/>
          }
          显示说明：{isSelected &&
          <Switch className={styles.footerItem} size="small" checkedChildren="是" unCheckedChildren="否" checked={typeof description === 'string' ? true : false} onChange={value => setData('description', value ? '' : null)}/>
          }
          显示评论：{isSelected &&
          <Switch className={styles.footerItem} size="small" checkedChildren="是" unCheckedChildren="否" checked={typeof comment === 'string' ? true : false} onChange={value => setData('comment', value ? '' : null)}/>
          }
        </div>
      }
    </li>
  );
};

const shouldNotUpdate = (preProps, nextProps) => {
  return preProps.data === nextProps.data && preProps.mode === nextProps.mode && preProps.provided === nextProps.provided && preProps.itemIndex === nextProps.itemIndex  && preProps.isSelected === nextProps.isSelected && preProps.showItemIndex === nextProps.showItemIndex;
}

export default memo(Item, shouldNotUpdate);