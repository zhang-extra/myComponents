import React from 'react';
import ReactDOM from 'react-dom';
import { Modal, Button, Input, Checkbox, Radio} from 'antd';
import styles from './index.less';

const RadioGroup = Radio.Group;
//  function columns(){
//     console.log('columns');
//   };

class attribute extends React.Component {
  state = {
    modal1Visible: false,
    value: 1,
  }

  setModal1Visible(modal1Visible) {
    this.setState({ modal1Visible });
  }

  onChange = (e) => {
    console.log('radio checked', e.target.value);
    this.setState({
      value: e.target.value,
    });
  }

  aBar = () => {
    console.log('aBar');
    const aBar = document.getElementById('aBar');
    const secondColumn = document.getElementById('secondColumn');
    if (secondColumn.style.color === 'white'){
       aBar.style.backgroundColor='#fac53d';
       aBar.style.color='white';
       secondColumn.style.backgroundColor='white';
       secondColumn.style.color='black';
    }else{
       secondColumn.style.backgroundColor='#fac53d';
       secondColumn.style.color='white';
       aBar.style.backgroundColor='white';
       aBar.style.color='black';
    }

  }
  secondColumn = () => {
    console.log('secondColumn');
    const aBar = document.getElementById('aBar');
    const secondColumn = document.getElementById('secondColumn');
    secondColumn.style.backgroundColor='#fac53d';
    secondColumn.style.color='white';
    aBar.style.backgroundColor='white';
    aBar.style.color='black';
  }

  render() {
    return (
      <div>
        {/* <Button type="primary" onClick={() => this.setModal1Visible(true)}>编辑</Button> */}
        <Modal 
          title="单行文本框"
          style={{ top: 20 }}
          visible={this.state.modal1Visible}
          onOk={() => this.setModal1Visible(false)}
          onCancel={() => this.setModal1Visible(false)}
        >
          <label>标题： </label>
          <Input type="text" /><br />
          <label>字段名： </label>
          <Input type="text" /><br />
          <label>提示： </label>
          <Input type="text" /><br />          
          <label>默认值： </label>
          <Input type="text" /><br /> 
          <Checkbox >多选</Checkbox>
          <Checkbox >可搜索</Checkbox>
          <Checkbox >必填项</Checkbox><br />
          <hr style={{width:'100%',border:'0',backgroundColor:'#bfbfbf',height:'1px'}} />
          <span>字段占宽</span><br />
          <div id="aBar" style={{border:"1px solid #cacad3",textAlign:"center",width:"50%",float:"left",borderRight:"none",cursor:"pointer",}} onClick={this.aBar}>一栏</div>
          <div id="secondColumn" style={{border:"1px solid #cacad3",textAlign:"center",width:"50%",float:"left",cursor:"pointer",color:'white',backgroundColor:"#fac53d"}} onClick={this.aBar}>二栏</div><br />
          <hr style={{width:'100%',border:'0',backgroundColor:'#bfbfbf',height:'1px',marginTop:'10px'}} />          
          <RadioGroup onChange={this.onChange} value={this.state.value}>
            <Radio value={1}>关联表字段数据</Radio>
            <Radio value={2}>关联值集数据</Radio>
            <Radio value={3}>自定义数据</Radio>
          </RadioGroup>  
          <p style={{"color":"#1890ff","cursor":"pointer"}}>新增选项</p>       
        </Modal>
      </div>
    );
  }
}

export default attribute;
