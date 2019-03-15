import React, { useState } from 'react';
import { Row, Col, Select, Button, Radio, InputNumber } from 'antd';
import styles from './index.less';

const Option = Select.Option;


const antdForm = () => {
  const [fields, setFields] = useState(['1', '2', '3']);
  const [rules, setRules] = useState(['身份证', '户口本', '国籍']);
  return(
    <div className={styles.wrapper}>
      <Row className={styles.oneRow} >
        <Col span={7} className={styles.titleCol}>账号字段名:</Col>
        <Col span={17}>
          <Select className={styles.selectWidth} >
            { fields.map((field, index) =>
              <Option key={index}>{field}</Option>
            )}
          </Select>
        </Col>
      </Row>
      <Row className={styles.oneRow}>
        <Col span={7} />
        <Col span={17}  className={styles.infoCol}>
          <Radio.Group size="small">
            <Radio.Button value="wu">无</Radio.Button>
            <Radio.Button value="quan">全屏</Radio.Button>
            <Radio.Button value="jian">简拼</Radio.Button>
            <Radio.Button value="shou">首字母</Radio.Button>
          </Radio.Group>
        </Col>
      </Row>
      <Row className={styles.oneRow} >
        <Col span={7} className={styles.titleCol}>密码规则:</Col>
        <Col span={17}>
          <Select className={styles.selectWidth} >
            { rules.map((rule, ruleIndex) =>
              <Option key={ruleIndex}>{rule}</Option>
            )}
          </Select>
        </Col>
      </Row>
      <Row className={styles.oneRow}>
        <Col span={7} />
        <Col span={17} className={styles.infoCol}>
          取
          <Radio.Group size="small">
            <Radio.Button value="qian">前</Radio.Button>
            <Radio.Button value="hou">后</Radio.Button>
          </Radio.Group>
          <InputNumber size='small'/>
          位
        </Col>
      </Row>
    </div>
  );
}
export default antdForm;