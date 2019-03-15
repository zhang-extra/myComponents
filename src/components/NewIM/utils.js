import dayjs from 'dayjs';

const getTime = (date, time) => {
  let diffTime;
  if (dayjs(time).diff(date, 'second') < 60) diffTime = '几秒前';
  else if (dayjs(time).diff(date, 'minute') < 60) diffTime = `${dayjs(time).diff(date, 'minute')}分钟前`;
  else if (dayjs(time).diff(date, 'hour') < 24) diffTime = `${dayjs(time).diff(date, 'hour')}小时前`;
  else diffTime = dayjs(date).format('YYYY年M月D日H:m');
  return diffTime;
};

export default { getTime };