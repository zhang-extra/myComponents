import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import styles from './item.less';

class Item extends Component {
  constructor(props) {
    super(props);
    this.state = { showChildren: false };
  }

  componentDidMount() {
    if (this.props.head) {
      this.ItemWidth = this.item.offsetWidth;
      this.ItemHeight = this.item.offsetHeight;
    }
  }
  componentDidUpdate(nextProps) {
    if (this.props.head) {
      this.ItemWidth = this.item.offsetWidth;
      this.ItemHeight = this.item.offsetHeight;
    }
    if (nextProps.direction !== this.props.direction && this.childrenItem.length !== 0 && this.state.showChildren) {
      this.item.addEventListener('transitionend', this.handleTransitionend);
    }
  }

  getItemBound = () => {
    return this.item.getBoundingClientRect();
  }

  handleTransitionend = (event) => {
    this.childrenItem[0].item.removeEventListener('transitionend', this.handleTransitionend);
    this.item.scrollIntoView({ behavior: 'smooth' });
    this.renderLines();
  }

  expendChildren = () => {
    this.clearCanvas();
    this.setState(preState => ({ showChildren: !preState.showChildren }));
    this.childrenItem[0].item.addEventListener('transitionend', this.handleTransitionend);
  }

  clearCanvas = () => {
    this.canvas.setAttribute('width', 0);
    this.props.parentItem && this.props.parentItem.clearCanvas();
  }

  renderLines = () => {
    if (this.wrapper === null || this.itemBound) return;
    const { direction , itemMarginParent} = this.props;
    const itemBound = this.getItemBound();
    const wrapperBound = this.wrapper.getBoundingClientRect();
    this.canvas.setAttribute("width", wrapperBound.width);
    this.canvas.setAttribute("height", wrapperBound.height);
    const ctx = this.canvas.getContext("2d");
    ctx.beginPath(); 
    ctx.lineWidth = 1; 
    ctx.strokeStyle='#000000';
    const firstChildBound = this.childrenItem[0].getItemBound();
    const lastChildBound = this.childrenItem[this.childrenItem.length - 1].getItemBound();
    const parentItemX = direction === 'row' ? 
      itemBound.left - wrapperBound.left + itemBound.width / 2 : itemBound.width;
    const parentItemY = direction === 'row' ? itemBound.height : itemBound.top - wrapperBound.top + itemBound.height / 2;
    const middlePosX = direction === 'row' ? parentItemX : parentItemX + (firstChildBound.left - itemBound.right) / 2;
    const middlePosY = direction === 'row' ?
      (itemBound.bottom + firstChildBound.top - wrapperBound.top - itemBound.top) / 2
        : parentItemY;
    const middleLineStart = direction === 'row' ? 
      firstChildBound.left - wrapperBound.left + firstChildBound.width / 2
        : firstChildBound.top - wrapperBound.top + firstChildBound.height / 2;
    const middleLineEnd = direction === 'row' ? 
      lastChildBound.left - wrapperBound.left + lastChildBound.width / 2
        : lastChildBound.top - wrapperBound.top + firstChildBound.height / 2;
    ctx.moveTo(parentItemX, parentItemY);
    ctx.lineTo(middlePosX, middlePosY);
    ctx.moveTo(direction === 'row' ? middleLineStart : middlePosX, direction === 'row' ? middlePosY : middleLineStart);
    ctx.lineTo(direction === 'row' ? middleLineEnd : middlePosX, direction === 'row' ? middlePosY : middleLineEnd);
    this.childrenItem.map(child => {   
      const childItemBound = child.getItemBound();
      const childLineStartX = direction === 'row' ? 
        childItemBound.left - wrapperBound.left + childItemBound.width / 2
          : middlePosX;
      const childLineStartY = direction === 'row' ? 
        middlePosY
          : childItemBound.top - wrapperBound.top + childItemBound.height / 2;
      const childLineEndX = direction === 'row' ? childLineStartX
        : childItemBound.left - wrapperBound.left;
      const childLineEndY = direction === 'row' ? childItemBound.top - itemBound.top
        : childLineStartY;          
      ctx.moveTo(childLineStartX, childLineStartY);
      ctx.lineTo(childLineEndX, childLineEndY);
    });
    ctx.stroke();
    this.props.parentItem && this.props.parentItem.renderLines();
  }

  render() {
    const { data, show, head, mode, style, ItemNode, itemMarginBrother, itemMarginParent, ItemWidth, ItemHeight, direction, otherProps, index } = this.props;
    const { showChildren } = this.state;
    this.childrenItem = [];
    return (
      <div className={styles.wrapper} ref={ref => this.wrapper = ref}
        style={{ zIndex: index, flexDirection: direction === 'row' ? 'column' : 'row',
          margin: show && !head ? 
            direction === 'row' ? `${itemMarginParent} 0 0 0` : `0 0 0 ${itemMarginParent}`
              : direction === 'row' ? '0 auto' : 'auto 0', ...style }}
      >
        <canvas ref={ref => this.canvas = ref} className={styles.canvas} />
        <div
          className={`${styles.item} ${show ? styles.show : ''}`}
          ref={ref => this.item = ref} 
          style={{ margin: show ? `${direction === 'column' ? itemMarginBrother : 0} ${direction === 'row' ? itemMarginBrother : 0}` : '0px', maxWidth: show ? ItemWidth : 0, maxHeight: show ? ItemHeight : 0 }}
        >
          <ItemNode data={data} ref={ref => this.item = findDOMNode(ref)} expendChildren={this.expendChildren} show={show} showChildren={showChildren} direction={direction} {...otherProps}/>
        </div>
        {data.children &&
          <div className={styles.childWrapper} style={{ flexDirection: direction }}>
            {
              data.children.map((item, index) => 
                <Item
                  index={data.children.length - index}
                  key={item.key} 
                  ref={ref=> ref && this.childrenItem.push(ref)}
                  otherProps={otherProps}
                  data={item} parentItem={this}
                  show={showChildren && show}
                  showChildren={showChildren}
                  direction={direction}
                  ItemWidth={head ? this.ItemWidth : ItemWidth}
                  ItemHeight={head ? this.ItemHeight : ItemHeight}
                  ItemNode={ItemNode}
                  itemMarginBrother={itemMarginBrother}
                  itemMarginParent={itemMarginParent}
                />
              )
            }
          </div>
        }

      </div>
    );
  }
};

export default Item;
