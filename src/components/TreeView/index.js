import React, { memo, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import TreeNode from './TreeNode'
import styles from './index.less';
import { RenderInfoContext } from './handle.js';

const TreeView = props => {
  const wrapper = useRef(null);
  const handleMouseDown = (event) => {
    event.preventDefault();
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);
  } 

  const handleMouseUp = (event) => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }

  const handleMouseMove = (event) => {
    wrapper.current.scrollLeft -= event.movementX;
    wrapper.current.scrollTop -= event.movementY;
  }

  const { className, data, direction, treeNodeSize, distance, renderNode, background, zoom, expandNotice, lineOption, ...otherProps } = props;

  return (
    <RenderInfoContext.Provider value={{ treeNodeSize, distance, direction, renderNode, background, expandNotice, lineOption }} >
      <div
        ref={wrapper}
        className={`${styles.treeViewWrapper} ${className || ''}`}
        style={{ flexDirection: direction === 'vertical' ? 'column' : 'row', zoom: zoom / 100 }}
        onMouseDown={(event) => handleMouseDown(event, wrapper.current)} 
      >
        {data && data.map(node =>
          <TreeNode key={node.key} data={node} parentData={data} head {...otherProps}/>
        )}
      </div>
    </RenderInfoContext.Provider>
  );
}

TreeView.PropTypes = {
  data: PropTypes.array.isRequired,
  direction: PropTypes.string.isRequired,
  treeNodeSize: PropTypes.array.isRequired,
  distance: PropTypes.array.isRequired,
  zoom: PropTypes.number.isRequired,
  expandNotice: PropTypes.number,
  lineOption: PropTypes.object,
}

TreeView.defaultProps = {
  direction: "vertical",
  treeNodeSize: [200, 100],
  distance: [40, 30, 15],
  zoom: 1,
  expandNotice: false,
}

export default memo(TreeView);