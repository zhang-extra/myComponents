import React, { memo, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import styles from './Input.less';

/**
 * @description A beautiful Input modify Antd's Input border-style and focus animation, and it's width will fit inputValue va autoSize prop. 
 * 更改了Antd Input样式和Focus效果，可以根据输入内容自适应宽度的BeautifulInput，其他效果与同Antd Input。
 * @param {string} inputWrapperClassName - customInputWrapper-Style va(margin, width). 自定义包裹容器样式。
 * @param {string} inputClassName - customInput-Style va(top, border-top). 自定义输入框样式。
 * @param {string} underlineClassName - customUnderline-Style va(top, height, background). 通过top, border-top属性自定义下划线样式。
 * @param {string} focusUnderlineClassName - customFocusUnderline-Style. 通过top, height, background属性自定义动效下划线样式。
 * @param {bool} autoSize - if true, input's width will fit the value in it, and if false, you are supposed to add detail width styles in inputClassName. 
 * 是否开启高度自适应，如果为否，建议在inputClassName中定义具体width。
 * @param {bool} showUnderline - if show underLine in bottom. 是否在文字下面显示恒定下划线
 * @param {object} props - all other props you wanna pass to Antd Input.其他所有传递给Antd Input组件的属性。
 * @version 0.0.1 2018-11-22
 * @author SSSensational <sss18201672034@163.com>
 * @example <BeautifulInput inputClassName={...} underlineClassName={...} autoSize value={...} onChange={...} placeholder="xxx" />
 */
const BeautifulInput = memo(({ inputWrapperStyle, inputWrapperClassName, inputClassName, focusUnderlineClassName, underlineClassName, autoSize, showUnderline, className, ...props }) => {
  const underline = useRef(null);
  const wrapper = useRef(null);
  const widthCal = useRef(null);
  const onFcus = () => underline.current.classList.add(styles.focus);
  const onBlur = () => underline.current.classList.remove(styles.focus);
  useEffect(() => { 
    if (autoSize) { // 根据传进来的value动态设置input宽度，最小宽度为placeholder之宽，如果placeholder之宽小于88，那就88.
      let width;
      widthCal.current.innerHTML = props.value;
      width =  widthCal.current.clientWidth;
      widthCal.current.innerHTML = props.placeholder;
      if (width < widthCal.current.clientWidth) width = widthCal.current.clientWidth;
      if (width < 88) width = 88;
      wrapper.current.style['width'] = `${width * 1.125}px`; // width*1.125 not width*1 to avoid input's tremble
    }
  });
  return (
    <div ref={wrapper} className={`${inputWrapperClassName} ${styles.wrapper}`} style={{...inputWrapperStyle}}>
      <Input className={`${inputClassName} ${styles.input}`} {...props} onFocus={onFcus} onBlur={onBlur} spellCheck={false} />
      {showUnderline && <div className={`${styles.underline} ${underlineClassName}`} />}
      <div ref={underline} className={`${styles.underline} ${styles.focusUnderLine} ${focusUnderlineClassName}`} />
      {autoSize && <span ref={widthCal} className={styles.widthCal} />}
    </div>
  );
});

BeautifulInput.PropTypes = {
  inputWrapperClassName: PropTypes.string,
  focusUnderlineClassName: PropTypes.string,
  inputClassName: PropTypes.string,
  underlineClassName: PropTypes.string,
  autoSize: PropTypes.bool,
  showUnderLine: PropTypes.bool,
};

BeautifulInput.defaultProps = {
  autoSize: true,
  showUnderline: true,
  placeholder: 'Please input value here...',
};

export default BeautifulInput;