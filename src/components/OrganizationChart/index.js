import React, { Component } from 'react';
import Item from './item';
import styles from './index.less';

class OrganizaitonChart extends Component {
  constructor(props) {
    super(props);
    this.state = { showChildren: false };
  }

  _handleMouseDown = (event) => {
    document.addEventListener('mouseup', this._handleMouseUp);
    document.addEventListener('mousemove', this._handleMouseMove);
  } 

  _handleMouseUp = (event) => {
    document.removeEventListener('mousemove', this._handleMouseMove);
    document.removeEventListener('mouseup', this._handleMouseUp);
  }

  _handleMouseMove = (event) => {
    this.wrapper.scrollLeft -= event.movementX;
    this.wrapper.scrollTop -= event.movementY;
  }

  render() {
    const { items, ItemNode, itemMarginBrother, itemMarginParent, scale, direction, ...otherProps } = this.props;
    return (
      <div ref={ref => this.wrapper = ref} className={styles.wrapper} onMouseDown={this._handleMouseDown}>
        <Item key={items.key} data={items} show head scale={scale} otherProps={otherProps} ItemNode={ItemNode}
         direction={direction} itemMarginBrother={itemMarginBrother} itemMarginParent={itemMarginParent}
         style={{ zoom: scale }}
        />
      </div>
    );
  }
}

export default OrganizaitonChart;
