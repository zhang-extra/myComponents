/** @format */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Button, Select } from 'antd';
import styles from './QueryRule.less';

const Option = Select.Option;
// { name: '', op: '', value: ['', ''] };

const handleInputValue1Change = (changedValue, condition, setCondition) => {
  const newCondition = condition;
  newCondition.value.splice(0, 1, changedValue);
  setCondition(newCondition);
};

const handleOperatorChange = (changedOperator, condition, setCondition) => {
  const newCondition = condition;
  newCondition.op = changedOperator;
  setCondition(newCondition);
};

const handleInputValue2Change = (changedValue, condition, setCondition) => {
  const newCondition = condition;
  newCondition.value.splice(1, 1, changedValue);
  setCondition(newCondition);
};

const QueryRule = memo(props => {
  const { onDelete, condition, setCondition } = props;

  return (
    <div className={styles.ruleWrapper}>
      <Select
        showSearch
        style={{ width: 200 }}
        placeholder="Select a person"
        optionFilterProp="children"
        onChange={changedValue => handleInputValue1Change(changedValue, condition, setCondition)}
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        <Option value="a">a</Option>
        <Option value="b">b</Option>
        <Option value="c">c</Option>
      </Select>
      <Select
        key="inputValue1"
        showSearch
        style={{ width: 200, marginLeft: '5%' }}
        placeholder="Select a person"
        optionFilterProp="children"
        onChange={changedOperator => handleOperatorChange(changedOperator, condition, setCondition)}
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        <Option value="+">+</Option>
        <Option value="-">-</Option>
        <Option value="*">*</Option>
        <Option value="/">/</Option>
      </Select>
      <Select
        showSearch
        style={{ width: 200, marginLeft: '5%' }}
        placeholder="Select a person"
        optionFilterProp="children"
        onChange={changedValue => handleInputValue2Change(changedValue, condition, setCondition)}
        filterOption={(input, option) =>
          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        <Option value="1">1</Option>
        <Option value="2">2</Option>
        <Option value="3">3</Option>
      </Select>
      <span className={styles.deleteIcon}>
        <Button className={styles.button} shape="circle" icon="delete" onClick={onDelete} />
      </span>
    </div>
  );
});

QueryRule.propTypes = {
  condition: PropTypes.object,
  onDelete: PropTypes.func,
  setCondition: PropTypes.func,
};

export default QueryRule;
