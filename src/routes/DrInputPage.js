import React, { useState } from 'react';
import { Dropdown, Icon, Input } from 'antd';
import styles from './DrInputPage.less';

const Menu = (
  <div style={{ background: 'red', width: 200, height: 200 }}>
  </div>
);

const Siffix = props => {
  const { value, setValue } = props;
  return (
    <div className={styles.siffix} >
      {value &&
        <Icon className={styles.emptyIcon} type="close" onClick={() => setValue('')} />
      }
      <Dropdown overlay={Menu} placement="bottomCenter" trigger={['click']}>
        <Icon className={styles.dropDownIcon} type='down' />
      </Dropdown >
    </div>
  );
}

const DrInputPage = props => {
  const [value, setValue] = useState('');
  const onChange = event => setValue(event.target.value);

  return (
    <div className={styles.wrapper}>
      <Input
        className={styles.input}
        value={value}
        onChange={onChange}
        suffix={<Siffix value={value} setValue={setValue} />}
      />
    </div>
  );
}

export default DrInputPage;
