/** @format */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Radio, Button } from 'antd';
import QueueAnim from 'rc-queue-anim';
import uniqueId from 'lodash/uniqueId';
import cloneDeep from 'lodash/cloneDeep';
import styles from './QueryGroup.less';
import QueryRule from './QueryRule';

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const ButtonGroup = Button.Group;

const onHandleOperation = (operationType, value, props, changedValue) => {
  const newValue = operationType === 'initKey' ? value : cloneDeep(value);
  switch (operationType) {
    case 'initKey':
      for (let i = 0, length = newValue.conditions.length; i < length; i += 1) {
        if (!newValue.conditions[i].key) newValue.conditions[i].key = uniqueId();
      }
      return;
    case 'setType':
      newValue.type = changedValue.type;
      break;
    case 'addRule':
      newValue.conditions.splice(changedValue.index < 0 ? 0 : changedValue.index, 0, {
        name: 'status',
        op: null,
        value: [],
        key: uniqueId(),
      });
      break;
    case 'addGroup':
      newValue.conditions.splice(changedValue.index < 0 ? 0 : changedValue.index, 0, {
        type: 'OR',
        conditions: [],
        key: uniqueId(),
      });
      break;
    case 'deleteCondition':
      newValue.conditions.splice(changedValue.index, 1);
      break;
    case 'setCondition':
      newValue.conditions[changedValue.index] = changedValue.newCondition;
      break;
    default:
      break;
  }
  if (props.onChange) props.onChange(newValue);
};

const onChildGroupChange = (parentGroupValue, childGroupNewValue, index, props) => {
  onHandleOperation('setCondition', parentGroupValue, props, {
    newCondition: childGroupNewValue,
    index,
  });
};

const QueryGroup = memo(props => {
  const { root, value, onDelete } = props;
  onHandleOperation('initKey', value, props);

  return (
    <div className={`${styles.groupWrapper} ${root ? styles.root : ''}`}>
      {
        <div className={styles.operatorWrapper}>
          <RadioGroup
            onChange={event =>
              onHandleOperation('setType', value, props, { type: event.target.value })
            }
            value={value.type}
          >
            <RadioButton
              className={`${styles.button} ${styles.leftButton}`}
              value="AND"
              disabled={!root ? true : value.conditions.length < 2}
            >
              AND
            </RadioButton>
            <RadioButton
              className={`${styles.button} ${styles.leftButton}`}
              value="OR"
              disabled={!root ? false : value.conditions.length < 2}
            >
              OR
            </RadioButton>
          </RadioGroup>
          <ButtonGroup>
            <Button
              className={`${styles.button} ${styles.rightButton}`}
              icon="plus"
              onClick={() =>
                onHandleOperation('addRule', value, props, { index: value.conditions.length })
              }
            >
              Add rule
            </Button>
            <Button
              className={`${styles.button} ${styles.rightButton}`}
              disabled={!root}
              icon="plus-circle"
              onClick={() =>
                onHandleOperation('addGroup', value, props, { index: value.conditions.length })
              }
            >
              Add group
            </Button>
            {!root && (
              <Button
                className={`${styles.button} ${styles.deleteButton}`}
                icon="delete"
                onClick={onDelete}
              />
            )}
          </ButtonGroup>
        </div>
      }
      <QueueAnim duration={444}>
        {value.conditions &&
          value.conditions.map((condition, index) => {
            if (condition.type) {
              return (
                <QueryGroup
                  key={condition.key}
                  value={condition}
                  onChange={newValue => onChildGroupChange(value, newValue, index, props)}
                  onDelete={() => onHandleOperation('deleteCondition', value, props, { index })}
                />
              );
            }
            return (
              <QueryRule
                key={condition.key}
                condition={condition}
                setCondition={newCondition =>
                  onHandleOperation('setCondition', value, props, { newCondition, index })
                }
                onDelete={() => onHandleOperation('deleteCondition', value, props, { index })}
              />
            );
          })}
      </QueueAnim>
    </div>
  );
});

QueryGroup.propTypes = {
  root: PropTypes.bool,
  value: PropTypes.object,
  onChange: PropTypes.func,
  onDelete: PropTypes.func,
};

export default QueryGroup;
