import React, { memo, useState, useEffect, useRef } from 'react';
import { Button, Radio, Select, Icon, Input, InputNumber, DatePicker, TimePicker, Switch, Checkbox } from 'antd';
import cloneDeep from 'lodash/cloneDeep';
import { DragDropWrapper, DropArea } from '../components/FlexWrapDNDArea';
import images from '../assets/config'
import className from 'classnames';
import styles from './FormDesignPage.less';


const value = [
  {
    type: 'input',
    title: '输入框',
    key: 'input',
  },
  {
    type: 'textArea',
    title: '多行文本框',
    key: 'textArea',
  },
  {
    type: 'selectNum',
    title: '数字输入框',
    key: 'selectNum',
  },
  {
    type: 'downSelect',
    title: '下拉选择框',
    key: 'downSelect',
  },
  {
    type: 'datePicker',
    title: '日期选择',
    key: 'datePicker',
  },
  {
    type: 'timePicker',
    title: '时间选择',
    key: 'timePicker',
  },
  {
    type: 'switch',
    title: '开关',
    key: 'switch',
  }
];

const { TextArea } = Input;
const Option = Select.Option;

const Item = memo(props => {
  const { connectDrag, connectDragPreview, data, index, areaId, isDragging, isPreview, isPlaced, isFasten,
    itemWidth, itemDirection, onSelect, selectedItem, onDelete } = props;
  const isSelected = data === selectedItem;
  const { type, title, specialWidth } = data;

  // const types ={
  //   input: { name: '输入框', extraContent: Input },
  //   textArea: { name: '多行文本框', extraContent: TextArea },
  //   selectNum: { name: '数字输入框', extraContent: InputNumber },
  //   downSelect: { name: '下拉选择框', extraContent: Select },
  //   datePicker: { name: '日期选择', extraContent: DatePicker },
  //   timePicker: { name: '日期选择', extraContent: TimePicker },
  //   switch: { name: '开关', extraContent: Switch },
  // }
  return connectDrag(
    <div 
      className={className(areaId === 'libArea' ? styles.item : styles.itemComponents,{
        [styles.dragging]: isDragging,
        [styles.preview]: isPreview,
        [styles.placed]: isPlaced,
        [styles.selected]: isSelected,
      })}
      style={{ flexDirection: itemDirection === 'vertical' && areaId !== 'libArea' ? 'column' : '', 
      justifyContent: itemDirection === 'vertical' && areaId !== 'libArea' ? 'center' : '', 
      height: itemDirection === 'vertical' && areaId !== 'libArea' ? '81px' : '', 
      margin: areaId === 'libArea' ? '8px' : '', 
      width: areaId === 'libArea' ? 'calc((100% - 32px) / 2)' : specialWidth || itemWidth }}
      onClick={areaId !== 'libArea' ? e => typeof e.target.className === 'string' && onSelect(index) : undefined}
    >
      <div className={styles.itemTitle} 
        style={{textAlign: itemDirection === 'vertical' && areaId !== 'libArea' ? 'left' : '',
        width: itemDirection === 'vertical' && areaId !== 'libArea' ? '50%' : '',
        // fontSize: itemWidth === '25%' && itemDirection === 'vertical' && areaId !== 'libArea' ? '14px' : '',
        marginBottom: itemDirection === 'vertical' && areaId !== 'libArea' ? '4px' : '',}}>
        {title}
      </div>
      {/* {areaId !== 'libArea'  && `(${itemDirection})`} */}

      {areaId !== 'libArea' && type === 'input' &&
        <Input className={styles.input} disabled />
      }
      {areaId !== 'libArea' && type === 'selectNum' &&
        <InputNumber className={styles.input} disabled/>
      }
      {areaId !== 'libArea' && type === 'downSelect' &&
        <Select
        className={styles.input}
        disabled
        showSearch
        placeholder="Select a person"
        optionFilterProp="children"
        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
      >
        <Option value="zhangsan">张三</Option>
        <Option value="lisi">李四</Option>
      </Select>
      }
      {areaId !== 'libArea' && type === 'datePicker' &&
        <DatePicker className={styles.input} disabled />
      }
      {areaId !== 'libArea' && type === 'textArea' &&
        <TextArea rows={1} className={styles.input} disabled />
      }
      {areaId !== 'libArea' && type === 'switch' &&
        <Switch checkedChildren="开" unCheckedChildren="关" defaultChecked disabled />
      }
      {areaId !== 'libArea' && type === 'timePicker' &&
        <TimePicker className={styles.input} disabled />        
      }

      {areaId !== 'libArea' &&
        <Icon className={styles.deleteIcon} type='close'
        style={{marginLeft: itemDirection === 'vertical' && areaId !== 'libArea' ? '42%' : ''}}
        onClick={() => onDelete(index)} />
      }
    </div>    
  );
})

const FormDesignPage = props => {
  const [itemWidth, setItemWidth] = useState('50%');
  const [itemDirection, setItemDirection] = useState('horizontal');
  const [formDesignData, setFormDesignData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const redoData = useRef([]);
  const undoData = useRef([]);

  const handleKeyUp = (event) => {
    if (event.ctrlKey && event.key === 'z' && undoData.current.length !== 0) undo();
    else if (event.ctrlKey && event.key === 'y' && redoData.current.length !== 0) redo();
  }

  useEffect(() => {
    window.addEventListener('keyup', handleKeyUp);
    return () => window.removeEventListener('keyup', handleKeyUp);
  });

  const onChange = (newValue) => {
    redoData.current = []; 
    undoData.current.push(formDesignData)
    setSelectedItem(null);
    setFormDesignData(newValue);
  };

  const undo = () => {
    redoData.current.push(formDesignData);
    setFormDesignData(undoData.current.pop());
  };

  const redo = () => {
    undoData.current.push(formDesignData)
    setFormDesignData(redoData.current.pop());
  };

  const onSelect = (index) => {
    setSelectedItem(formDesignData[index] === selectedItem ? null : formDesignData[index]);
  }

  const setAllItemWidth = event => {
    // console.log(event.target.value);
    formDesignData.forEach(item => delete item.specialWidth);
    setItemWidth(event.target.value);
  }

  const setSpecialItemWidth = event => {
    selectedItem.specialWidth = event.target.value;
    // console.log(event.target.value);
    setFormDesignData(formDesignData);
  }


  const onDelete = targetItemIndex => setFormDesignData(formDesignData.filter((_, index) => index !== targetItemIndex));

  const onChangeData = (key, newValue) => {
    selectedItem[key] = newValue;
    setFormDesignData(formDesignData);
  }
  // console.log(selectedItem);
  return (
    <DragDropWrapper className={styles.wrapper} >
      <div className={styles.formComponentLib}>
        <div className={styles.operationPanel}>
          <Radio.Group className={styles.leftRadio} value={itemWidth} onChange={setAllItemWidth} >
            <Radio.Button className={styles.leftButton} value='50%'>两列</Radio.Button>
            <Radio.Button className={styles.leftButton} value='33.33%'>三列</Radio.Button>
            <Radio.Button className={styles.leftButton} value='25%'>四列</Radio.Button>
          </Radio.Group>
          {/* <Button.Group className={styles.operation}>
            <Button className={styles.undoOperation} icon="undo" onClick={undo} disabled={undoData.current.length === 0} >undo-{undoData.current.length}</Button>
            <Button className={styles.redoOperation} icon="redo" onClick={redo} disabled={redoData.current.length === 0}>redo-{redoData.current.length}</Button>
          </Button.Group> */}
          {/* <Radio.Group className={styles.select} value={itemDirection} onChange={value => setItemDirection(value)}>  */}
          <Radio.Group className={styles.direction} value={itemDirection} onChange={value => setItemDirection(value.target.value)}> 
            <Radio.Button className={styles.directionButton} value="horizontal">水平</Radio.Button>
            <Radio.Button className={styles.directionButton} value="vertical">竖直</Radio.Button>
          </Radio.Group>
        </div>
        <DropArea
          className={styles.libArea}
          areaId='libArea'
          defaultValue={value}
          ItemRender={Item}
          itemFasten
          flexDirection="row"
        />
        {/* <DropArea
          className={styles.dustbin2}
          areaId='dustbin2'
          itemFasten
        >
          <Icon type="delete" />
        </DropArea> */}
      </div>
      <DropArea
        className={`${styles.formDesignArea} `}
        areaId='formDesignArea'
        value={formDesignData}
        onChange={onChange}
        ItemRender={Item}
        itemFasten={false}
        flexDirection="row"
        // custom props
        itemWidth={itemWidth}
        itemDirection={itemDirection}
        onSelect={onSelect}
        selectedItem={selectedItem}
        onDelete={onDelete}
      />
      <div className={styles.itemAttributePanel} >
        {selectedItem &&
          <div>
            <div className={styles.itemTitle}>{selectedItem.title}</div>
            <p className={styles.setSpecialItemWidth}>标题：</p>
            <Input value={selectedItem.title} onChange={e => onChangeData('title', e.target.value)} />
            <p className={styles.setSpecialItemWidth}>字段名：</p>
            <Input value={selectedItem.fieldName} onChange={e => onChangeData('fieldName', e.target.value)}/>
            <p className={styles.setSpecialItemWidth}>提示：</p>
            <Input value={selectedItem.prompt} onChange={e => onChangeData('prompt', e.target.value)}/>
            <p className={styles.setSpecialItemWidth}>默认值：</p>
            <Input value={selectedItem.default} onChange={e => onChangeData('default', e.target.value)}/>
            <hr className={styles.lineHr} />            
            <p className={styles.setSpecialItemWidth}>字段占宽:</p>
            <Radio.Group size='small' className={styles.rightRadio} onChange={setSpecialItemWidth} defaultValue='50%'>
              <Radio.Button className={styles.rightButton} value='100%'>一列</Radio.Button>
              <Radio.Button className={styles.rightButton} value='50%'>二列</Radio.Button>
              <Radio.Button className={styles.rightButton} value='33.33%'>三列</Radio.Button>
              <Radio.Button className={styles.rightButton} value='25%'>四列</Radio.Button>
            </Radio.Group>
            <hr className={styles.lineHr} />            
            <Checkbox value={selectedItem.required} onChange={e => onChangeData('required', e.target.checked)}>必填项</Checkbox>
          </div>
        }
      </div>
    </DragDropWrapper>
  );
}

export default FormDesignPage;
