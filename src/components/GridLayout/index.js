import React, { memo, useState, useRef, useEffect } from 'react';
import GridLayout from 'react-grid-layout';
import { ReactUtil } from '../../utils';
import styles from './index.less';


const EasyGridLayout = props => {
  const wrapper = useRef(null)
  const [size, setSize] = useState([0, 0]);
  const preHeight = useRef(false);
  const { className, ItemRender, data, onLayoutChange, showGrid, gridClassName,
    autoSize, cols, draggableCancel, draggableHandle, verticalCompact, compactType, margin, containerPadding,
    rowHeight, isDraggable, isResizable, useCSSTransforms, preventCollision, onDragStart, onDrag, onDragStop,
    onResizeStart, onResize, onResizeStop,
  ...otherProps } = props;
  const handleSizeChange = () => {
    const newSize = [wrapper.current.clientWidth];
    if (showGrid) {
      const rowWidth = parseInt((newSize[0] - containerPadding[0] - (cols - 1) * margin[0]) / cols);
      const gridWidth = rowWidth + margin[0];
      const gridHeight = rowHeight + margin[1];
      const gridLayoutHeight = wrapper.current.clientHeight;
      for (let col = containerPadding[1]; col < gridLayoutHeight; col += gridHeight) {
        for (let row = containerPadding[0]; row < newSize[0]; row += gridWidth) {
          newSize.push(
            <div
              key={`${row}-${col}`}
              className={gridClassName}
              style={{
                width: rowWidth - 1, 
                height: rowHeight -1, 
                left: row,
                top: col,
                position: 'absolute',
              }} 
            />)

        }
      }
    }
    setSize(newSize);
  };

  useEffect(() => {
    if (wrapper.current.clientHeight !== preHeight.current) {
      preHeight.current = wrapper.current.clientHeight;
      handleSizeChange();
    }
    window.addEventListener('resize', handleSizeChange);
    return () => window.removeEventListener('resize', handleSizeChange);   
  })

  const handleLayoutChange = newLayout => {
    if (!onLayoutChange) return;
    data.forEach((item, index) => newLayout[index].value = item.value);
    onLayoutChange(newLayout);
  }

  return (
    <div ref={wrapper} className={`${className} ${styles.wrapper}`}>
      {showGrid && size.slice(1).map(item => item)}
      <GridLayout
        className='react-grid-layout'
        layout={data}
        width={size[0]}
        onLayoutChange={handleLayoutChange}
        autoSize={autoSize} cols={cols} draggableCancel={draggableCancel} draggableHandle={draggableHandle}
        verticalCompact={verticalCompact} compactType={compactType} margin={margin} containerPadding={containerPadding}
        rowHeight={rowHeight} isDraggable={isDraggable} isResizable={isResizable} useCSSTransforms={useCSSTransforms}
        preventCollision={preventCollision} onDragStart={onDragStart} onDrag={onDrag} onDragStop={onDragStop}
        onResizeStart={onResizeStart} onResize={onResize} onResizeStop={onResizeStop}
      >
        {
          data && data.map(item =>
            <div key={item.i}>
              <ItemRender value={item.value} i={item.i} {...otherProps} />
            </div>
          )
        }
      </GridLayout>
    </div>
  )
}

export default memo(EasyGridLayout);