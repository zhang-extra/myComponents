// @flow
import * as React from 'react';
import warning from 'warning';
import styled from 'styled-components';

const OutterContainer = styled.div`
  width: 100%;
  min-height: ${props => props.rowHeight}px;
  display: table-row;
  vertical-align: top;
  box-sizing: inherit;
  -moz-box-sizing: inherit;
  -webkit-box-sizing: inherit;
`

const InnerContainer = styled.div`
  width: auto;
  height: auto;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  display: flex;
`

type Props = {
  outerStyle: {[string]: any},
  style: {[string]: any},
  width: number,
  height: number,
  rowHeight: number,
  children: React.Element<*>
}

export default class DivRow extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    (this: any).validColumnChildren = this.validColumnChildren.bind(this);
  }

  static displayName = 'DivRow';

  validColumnChildren(children: React.Element<*>) {
    const {
      rowHeight,
      width
    } = this.props;
    let rows = [];
    let i = 0;

    if (!children) {
      return;
    }
    let amountChildren = React.Children.toArray(children).length;
    let restWidth = width;

    React.Children.forEach(children, child => {
      const childCellWidth = child.props.cellWidth;
      if (childCellWidth) {
        restWidth -= childCellWidth;
        --amountChildren;
      }
    });

    React.Children.forEach(children, child => {
      const childCellWidth = child.props.cellWidth;
      if (child === null) {
        return;
      }

      let displayName = React.isValidElement(child) ?
        child.type.displayName : '';

      warning(displayName === 'DivCell',
        "Inside DivRow component should only have 'DivCell' component as children"); // eslint-disable-line max-len

      rows.push(React.cloneElement(child, {
        rowHeight,
        key: ++i,
        cellWidth: childCellWidth ? childCellWidth : restWidth / amountChildren
      }));
    });

    return rows;
  }

  render() {
    const {
      outerStyle,
      style,
      rowHeight,
      children,
      ...rest
    } = this.props;

    return (
      <OutterContainer
        style={outerStyle}
        rowHeight={rowHeight}
        {...rest}>
        <InnerContainer style={style}>
          {this.validColumnChildren(children)}
        </InnerContainer>
      </OutterContainer>
    );
  }
}
