import React, { memo } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
// import TouchBackend from 'react-dnd-touch-backend';

const DragDropWrapper = ({ style, className, children }) => {
  return (
    <div
      className={className}
      style={{ ...style }}
    >
      {children}
    </div>
  );
}

// let Backend = HTML5Backend;
// if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) Backend = TouchBackend;

export default DragDropContext(HTML5Backend)(memo(DragDropWrapper));
