/** @format */

// @flow
import React, { memo } from 'react';
import { Input, Menu, Dropdown, Icon, Button, Modal } from 'antd';
import { withRouter } from 'react-router-dom';
import { compose, withState, withHandlers, mapProps, lifecycle, flattenProp } from 'recompose';
import confirm from './confirm';
import findIndex from 'lodash/findIndex';
import findLastIndex from 'lodash/findLastIndex';
import cloneDeep from 'lodash/cloneDeep';
import remove from 'lodash/remove';
import TplQuestionForm from './questionBank/TplQuestionForm';
import TplEditModal from './TplEditModal';
import styles from './EvalLibrary.less';
import { noticeHoc } from './hoc';
import Collapse from './Collapse';
import { getData, postData } from '../lib/utils';

// 问题库
const enhance = compose(
  withRouter,
  withState('libraryState', 'setLibraryState', { visible: false, type: '' }),
  withState('libraries', 'setLibraries'),
  mapProps(({ ...resetForm }) => {
    return {
      ...resetForm,
    };
  }),
  flattenProp('libraryState'),
  noticeHoc,
  lifecycle({
    componentDidMount() {
      const { setLibraries, onError } = this.props;
      getData('/api/class/comm_eval_library', { all: 1 }).then(({ data, error }) => {
        if (error) {
          onError(error);
        } else {
          setLibraries(data);
        }
      });
    },
  }),
  withHandlers(() => {
    return {
      onChange: ({ libraryState, setLibraryState }) => change => {
        setLibraryState({ ...libraryState, ...change });
      },
      onAddTplItemOk: ({ setChangeQuestion, libraryState, setLibraryState }) => (data, name) => {
        setChangeQuestion({ data, name });
        setLibraryState({ ...libraryState, visible: false });
      },
      onCommitQuestion: ({
        intl,
        activeQuestion,
        libraries,
        onError,
        onSuccess,
        libraryState,
        setLibraryState,
      }) => (question, categoryId) => {
        const index = findIndex(libraries, { id: categoryId });
        if (index !== -1) {
          let flag = false;
          if (activeQuestion) {
            const index1 = findLastIndex(libraries[index].items, { name: activeQuestion.name });
            if (index1 !== -1) {
              libraries[index].items[index1] = question;
              flag = true;
            }
          } else if (!activeQuestion) {
            flag = true;
            libraries[index].items.push({ ...question });
          }
          if (flag) {
            postData(`/api/class/comm_eval_library/${categoryId}`, libraries[index], 'PUT').then(
              ({ error }) => {
                if (error) {
                  onError(error);
                } else {
                  onSuccess(intl.formatMessage({ id: 'commitQuestionSuccess' }));
                  setLibraryState({ ...libraryState, visible: false });
                }
              },
            );
          }
        }
      },
      onRemoveQuestion: ({ intl, onError, onSuccess, libraries, setLibraries }) => (id, name) => {
        const index = findIndex(libraries, { id });
        confirm({ content: intl.formatMessage({ id: 'comfrirmDelete' }) }, () => {
          if (index !== -1) {
            const index1 = findIndex(libraries[index].items, { name });
            if (index1 !== -1) {
              const library = cloneDeep(libraries[index]);
              library.items.splice(index1, 1);
              postData(`/api/class/comm_eval_library/${id}`, library, 'PUT').then(({ error }) => {
                if (error) {
                  onError(error);
                } else {
                  libraries[index] = library;
                  onSuccess(intl.formatMessage({ id: 'deleteQuestionSuccess' }));
                  setLibraries(libraries);
                }
              });
            }
          }
        });
      },
      onDelLibray: ({ intl, onError, onSuccess, libraries, setLibraries }) => data => {
        const length = (data.items || []).length;
        confirm(
          {
            title: intl.formatMessage({ id: 'comfrirmDelete' }),
            content: intl.formatMessage({ id: 'deletelibrary' }, `${length}个问题将被删除`),
          },
          () => {
            postData(`/api/class/comm_eval_library/${data.id}`, null, 'DELETE').then(
              ({ error }) => {
                if (error) {
                  onError(error);
                } else {
                  remove(libraries, { id: data.id });
                  onSuccess(intl.formatMessage({ id: 'deleteLibraryCategorySuccess' }));
                  setLibraries(libraries);
                }
              },
            );
          },
        );
      },
      onCommitCategory: ({
        intl,
        newCategoryName,
        libraryState,
        setLibraryState,
        modul,
        onError,
        onSuccess,
        libraries,
        setLibraries,
      }) => () => {
        if (!newCategoryName) {
          return onError(intl.formatMessage({ id: 'categoryNameIsNotNull' }));
        }
        postData('/api/class/comm_eval_library', { modul, name: newCategoryName, items: [] }).then(
          ({ data, error }) => {
            if (error) {
              onError(error);
            } else {
              libraries.push(data);
              onSuccess(intl.formatMessage({ id: 'commitLibraryCategorySuccess' }));
              setLibraries(libraries);
              setLibraryState({ ...libraryState, visible: false });
            }
          },
        );
      },
      onCancel: ({ libraryState, setLibraryState }) => () => {
        setLibraryState({ ...libraryState, visible: false, type: '', id: '' });
      },
    };
  }),
);

/**
 * 评价/问题库
 *
 */
const EvalLibrary = memo(props => {
  const { className, libraries, type, id, activeQuestion, visible, onCancel, intl, name, title, onChange, onDelLibray, onRemoveQuestion, onAddTplItemOk, onNewCategoryOk, onCommitQuestion, onCommitCategory } = props;
  // console.log(props);
  const onCategoryNameChange = event => {
    onChange({ newCategoryName: event.target.value });
  };
  const modalRender = () => {
    switch (type) {
      case 'changeQuestion': {
        return (
          <TplEditModal
            intl={intl}
            name={name}
            item={activeQuestion}
            onCancel={onCancel}
            onNoticeOk={onAddTplItemOk}
          />
        );
      }
      case 'editQuestion': {
        return (
          <div className={styles.newContent}>
            <div className={styles.item}>
              <TplQuestionForm
                intl={intl}
                id={id}
                dataScource={libraries}
                onCancel={onCancel}
                onSave={onCommitQuestion}
                name={name}
                data={activeQuestion}
              />
            </div>
          </div>
        );
      }
      case 'newCategory': {
        return (
          <div className={styles.newContent}>
            <div className={styles.item}>
              <div className={styles.inputName}>
                {intl.formatMessage({ id: 'common.text.name' })}
              </div>
              <Input onChange={onCategoryNameChange} />
            </div>
            <div className={styles.footer}>
              <Button onClick={onCancel} type="ghost" className={styles.cancel}>
                {intl.formatMessage({ id: 'common.text.cancel' })}{' '}
              </Button>
              <Button onClick={onCommitCategory}>
                {intl.formatMessage({ id: 'common.text.ok' })}
              </Button>
            </div>
          </div>
        );
      }
      case 'newQuestion': {
        return (
          <div className={styles.newContent}>
            <div className={styles.item}>
              <TplQuestionForm
                intl={intl}
                dataScource={libraries}
                onCancel={onCancel}
                onSave={onCommitQuestion}
              />
            </div>
          </div>
        );
      }
      default:
        return <div />;
    }
  };

  const onEditQuestion = (key, label, item) => {
    onChange({
      visible: true,
      id: key,
      name: label,
      activeQuestion: item,
      type: 'editQuestion',
      title: intl.formatMessage({ id: 'editQuestion' }),
    });
  };
  
  const onAddTpl = (key, label, item) => {
    onChange({
      visible: true,
      id: key,
      name: label,
      type: 'changeQuestion',
      activeQuestion: item,
      title: intl.formatMessage({ id: 'applyQuestion' }),
    });
  };

  const DropDownMenu = () => {
    const onMenuClick = ({ key }) => onChange({
      type: key === 1 ? 'newCategory' : 'newQuestion',
      visible: true,
      title: intl.formatMessage({ id: key === 1 ? 'newCategory': 'newQuestion' }),
    });

    return (
      <Menu onClick={onMenuClick}>
        <Menu.Item key="1" style={{ textAligin: 'center' }}>{intl.formatMessage({ id: 'common.text.category' })}</Menu.Item>
        <Menu.Item key="2" style={{ textAligin: 'center' }}>{intl.formatMessage({ id: 'common.text.question' })}</Menu.Item>
      </Menu>
    );
  };
  
  return (
    [
      <div className={`${styles.evaLib} ${className}`} key='content'>
        <div className={styles.libTitle}>
          <h3>{intl.formatMessage({ id: 'common.text.library' })}</h3>
        </div>
        <Collapse
          onDelGroup={onDelLibray}
          dataSource={libraries}
          onAddTpl={onAddTpl}
          onEdit={onEditQuestion}
          onRemove={onRemoveQuestion}
          evalTpl={props.evalTpl}
        />
        <Dropdown overlay={DropDownMenu()} placement="bottomCenter" trigger={['click']}>
          <Button className={styles.button}>
            {intl.formatMessage({ id: 'common.text.new' })}
            <Icon type="down" className={styles.newQuesIcon} />
          </Button>
        </Dropdown>
      </div>,
      <Modal footer={false} visible={visible} onCancel={onCancel} title={title} key='modal'>
        {modalRender()}
      </Modal>
    ]      
  );
});

export default enhance(EvalLibrary);
