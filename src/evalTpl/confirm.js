import { Modal } from 'antd';

export default function confirm({ title, content, okText, cancelText, confirmLoading }, onOk) {
  Modal.confirm({
    title,
    okText,
    cancelText,
    content,
    confirmLoading,
    onOk
  });
}
