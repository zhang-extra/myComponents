import React, { memo } from 'react';
import { Button, Upload, Tooltip, Icon, Input } from 'antd';
import styles from './Input.less';

const uploadProps = {

};

const handleSendInput = (messageInputRef, inputedValues, target, onChange) => {
  if (onChange) onChange('sendInput', target, messageInputRef.value);
  messageInputRef.value = '';
  messageInputRef.style.height = '31px';
  inputedValues.current[`${target.group}-${target.key}`] = '';
};

const MyInput = props => {
  const { messageInputRef, inputedValues, curChatData, onChange } = props;
  return (
    <div className={styles.inputArea}>
      <div className={styles.buttonArea}>
        <Upload {...uploadProps} showUploadList={false}>
          <Button size="small">
            <Icon type="upload" />附件
          </Button>
        </Upload>
        <Tooltip placement='bottom' title='Ctrl+Enter发送消息' >
          <Button
            type="primary"
            size="small"
            onClick={() => messageInputRef.current.textAreaRef.value && handleSendInput(messageInputRef.current.textAreaRef, inputedValues, { group:curChatData.group, key: curChatData.key }, onChange)}
          >
            发送
          </Button>
        </Tooltip>
      </div>
      <Input.TextArea
        ref={messageInputRef}
        defaultValue=""
        autosize={{ minRows: 1, maxRows: 12 }}
        onChange={e => inputedValues.current[`${curChatData.group}-${curChatData.key}`] = e.target.value}
        onKeyDown={e => e.ctrlKey && e.keyCode === 13 && messageInputRef.current.textAreaRef.value && handleSendInput(messageInputRef.current.textAreaRef, inputedValues, { group:curChatData.group, key: curChatData.key }, onChange)}
      />
    </div>
  );
}

export default memo(MyInput);