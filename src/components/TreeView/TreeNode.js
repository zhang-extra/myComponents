/** @format */

import React, { memo, useRef, useContext, useState } from 'react';
import { ReactUtil } from '../../utils/';
import { RenderInfoContext } from './handle.js';
import styles from './TreeNode.less';

const initTreeNode = (node, setExpandRecently, setExpand, expandNotice, isShow) => {
  if (isShow) {
    node.scrollIntoView({ behavior: 'smooth' });
    if (expandNotice) {
      setExpandRecently(true);
      setTimeout(() => setExpandRecently(false), expandNotice);
    }
  }
  const expendButton = node.querySelector('.treeView-expand');
  const clickExpandButton = () => {
    setExpand(preState => !preState);
    node.scrollIntoView({ behavior: 'smooth' });
    if (expandNotice) {
      setExpandRecently(true);
      setTimeout(() => setExpandRecently(false), expandNotice);
    }
  }
  expendButton.addEventListener('click', clickExpandButton);
};

const TreeNode = ({ data, parentData, head, childrenHead, childrenTail, isShow, ...props }) => {
  const node = useRef(null);
  const [isExpand, setExpand] = useState(false);
  const [isExpandRecently, setExpandRecently] = useState(false);

  const { treeNodeSize, distance, direction, renderNode, background, expandNotice, lineOption } = useContext(RenderInfoContext);
  const Node = renderNode;
  const { children } = data;

  ReactUtil.init(() => initTreeNode(node.current, setExpandRecently, setExpand, expandNotice, isShow));

  return (
    <div
      ref={node}
      className={`${styles.treeNodeWrapper} ${isExpand ? styles.isExpand : ''}`}
      style={{
        flexDirection: direction === 'vertical' ? 'column' : 'row',
        margin:
          direction === 'vertical'
            ? `${head ? distance[2] : 0}px ${!head ? distance[1] / 2 + 'px' : 'auto'}`
            : `${!head ? distance[1] / 2 + 'px' : 'auto'} ${head ? distance[2] : 0}px`,
      }}
    >
      <Node data={data} parentData={parentData} {...props} direction={direction} treeNodeSize={treeNodeSize} isExpand={isExpand} isExpandRecently={isExpandRecently}/>
      {lineOption && isExpand && children && children.length > 0 && // 父节点朝子节点的半条线 
        <div
          className={styles.line}
          style={{
            left: direction === 'horizontal' ? treeNodeSize[0] : '',
            top: direction === 'vertical' ? treeNodeSize[1] : '',
            width: direction === 'vertical' ? (lineOption.width || '2px') : distance[0] / 2,
            height: direction === 'vertical' ? distance[0] / 2 : (lineOption.width || '2px'),
            background: lineOption.color || 'black',
          }}
        /> 
      }
      {lineOption && isExpand && children && children.length > 1 && // 所有子节点之间的长线
        <div
          className={styles.line}
          style={{
            left: direction === 'horizontal' ? treeNodeSize[0] + distance[0] / 2 : '',
            top: direction === 'vertical' ? treeNodeSize[1] + distance[0] / 2 : '', 
            width: direction === 'vertical' ? `calc(100% - ${treeNodeSize[0] + distance[1]}px)` : (lineOption.width || '2px'),
            height: direction === 'vertical' ? (lineOption.width || '2px') : `calc(100% - ${treeNodeSize[1] + distance[1]}px)`,
            background: lineOption.color || 'black',
          }} 
        />
      }
      {lineOption && !head && // 子节点朝父节点的半条线
        <div
          className={styles.line}
          style={{
            width: direction === 'vertical' ? (lineOption.width || '2px') : distance[0] / 2,
            height: direction === 'vertical' ? distance[0] / 2 : (lineOption.width || '2px'),
            transform: direction === 'vertical' ? 'translateY(-100%)' : 'translateX(-100%)',
            background: lineOption.color || 'black',
          }}
        /> 
      }
      {lineOption && (childrenHead || childrenTail) &&  // 首尾子节点用来掩盖过长的横线的线
        <div
          className={styles.line}
          style={{
            width: direction === 'vertical' ? '50%' : (lineOption.width || '2px'),
            height: direction === 'vertical' ? (lineOption.width || '2px') : '50%',
            top: direction === 'vertical' ? - distance[0] / 2 : `calc(${childrenHead ? '0% - 1px' : '50% + 1px'})`,
            right: childrenHead ? direction === 'vertical' ? 'calc(50% + 1px)' : distance[0] / 2 : '',
            left: direction === 'vertical' ? childrenHead ? '' : 'calc(50% + 1px)' :  - distance[0] / 2,
            background: lineOption.background || 'white',
          }}
        /> 
      }
      <div
        className={`${styles.childrenWrapper} ${isExpand ? styles.expand : ''}`}
        style={{
          flexDirection: direction === 'vertical' ? 'row' : 'column',
          marginTop: direction === 'vertical' ? `${distance[0]}px` : 0,
          marginLeft: direction === 'horizontal' ? `${distance[0]}px` : 0,
          display: isExpand ? '' : 'none',
        }}
      >
        {children && children.length > 0 && children.map((childNode, index) => 
          <TreeNode
            key={childNode.key}
            data={childNode}
            parentData={data}
            childrenHead={index === 0}
            childrenTail={index === children.length - 1}
            isShow={isExpand}
            {...props}
          />)
        }
      </div>
    </div>
  );
};

export default memo(TreeNode);
