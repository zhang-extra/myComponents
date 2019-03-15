// @flow
import React from 'react';
import { Input, Select, Row, Col, Switch, Button, message } from 'antd';
import { compose, withState, mapProps, flattenProp, withHandlers, withPropsOnChange } from 'recompose';
import findIndex from 'lodash/findIndex';
import max from 'lodash/max';
import map from 'lodash/map';
import remove from 'lodash/remove';

import styles from './TplQuestionForm.less';


type Props = {
  form: any,
  dataScource: Array<Object>,
  commiting: boolean,
  onCancel: () => void,
  onSave: (Object, number) => void,
  data: Object
};

/**
 * 新增问题库问题表单
 *
 * @class TplQuestionForm
 * @extends {Component}
 */
const hoc = compose(
  withState('formState', 'setFormState', {
    maxKey: 0
  }),
  mapProps((props) => {
    return {
      question: {},
      ...props
    };
  }),
  withPropsOnChange(['data'], ({ data, setFormState }) => {
    if (data) {
      const { options } = data;
      const maxKey = max(map(options, 'key'));
      setFormState({ question: data, maxKey });
    }
  }),
  flattenProp('formState'),
  withHandlers(() => {
    return {
      onChange: ({ formState, setFormState }) => (change) => {
        setFormState({ ...formState, ...change });
      }
    };
  })
);
const TplQuestionForm = ({ intl, categoryId, question, dataScource, onChange, onCancel, name, maxKey, onSave }: Props) => {
  if (!question) {
    return <div />;
  }
  let category = categoryId;
  if (!category) {
    const index1 = findIndex(dataScource, { name });
    if (index1 !== -1) {
      category = dataScource[index1].id;
    }
  }
  const { type, options } = question;
  const onCategoryChange = (id) => {
    onChange({ categoryId: id });
  };
  const questionNameChange = (event) => {
    question.name = event.target.value;
    onChange({ question });
  };
  const questionTypeChange = (value) => {
    question.type = parseInt(value, 0);
    onChange({ question });
  };
  const onOk = () => {
    if (!question.type) {
      return message('error', intl.formatMessage({ id: 'typeIsNotNull' }));
    }
    if (!question.name) {
      return message('error', intl.formatMessage({ id: 'nameIsNotNull' }));
    }
    if (question.type === 2 && (!question.options || question.options.length < 2)) {
      return message('error', intl.formatMessage({ id: 'optionsIsNotNull' }));
    }
    onSave(question, category);
  };
  const addOptions = () => {
    if (!question.options) {
      question.options = [];
    }
    question.options.push({
      key: maxKey + 1,
      text: ''
    });
    onChange({ question, maxKey: maxKey + 1 });
  };
  const isScoringChange = (value) => {
    question.isScoring = value;
    onChange({ question });
  };
  const onOptionsChange = (option, event) => {
    const inde1 = findIndex(question.options, { key: option.key });
    if (inde1 !== -1) {
      question.options[inde1].text = event.target.value;
    }
    onChange({ question });
  };
  const removeOptions = (option) => {
    remove(question.options, { name: option.name });
    onChange({ question });
  };
  return (
    <div>
      <div className={styles.category}>
        <div className={styles.categoryTitle}>{intl.formatMessage({ id: 'common.text.categoryName' })}</div>
        <Select
          style={{ width: '100%' }}
          onChange={onCategoryChange}
          defaultValue={category}
          placeholder={intl.formatMessage({ id: 'common.text.selectType' })}
          className={styles.select}
        >
          {dataScource.map((item) => {
            return (
              <Select.Option value={item.id} key={item.id}>
                {item.name}
              </Select.Option>
            );
          })}
        </Select>
      </div>

      <div className={styles.category}>
        <div className={styles.categoryTitle}>{intl.formatMessage({ id: 'common.text.questionName' })}</div>
        <Input
          placeholder={intl.formatMessage({ id: 'common.text.inputQuesName' })}
          onChange={questionNameChange}
          value={question ? question.name : null}
        />
      </div>
      <div className={styles.category}>
        <div className={styles.categoryTitle}>{intl.formatMessage({ id: 'common.text.questionType' })}</div>
        <Select
          style={{ width: '100%' }}
          onChange={questionTypeChange}
          value={question ? question.type : null}
          placeholder={intl.formatMessage({ id: 'common.text.selectQuesType' })}
          className={styles.select}
        >
          <Select.Option value={2}>{intl.formatMessage({ id: 'common.text.select' })}</Select.Option>
          <Select.Option value={1}>{intl.formatMessage({ id: 'common.text.blanks' })}</Select.Option>
        </Select>
      </div>
      {type === 2 && (
        <div className={styles.addOption}>
          <Row>
            <Col span={12}>
              <div>
                <a text={intl.formatMessage({ id: 'common.text.addOptions' })} onClick={addOptions} />
              </div>
            </Col>
            <Col span={12} className={styles.scode}>
              <span>{intl.formatMessage({ id: 'common.text.isScoring' })}</span>
              <Switch checked={!!question.isScoring} size="small" onChange={isScoringChange} />
            </Col>
          </Row>
          {options &&
            options.map((item, index) => {
              return (
                <Row key={index} className={styles.optionItem}>
                  <Col span={23}>
                    <Input
                      onChange={e => onOptionsChange(item, e)}
                      defaultValue={item.text}
                      placeholder={intl.formatMessage({ id: 'common.text.inputOptionDes' })}
                    />
                  </Col>
                  <Col span={1}>
                    <a className={styles.cancelOption} onClick={() => removeOptions(item)}>
                      ×
                    </a>
                  </Col>
                </Row>
              );
            })}
        </div>
      )}
      {type === 1 && (
        <div className={styles.blankScode}>
          <span>{intl.formatMessage({ id: 'common.text.isScoring' })}</span>
          <Switch checked={!!question.isScoring} size="small" onChange={isScoringChange} />
        </div>
      )}

      <div className={styles.footer}>
        <Button  onClick={onCancel} className={styles.cancel} type="ghost">{intl.formatMessage({ id: 'common.text.cancel' })}</Button>
        <Button  onClick={onOk}>{intl.formatMessage({ id: 'common.text.save' })}</Button>
      </div>
    </div>
  );
};
export default hoc(TplQuestionForm);
