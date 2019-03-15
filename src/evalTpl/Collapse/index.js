import React, { memo, useState } from 'react';
import { Icon, Collapse } from 'antd';
import CollapseHeader from './CollapseHeader';
import CollapseItem from './CollapseItem';
import isEqual from 'lodash/isEqual';
import indexOf from 'lodash/indexOf';

const Panel = Collapse.Panel;

const isInTplDetial = (evalTpl, itemName, optionName) => {
  const item = evalTpl && evalTpl.categories && evalTpl.categories.filter(item => item.name === itemName);
  if (item && item.length > 0 && item[0] && item[0].items.filter(option => option.name === optionName).length > 0) return true;
  return false;
}

const MyCollapse =  memo(props => {
  const { dataSource, edit = true, add = true, onDelGroup, onAddTpl, onEdit, onRemove, evalTpl } = props;
  const [openedPanel, setOpenedPanel] = useState(props.openedPanel || []);
  return (
    <Collapse bordered={false} onChange={openedPanelKey => setOpenedPanel(openedPanelKey)}>
      {dataSource && dataSource.map(item => 
        <Panel
          key={item.id}
          showArrow={false}
          header={
            <CollapseHeader 
              text={item.name} 
              onDelGroup={() => onDelGroup(item)} 
              opened={indexOf(openedPanel, item.id.toString()) !== -1} />
          }
        >
          {item.items.length > 0 && item.items.map((option, index) => 
            <CollapseItem
              key={index}
              text={option.name}
              onAddTpl={() => onAddTpl(item.id, item.name, option)}
              edit={edit}
              add={add}
              onEdit={() => onEdit(item.id, item.name, option)}
              onRemove={() => onRemove(item.id, option.name, option)}
              inTplDetial={isInTplDetial(evalTpl, item.name, option.name)}
            />)
          }
          {item.items.length === 0 && <span style={{ marginLeft: 14 }}>None Questions!</span>}
        </Panel>)
      }
    </Collapse>
  );
}); 

export default MyCollapse;
