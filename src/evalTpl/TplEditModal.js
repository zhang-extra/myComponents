// @flow
import React from 'react';
import { compose, withState, withHandlers, withPropsOnChange } from 'recompose';
import { Row, Col, InputNumber, Button } from 'antd';
import styles from './TplEditModal.less';

import findIndex from 'lodash/findIndex';

type Props = {
  name: string,
  data: Object,
  onCancel: () => void,
  onNoticeOk: (Object, string) => void
};
/**
 * 评价表新增modal
 * 内容组件
 * @param {Props}
 */
const hoc = compose(
  withState('data', 'setData'),
  withPropsOnChange(['item'], ({ item, setData }) => {
    setData(item);
  }),
  withHandlers(() => {
    return {
      onScoreChange: ({ data, setData }) => (text, value) => {
        if (data.options) {
          const index = findIndex(data.options, { text });
          data.options[index].score = value;
        } else {
          data.defaultScore = value;
        }
        setData(data);
      }
    };
  })
);
const TplEditModal = ({ intl, data, onCancel, name, onScoreChange, onNoticeOk }: Props) => {
  if (!data) {
    return <div />;
  }
  const { isScoring } = data;
  const onOk = () => {
    if (onNoticeOk) {
      onNoticeOk(data, name);
    }
  };
  return (
    <div className={styles.evalItem}>
      <Row className={styles.tplEditItem}>
        <Col span={4} className={styles.QuesTitle}>
          {intl.formatMessage({ id: 'common.text.categoryName' })}:
        </Col>
        <Col span={20} className={styles.QuesName}>
          {name}
        </Col>
      </Row>
      <Row className={styles.tplEditItem}>
        <Col span={4} className={styles.QuesTitle}>
          {intl.formatMessage({ id: 'common.text.questionName' })}:
        </Col>
        <Col span={20} className={styles.QuesName}>
          {data.name}
        </Col>
      </Row>
      {data.type === 2 && (
        <div>
          <Row className={styles.tplEditItem}>
            <Col span={2} className={styles.QuesTitle}>
              {intl.formatMessage({ id: 'common.text.options' })}:
            </Col>
            <Col span={21} className={styles.QuesName}>
              <div className={styles.optionDistance}>
                {data.options &&
                  data.options.map((optionItem, index) => {
                    return (
                      <Row key={index} className={styles.option}>
                        <Col span={20} className={styles.options}>
                          {optionItem.text}
                        </Col>
                        {isScoring && (
                          <Col span={4}>
                            <InputNumber min={1} onChange={value => onScoreChange(optionItem.text, value)} />
                          </Col>
                        )}
                      </Row>
                    );
                  })}
              </div>
            </Col>
          </Row>
        </div>
      )}
      {data.type === 1 &&
        isScoring && (
          <Row className={styles.tplEditItem}>
            <Col span={2} className={styles.textGrade}>
              {intl.formatMessage({ id: 'common.text.grade' })}
            </Col>
            <Col span={21} className={styles.inputGrade}>
              <InputNumber min={1} onChange={value => onScoreChange(data.name, value)} />
            </Col>
          </Row>
        )}
      <div className={styles.footer}>
        <Button type="ghost" onClick={onCancel}>{intl.formatMessage({ id: 'common.text.cancel' })}</Button>
        <Button onClick={onOk} >{intl.formatMessage({ id: 'common.text.ok' })}</Button>
      </div>
    </div>
  );
};

export default hoc(TplEditModal);
