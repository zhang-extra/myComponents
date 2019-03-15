// @flow
import React, { Component } from 'react';
// import { SmartForm } from 'drs-platform-web';
import { connect } from 'dva';
import { Input, Icon } from 'antd';
import Loading from '../../components/feedback/Loading';
import Button from '../../components/general/Button';
import InformationCue from '../../components/feedback/InformationCue';

import TagListItem from './TagListItem';
import TagEdit from './TagEdit';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import styles from './TagManagement.less';
type Props = {
};

type State = {};


const Search = Input.Search;
/**
 * 标签配置组件
 * 
 * @class TagManagement
 * @extends {Component}
 */
class TagManagement extends Component {
  props: Props;
  state: State;
  form: Object;
  constructor(props: Props) {
    super(props);
    const { selectTags } = props;
    this.state = {
      edit: false,
      searchTag: null,
      editId: null,
      selectTags: selectTags ? selectTags : [],
      newSelectColor: null
    };
  }

  componentDidMount() {
    const { dispatch, bizName } = this.props;
    // 获取全部tags配置
    dispatch({ type: 'schema/getTags', payload: bizName });
    // 获取全部颜色配置
    dispatch({ type: 'app/getAppConfig', payload: 'tagsColor' });
  }

  componentWillReceiveProps(nextProps: Props) {
    const { commiting: nextCommiting, error, selectTags } = nextProps;
    const { selectTags: stateSelectTags } = this.state;
    const { commiting, intl } = this.props;
    if (commiting && !nextCommiting) {
      if (error) {
        const config = {
          description: intl.formatMessage({ id: 'common.message.error' }),
          duration: 2,
          message: intl.formatMessage({ id: 'common.text.commitError' })
        };
        InformationCue('notification', 'error', config);
      } else {
        this.onBack();
      }
    }
    if (!_.isEqual(stateSelectTags, selectTags) && selectTags && _.isArray(selectTags)) {
      this.setState({ selectTags });
    }
  }

  // 编辑或新增标签
  onAddTag = (id: number) => {
    if (id) {
      this.setState({ edit: true, editId: id });
    } else {
      this.setState({ edit: true, editId: null });
    }

  }

  onChangeSearch = (e) => {
    this.setState({ searchTag: e.target.value });
  }

  emitEmpty = () => {
    this.setState({ searchTag: null });
  }

  onBack = () => {
    this.setState({ edit: false });
  }


  // 提交数据
  onCommit = (commitData) => {
    const { dispatch, bizName } = this.props;
    commitData.bizName = bizName;
    const next = [
      { type: 'getTags', payload: bizName }
    ];
    dispatch({ type: 'schema/saveTag', payload: { tag: commitData, bizName, next } });
  }


  // 选中
  onSelect = (id) => {
    const { onSelect } = this.props;
    const { selectTags } = this.state;
    const index = _.findIndex(selectTags, (o) => {
      return o === id;
    });
    const newTags = [];
    const deleteTags = [];
    if (index === -1) {
      selectTags.push(id);
      newTags.push(id);
    } else {
      _.remove(selectTags, (o) => {
        if (o === id) {
          deleteTags.push(o);
          return o===id; 
        }
      });
    }
    this.setState({ selectTags });
    if (onSelect) {
      onSelect(selectTags,newTags,deleteTags);
    }
  }

  // 删除
  onRemove = (id) => {
    const { dispatch, bizName } = this.props;
    const next = [
      { type: 'getTags', payload: bizName }
    ];
    dispatch({ type: 'schema/deleteTag', payload: { id, next } });
  }

  // 搜索框中新增标签
  newTag = () => {
    const { newSelectColor, searchTag } = this.state;
    const { bizName } = this.props;
    const commitData = {
      bizName,
      color: newSelectColor,
      name: searchTag
    }
    this.onCommit(commitData);
  }

  // 选择新建标签颜色
  onClickColor = (color) => {
    this.setState({ newSelectColor: color });
  }

  // 渲染空白搜索时，显示创建的内容
  renderEmptyContent = () => {
    const { tagsColor, intl } = this.props;
    const { newSelectColor } = this.state;
    return (
      <div>
        <div className={styles.colors}>
          {
            tagsColor.map((item,key) => {
              return (
                <div className={styles.cycle} style={{ background: item.color }} key={item.key} onClick={() => this.onClickColor(item.color)}>
                  {
                    item.color === newSelectColor && <Icon className={styles.checkIcon} type="check" />
                  }
                  {
                    _.isEmpty(newSelectColor)&& key===0 && <Icon className={styles.checkIcon} type="check" />
                  }
                </div>
              );
            })
          }
        </div>
        <Button text={intl.formatMessage({ id: 'common.text.create' })} width="large" onClick={this.newTag} />
      </div>
    );
  }

  render() {
    const { bizOption, bizSchema, mode, value, data, tags, tagsColor, onClose, intl } = this.props;
    if (!tags || !tagsColor) {
      return <Loading />;
    }
    const { edit, searchTag, selectTags, editId } = this.state;
    let editData = null;
    if (editId) {
      const index = _.findIndex(tags, (o) => {
        return o.id === editId;
      });
      if (index !== -1) {
        editData = tags[index];
      }
    }
    let displayTags = [];
    if (searchTag || !_.isEmpty(searchTag)) {
      for (const item of tags) {
        if (item.name.toLowerCase().indexOf(searchTag.toLowerCase()) !== -1) {
          displayTags.push(item);
        }
      }
    } else {
      displayTags = tags;
    }
    return (
      <div className={styles.tagManager}>
        {
          !edit ? <div className={styles.tagInput}>
            <Input
              suffix={<Icon type="plus-square-o" onClick={this.onAddTag} />}
              value={searchTag}
              onChange={this.onChangeSearch}
              placeholder={intl.formatMessage({ id: 'common.text.searchTag' })}
            />
            <div>
              {
                displayTags && displayTags.length > 0 && displayTags.map((item) => {
                  const index = _.findIndex(selectTags, (o) => {
                    return o === item.id;
                  });
                  return (
                    <TagListItem color={item.color} title={item.name} key={item.id} id={item.id} onRemove={this.onRemove} onEdit={this.onAddTag} onSelect={this.onSelect} defaultSelect={index !== -1} />
                  );
                })
              }
              {
                displayTags.length === 0 && this.renderEmptyContent()
              }
            </div>
          </div> : <div><TagEdit onBack={this.onBack} onCommit={this.onCommit} editData={editData} tagsColor={tagsColor} onClose={onClose} /></div>
        }
      </div>
    );
  }
}

const mapStateToProps = ({ schema, app }) => {
  const { tags, commiting, error } = schema;
  const { tagsColor } = app;
  return {
    tags,
    commiting,
    error,
    tagsColor
  };
};

export default connect(mapStateToProps)(injectIntl(TagManagement));
