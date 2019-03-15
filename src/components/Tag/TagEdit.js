// @flow
import React, { Component } from 'react';
// import { SmartForm } from 'drs-platform-web';
import { connect } from 'dva';
import { Input, Row, Col, Icon } from 'antd';
import { injectIntl, intlShape } from 'react-intl';
import Button from '../../components/general/Button';
import styles from './TagEdit.less';

type Props = {
};

type State = {};

const Search = Input.Search;
/**
 * 标签编辑组件
 * 
 * @class TagEdit
 * @extends {Component}
 */
class TagEdit extends Component {
  props: Props;
  state: State;
  form: Object;
  constructor(props: Props) {
    super(props);
    const { editData } = props;
    const { color, name } = editData || {};
    this.state = {
      tagName: name ? name : '',
      selectColor: color ? color : ''
    };
  }

  componentDidMount() {
    // const { dispatch} = this.props;
    // dispatch({ type: 'schema/getSchema', payload: schemaName });
  }

  onChangeTagName = (e) => {
    this.setState({ tagName: e.target.value });
  }


  // 选择颜色
  onClickColor = (item) => {
    const { key, color } = item;
    this.setState({ selectColor: color });
  }


  // 完成确认
  onClick = () => {
    const { onCommit, editData } = this.props;
    const { tagName, selectColor } = this.state;
    if (editData) {
      const newEditData = editData;
      newEditData.name = tagName;
      newEditData.color = selectColor;
      if (onCommit) {
        onCommit(newEditData);
      }
    } else {
      const newEditData = {};
      newEditData.name = tagName;
      newEditData.color = selectColor;
      onCommit(newEditData);
    }
  }

  onClose = () => {
    const { onClose, onBack } = this.props;
    if (onClose) {
      onClose();
      onBack();
    }
  }

  render() {
    const { color, onBack, onClose, tagsColor, intl } = this.props;
    const { tagName, selectColor } = this.state;
    return (
      <div className={styles.main}>
        <div className={styles.title}>
          <Icon type="left" onClick={onBack} />
          <span>{intl.formatMessage({ id: 'common.text.editTag' })}</span>
          <Icon type="close" onClick={this.onClose} />
        </div>
        <Input onChange={this.onChangeTagName} value={tagName} />
        <div className={styles.colors}>
          {
            tagsColor.map((item,key) => {
              return (
                <div className={styles.cycle} style={{ background: item.color }} key={item.key} onClick={() => this.onClickColor(item)}>
                  {
                    item.color === selectColor && <Icon className={styles.checkIcon} type="check" />
                  }
                   {
                    _.isEmpty(selectColor)&& key===0 && <Icon className={styles.checkIcon} type="check" />
                  }
                </div>
              );
            })
          }
        </div>
        <Button text={intl.formatMessage({ id: 'common.text.completed' })} width="large" onClick={this.onClick} />
      </div>
    );
  }
}

export default injectIntl(TagEdit);
