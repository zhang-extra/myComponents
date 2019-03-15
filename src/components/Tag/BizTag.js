// @flow
import React, { Component } from 'react';
// import { SmartForm } from 'drs-platform-web';
import { connect } from 'dva';
import { Input, Icon, Popover } from 'antd';
import Loading from '../../components/feedback/Loading';
import Button from '../../components/general/Button';
// import { getFormUiOption } from '../helpers/builder';

import TagManagement from './TagManagement';
import Tag from '../../components/general/Tag';
import Link from '../../components/general/Link';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import styles from './BizTag.less';
type Props = {
};

type State = {};


const Search = Input.Search;
/**
 * 标签配置组件
 * 
 * @class BizTag
 * @extends {Component}
 */
class BizTag extends Component {
  props: Props;
  state: State;
  form: Object;
  constructor(props: Props) {
    super(props);
    const { dataSource } = props;
    this.state = {
      dataSource: dataSource ? dataSource : null,
      visible: false
    };
  }

  componentDidMount() {
    const { dispatch, bizName } = this.props;
    // 获取全部tags配置
    dispatch({ type: 'schema/getTags', payload: bizName });
    // 获取全部颜色配置
    // dispatch({ type: 'app/getAppConfig', payload: 'tagsColor' });
  }

  componentWillReceiveProps(nextProps: Props) {
    const { dataSource } = nextProps;
    const { dataSource: stateDataSource } = this.state;
    if (!stateDataSource) {
      this.setState({ dataSource });
    }
  }

  renderTagContent = () => {
    const { bizName } = this.props;
    const { dataSource } = this.state;
    const selectTags = _.map(dataSource, 'id');
    return (
      <TagManagement bizName={bizName} onClose={this.onClose} onSelect={this.onSelect} selectTags={selectTags} />
    );
  }

  handleVisibleChange = (visible) => {
    this.setState({ visible });
  }

  onClose = (id) => {
    const { dispatch, bizId, next, tags } = this.props;
    const { dataSource } = this.state;
    const deleteTags = [id];
    dispatch({ type: 'schema/deleteBizTag', payload: { tags: JSON.stringify(deleteTags), bizId } });
    const index = _.findIndex(tags, (o) => {
      return o.id === id;
    });
    if (index !== -1) {
      _.remove(dataSource, (o) => {
        return o.id === id;
      });
    }
    this.setState({ dataSource });
  }

  // 当前选择的tag
  onSelect = (selectTags: Array<any>, newTags, deleteTags) => {
    const { dispatch, bizId, next, tags } = this.props;
    const { dataSource } = this.state;
    if (newTags && newTags.length > 0) {
      dispatch({ type: 'schema/saveBizTag', payload: { tags: JSON.stringify(newTags), bizId } });
      const index = _.findIndex(tags, (o) => {
        return o.id === newTags[0];
      });
      if (index !== -1) {
        dataSource.push(tags[index]);
      }
    }
    if (deleteTags && deleteTags.length > 0) {
      dispatch({ type: 'schema/deleteBizTag', payload: { tags: JSON.stringify(deleteTags), bizId } });
      const index = _.findIndex(tags, (o) => {
        return o.id === deleteTags[0];
      });
      if (index !== -1) {
        _.remove(dataSource, (o) => {
          return o.id === deleteTags[0];
        });
      }
    }
    this.setState({ dataSource });
  }


  render() {
    const { } = this.props;
    const { dataSource, visible } = this.state;
    return (
      <div>
        {
          dataSource.map((item) => {
            return <span className={styles.tag} key={item.name}><Tag id={item.id} text={item.name} color={item.color} onClose={this.onClose} /></span>
          })
        }
        <Popover content={this.renderTagContent()} placement="bottom" trigger="click" onVisibleChange={this.handleVisibleChange} visible={visible}>
          <Link text="添加标签" />
        </Popover>
      </div>
    );
  }
}

const mapStateToProps = ({ schema, app }) => {
  const { tags } = schema;
  return {
    tags
  };
};

export default connect(mapStateToProps)(injectIntl(BizTag));
