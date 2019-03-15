import { injectIntl } from 'react-intl';
import { notification } from 'antd';
import { compose, withHandlers } from 'recompose';


// 提示信息
const noticeHoc = compose(
  injectIntl,
  withHandlers(() => {
    return {
      onError: () => (error) => {
        notification.error({message:error});
      },
      onSuccess: ({ intl }) => (message) => {
        notification.success({ message: intl.formatMessage({ id: 'successTips'}), description: message });
      }
    };
  })
);

export { noticeHoc };
