/** @format */

import React, { memo, useState } from 'react';
import { Slider, InputNumber } from 'antd';
import styles from './SliderInput.less';

const SliderInput = props => {
  const { range, value, defaultValue, setValue, wrapperClassName, title } = props;
  const [innerValue, setInnerValue] = useState(defaultValue);
  const usedValue = value || innerValue;
  return (
    <div className={`${styles.wrapper} ${wrapperClassName}`}>
      {title && <span>{title}</span>}
      {range[0] < 0 && (
        <InputNumber
          size="small"
          className={styles.input}
          min={range[0]}
          max={range[1]}
          value={usedValue[0]}
          onChange={changedValue => {
              if (defaultValue && !value) setInnerValue([changedValue, usedValue[1]]);
              setValue([changedValue, usedValue[1]]);
            }
          }
        />
      )}
      <Slider
        className={styles.slider}
        range={range[0] < 0}
        min={range[0]}
        max={range[1]}
        // value={value ? (range[0] < 0 ? value : value[1]) : undefined}
        value={range[0] < 0 ? usedValue : usedValue[1]}
        onChange={changedValue => {
            if (defaultValue && !value) setInnerValue(range[0] < 0 ? changedValue : [usedValue[0], changedValue]);
            setValue(range[0] < 0 ? changedValue : [usedValue[0], changedValue])
          }
        }
      />
      <InputNumber
        size="small"
        className={styles.input}
        min={range[0]}
        max={range[1]}
        // value={(value && value[1]) || undefined}
        value={usedValue[1]}
        onChange={changedValue => {
            if (defaultValue && !value) setInnerValue([usedValue[0], changedValue]);
            setValue([usedValue[0], changedValue]);
          }
        }
      />
    </div>
  );
};

export default memo(SliderInput);
