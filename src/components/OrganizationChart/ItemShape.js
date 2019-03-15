import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { Icon, Menu, Dropdown, } from 'antd';
import styles from './ItemShape.less';

class ItemShape extends Component {

  componentDidMount() {
    const info = this.info;
    const popup = this.popup;
    this.info.addEventListener('mouseover',function(){
      popup.style.backgroundColor='#8c8c8c';
    })
    this.popup.addEventListener('mouseover',function(){
      popup.style.backgroundColor='#8c8c8c';
    })
    this.info.addEventListener('mouseout',function(){
      popup.style.backgroundColor='transparent';
    })
    this.popup.addEventListener('mouseout',function(){
      popup.style.backgroundColor='transparent';
    })

    const added = this.added;
    const popupAdd = this.popupAdd;
    var x = 0;
    this.added.addEventListener('click',function(event){
      if(x == 0){
        popupAdd.style.visibility='visible';
        x=1;
      } else{
        popupAdd.style.visibility='hidden';
        x=0;
      }        
    });
    this.added.addEventListener('mouseout',function(event){
      // console.log(event);
      if (event.toElement.localName === 'svg' || event.toElement.localName === 'i' || event.toElement.localName === 'path' || event.toElement.className.indexOf('plus') !== -1 || event.toElement.className.indexOf('popupAttr') !== -1) return;  
        popupAdd.style.visibility='hidden'; 
    });
    this.popupAdd.addEventListener('click',function (event){     
      popupAdd.style.visibility='hidden';
    });
    this.popupAdd.addEventListener('mouseout',function (event){     
      if (event.toElement.className.indexOf('popupAttrMenu') === -1 && event.toElement.className.indexOf('popupAttr') === -1)
        popupAdd.style.visibility='hidden';
    });
    
    const modifyed = this.modifyed;
    const popupModify = this.popupModify;
    var y = 0;
    this.modifyed.addEventListener('click',function(event){   
      if(y === 0){  
        popupModify.style.visibility='visible';
        y = 1;
      }else {
        popupModify.style.visibility='hidden';
        y = 0;
      }
    });
    this.modifyed.addEventListener('mouseout',function(event){
      if (event.toElement.localName === 'svg' || event.toElement.localName === 'i' || event.toElement.localName === 'path' || event.toElement.className.indexOf('plus') !== -1 || event.toElement.className.indexOf('popupAttr') !== -1) return;  
        popupModify.style.visibility='hidden'; 
    });

    this.popupModify.addEventListener('click',function(event){
          popupModify.style.visibility='hidden';       
    });
    this.popupModify.addEventListener('mouseout',function(event){
     if (event.toElement.className.indexOf('popupAttrMenu') === -1 && event.toElement.className.indexOf('popupAttr') === -1)
       popupModify.style.visibility='hidden';       
    });

  }

    
  render() {
    const { data, show, showChildren, expendChildren, direction, onSetItemLabel, mode, ...otherProps } = this.props;
    return (
      <div className={`${styles.item} ${show ? styles.show : ''}`} >
        {show && <p className={`${styles.department} `}>{data.label}</p>}
        <div className={`${styles.info} `} ref={ref => this.info = ref} >
          {data.children && show &&  
            <Icon className={`${direction === 'row' ? styles.iconRow : styles.iconColumn}`} type={direction === 'row' ? !showChildren ? "down-circle" : "up-circle" : !showChildren ? "right-circle" : "left-circle"} theme="outlined" onClick={expendChildren} />
          }
        </div>      
        <div className={` ${styles.popupRow}`} ref={ref => this.popup = ref}>
          <p className={`${styles.plus}`} ref={ref => this.added = ref }><Icon  type="plus" /></p>
          <p className={`${styles.plus} `} ref={ref => this.modifyed = ref}><Icon  type="bars" /></p>
          <div className={`${styles.popupAttr} ${direction === 'row' ? '' : styles.add}`} ref={ref => this.popupAdd = ref}>
              <div className={`${styles.popupAttrMenu}`}>新增同级部门</div>
              <div className={`${styles.popupAttrMenu}`}>新增子部门</div>
          </div>
          <div className={`${styles.popupAttr} ${direction === 'row' ? '' : styles.modify}`}  ref={ref => this.popupModify = ref}>
              <div className={`${styles.popupAttrMenu}`} onClick={() => { data.label = 'nsml'; this.setState({})}}>更名</div>
              <div className={`${styles.popupAttrMenu}`}>划转</div>
              <div className={`${styles.popupAttrMenu}`}>合并</div>
          </div>
          {/* <div style={{position:"absolute", top:"28px", width:"164px", height:"132px", background:"gray", zIndex:"1000000"}}>sadasd</div> */}
        </div>        
    </div>
  );
  }
}

export default ItemShape;