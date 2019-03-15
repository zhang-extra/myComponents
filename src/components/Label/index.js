import React, { useState, useRef } from 'react';
import { Popover, Input, Button, Icon, message } from 'antd';
import data from './data.js';
import styles from './index.less';




const Label = props =>{
  const [addLabels, setAddLabels] = useState(true);
  const [visible, setVisible] = useState(true);
  const [labelItems, setLabelItems] = useState(data);
  const [colors, setColors] = useState(['red', 'blue', 'black']);
  const [showLabelItems, setShowLabelItems] = useState([]);
  const [newLabelName, setNewLabelName] = useState('');
  const [newLabelColor, setNewLabelColor] = useState('');
  const icon = useRef(null)

  const info = () => {
    message.info('操作成功');
  };

  const addItem = () => {
    setAddLabels(false);
  };
  const selectItem = () => {
    setAddLabels(true);
  };

  const addShowLabelItems = (text) => {
    showLabelItems.push(text);
    // for( let i = 0;i < showLabelItems.length;i++){
    //   console.log(showLabelItems[i].name);
    //   if(showLabelItems[i].name !== text.name){
    //     showLabelItems.push(text);
    //   }else{
    //     showLabelItems.splice(i, 1);
    //   }
    // }
    setShowLabelItems(showLabelItems);
  };
  const deleteShowLabelItems = (index) => {
    showLabelItems.splice(index,1);
    setShowLabelItems(showLabelItems);
  };

  const addLabelItems = (index) => {
    const newLabel={name:`${newLabelName}`, color:`${newLabelColor}`};
    labelItems.push(newLabel);
    setLabelItems(labelItems);
  };
  const deleteLabelItems = (index) => {
    labelItems.splice(index, 1);
    setLabelItems(labelItems);
  };

  const modifyLabelItem = (key) => {
    setNewLabelName(labelItems[key].name);
    setNewLabelColor(labelItems[key].color)
    setAddLabels(false);
    // labelItems.splice(key, 1);
    labelItems[key].name = newLabelName;
    labelItems[key].color = newLabelColor;
    // const newLabel={name:`${newLabelName}`, color:`${newLabelColor}`};
    // labelItems.push(newLabel);
    setLabelItems(labelItems);
    // setLabelItems(labelItems);
  }




  const Search = () => {
    return(
      <div className={styles.searchWrapper}>
        <Input placeholder="搜索标签" style={{border:'none', width:'calc(100% - 15px)', boxShadow:'none', padding:'4px 0'}}/>
        <Icon onClick={addItem} className={styles.addIcon} type="plus-circle" />
      </div>
    );
  }

  const LabelItem = () => {
    return(
      labelItems.map((labelItem,index2) => 
        <div key={index2} className={styles.labelItemWrapper}>
          <Icon className={styles.labelItemIcon} style={{color:`${labelItem.color}`}} type="smile" />{/*type="eye"*/}
          <span onClick={event => addShowLabelItems(labelItem)} className={styles.labelItemInfo} >{labelItem.name}</span>
          <Icon onClick={event => modifyLabelItem(index2)} className={`${styles.labelItemIcon} ${styles.action}`} type="edit" />
          <Icon onClick={event => deleteLabelItems(index2)} className={`${styles.labelItemIcon} ${styles.action}`} type="delete" />
        </div>
      )  
    );
  }

  const AddLabelItem = () =>{
    return(
      <div className={styles.addLabelItemWrapper}>
        <div className={styles.title}>
          <Icon onClick={selectItem} className={styles.addLabelItemIcon} type="left" />
          <span>编辑标签</span>
          <Icon onClick={selectItem} className={styles.addLabelItemIcon} type="right" />
        </div>
        <div className={styles.input}>
          <Input value={newLabelName} onChange={event => setNewLabelName(event.target.value)} placeholder="名称" />
        </div>
        <div className={styles.colors}>
          { colors.map((color,colorIndex) => 
            <div key={colorIndex} onClick={event => setNewLabelColor(color)} className={styles.color} style={{background:`${color}`}}>
              <Icon className={styles.colorIcon} type="check" style={{visibility:`${newLabelColor}` === `${color}` ? 'visible' : 'hidden'}}/>
            </div>
            )}
        </div>
        <div className={styles.button}>
          <Button onClick={event => {addLabelItems(event.target.value), info()}} className={styles.button} type="primary">完成</Button>
        </div>
      </div>
    );
  }

  return(
    <div className={styles.wrapper}>
      {showLabelItems.map((showLabelItem, index1) =>
        // <Item key={index1} text={showLabelItem}/>
        <div key={index1} className={styles.itemWrapper} style={{background:`${showLabelItem.color}`}}>
          {showLabelItem.name}
          <Icon onClick={event => deleteShowLabelItems(index1)} className={styles.itemIcon} type="close" />
        </div>
      )}
      
      {addLabels ? 
        <Popover
          placement="bottom"
          title={<Search />}
          content={<LabelItem />}
          trigger="click"
          >
          <span className={styles.addLabel}>添加标签</span>
        </Popover> :
        <Popover
          placement="bottom"
          content={<AddLabelItem />}
          trigger="click"
          >
          <span className={styles.addLabel}>添加标签</span>
        </Popover>
      }

      {/* <Input value={newLabelName} onChange={event => setNewLabelName(event.target.value)} placeholder="ceshiashd" /> */}
      
    </div>
  );
}
export default Label;