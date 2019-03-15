// @flow
import React, { Component } from 'react';
// import { SmartForm } from 'drs-platform-web';
import { connect } from 'dva';
import { Input, Row, Col, Icon } from 'antd';
// import Loading from '../components/feedback/Loading';
// import DataLabel from '../components/data-display/DataLabel';
// import { getFormUiOption } from '../helpers/builder';
import styles from './TagListItem.less';

type Props = {};

type State = {};

const Search = Input.Search;
/**
 * 标签配置列表Item
 *
 * @class TagListItem
 * @extends {Component}
 */
class TagListItem extends Component {
  props: Props;
  state: State;
  form: Object;
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // const { dispatch} = this.props;
    // dispatch({ type: 'schema/getSchema', payload: schemaName });
  }

  // 选择当前item
  onSelect = () => {
    const { onSelect, id } = this.props;
    if (onSelect) {
      onSelect(id);
    }
  };


  // 删除标签
  onRemove = (e)=>{
    const {onRemove,id} = this.props;
    if (onRemove) {
      onRemove(id);
    }
    e.stopPropagation();
  }

  // 编辑tag
  onEdit = (e) => {
    const { onEdit, id } = this.props;
    if (onEdit) {
      onEdit(id);
    }
    e.stopPropagation();
  };
  render() {
    const {
      color,
      title,
      onRemove,
      onEdit,
      defaultSelect = false
    } = this.props;

    return (
      <div className={styles.main} onClick={this.onSelect}>
        <Row>
          <Col span={2}>
            <div className={styles.cycle} style={{ background: color }} />
          </Col>
          <Col span={defaultSelect ? 13 : 16}>{title}</Col>
          <Col span={6} className={styles.icon}>
            <Icon type="edit" onClick={this.onEdit} id="edit" />
            <Icon type="delete" onClick={this.onRemove} />
          </Col>
          {defaultSelect && (
            <Col span={3} className={styles.check}>
              <Icon type="check" />
            </Col>
          )}
        </Row>
      </div>
    );
  }
}

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps)(TagListItem);
