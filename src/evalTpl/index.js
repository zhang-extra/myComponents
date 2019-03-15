import React from 'react';
import { compose, withState, withHandlers, mapProps, withPropsOnChange, flattenProp } from 'recompose';
import { withRouter } from 'react-router-dom';
import { parseMatchParamValue, parseLocationSearchValue } from '../lib/withRouterParsers';
import findIndex from 'lodash/findIndex';
import remove from 'lodash/remove';
import { noticeHoc } from './hoc';
import { getData, postData } from '../lib/utils';
import EvalLibrary from './EvalLibrary';
import EvalTplDetail from './EvalTplDetail';
import styles from './index.less';

const url = '/api/biz/common/eval/tpl';

// 连接 tpldetail 和libary 方法
const pageHoc = compose(
  withRouter,
  withState('changeQuestion', 'setChangeQuestion'),
  mapProps(({ location, ...rest }) => {
    return {
      location,
      mode: parseLocationSearchValue(location, 'mode') || 'edit',
      ...rest
    };
  })
);

// 评价模板
const enhance = compose(
  withRouter,
  withState('tplState', 'setTplState', ({ mode }) => {
    return {
      visible: false,
      mode: mode || 'edit'
    };
  }),
  withState('evalTpl', 'setEvalTpl'),
  mapProps(({ match, location, tplId, modul, ...rest }) => {
    const id = tplId || parseMatchParamValue(match, 'id');
    const bizId = bizId || parseLocationSearchValue(location, 'bizId');
    const bizName = bizId || parseLocationSearchValue(location, 'bizName');
    return {
      id,
      modul,
      bizId,
      bizName,
      ...rest
    };
  }),
  flattenProp('tplState'),
  withPropsOnChange(['changeQuestion'], ({ setEvalTpl, evalTpl, changeQuestion }) => {
    if (evalTpl) {
      const index = findIndex(evalTpl.categories, { name: changeQuestion.name });
      if (index !== -1) {
        evalTpl.categories[index].items.push(changeQuestion.data);
      } else {
        evalTpl.categories.push({ name: changeQuestion.name, items: [changeQuestion.data], tplId: evalTpl.id });
      }
      setEvalTpl(evalTpl);
    }
  }),
  noticeHoc,
  withPropsOnChange(['id'], ({ id, setEvalTpl, onError }) => {
    if (id) {
      getData(`${url}/${id}`).then(({ data, error }) => {
        if (error) {
          onError(error);
        } else {
          setEvalTpl(data);
        }
      });
    }
  }),
  withHandlers(() => {
    return {
      onChange: ({ setTplState, tplState }) => (change) => {
        setTplState({ ...tplState, ...change });
      },
      onRemove: ({ evalTpl, setEvalTpl }) => (title, name) => {
        const index = findIndex(evalTpl.categories, { name: title });
        if (index !== -1) {
          remove(evalTpl.categories[index].items, (o) => {
            return o.name === name;
          });
        }
        setEvalTpl(evalTpl);
      },
      onTplChange: ({ setEvalTpl }) => (evalTpl) => {
        setEvalTpl(evalTpl);
      },
      onTplCategoriesChange: ({ evalTpl, setEvalTpl }) => (name, data) => {
        const index = findIndex(evalTpl.categories, { name });
        if (index !== -1) {
          const index2 = findIndex(evalTpl.categories[index].items, { name: data.name });
          if (index2 !== -1) {
            evalTpl.categories[index].items[index2] = data;
          }
        }
        setEvalTpl(evalTpl);
      },

      onSave: ({ evalTpl, onError, onSuccess, intl, mode, onCommit, result, summary, bizName, bizId, goBack }) => () => {
        if (mode === 'edit') {
          postData(`${url}/${evalTpl.id}`, evalTpl.categories).then(({ error }) => {
            if (error) {
              onError(error);
            } else {
              onSuccess(intl.formatMessage({ id: 'common.success' }));
            }
          });
        } else if (mode === 'write') {
          let score = 0;
          evalTpl.categories.forEach((category) => {
            category.items.forEach((item) => {
              if (item.score) {
                score += item.score;
              }
            });
          });
          if (onCommit) {
            onCommit(evalTpl, { result, summary, score });
          } else {
            postData('/api/class/comm_eval', { result, summary, score, content: evalTpl, bizName, bizId }).then(({ error, data }) => {
              if (error) {
                onError(error);
              } else {
                onSuccess(intl.formatMessage({ id: 'common.success' }));               
              }
            });
          }
        }
      }
    };
  })
);

const EvalPage = (props) => {
  const { location, setChangeQuestion, changeQuestion, mode,  ...rest } = props;
  return (
    <div className={styles.wrapper}>
      <EvalTplDetail className={styles.evalTplDetail} changeQuestion={changeQuestion} mode={mode} {...rest} />
      {mode !== 'write' && <EvalLibrary className={styles.evalLibrary} setChangeQuestion={setChangeQuestion} modul={parseLocationSearchValue(location, 'modul')} evalTpl={props.evalTpl} />}
    </div>
  );
};

export default compose(pageHoc, enhance)(EvalPage);
