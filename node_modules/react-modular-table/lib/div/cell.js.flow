// @flow
import * as React from 'react';
import styled from 'styled-components';

const OuterContainer = styled.div`
  width: ${props => props.cellWidth}px;
  min-height: ${props => props.rowHeight}px;
  box-sizing: inherit;
  -moz-box-sizing: inherit;
  -webkit-box-sizing: inherit;
  display: table-cell;
  vertical-align: top;
  word-break: break-all;
`

const InnerContainer = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
`

type Props = {
  outerStyle: {[string]: any},
  style: {[string]: any},
  rowHeight: number,
  cellWidth: number,
  children: React.Element<*>
};

export default class DivCell extends React.Component<Props> {

  static displayName = 'DivCell';

  render() {
    const {
      outerStyle,
      style,
      rowHeight,
      cellWidth,
      children,
      ...rest
    } = this.props;

    return (
      <OuterContainer
        style={outerStyle}
        cellWidth={cellWidth}
        rowHeight={rowHeight}
        {...rest}>
        <InnerContainer style={style}>
          {children}
        </InnerContainer>
      </OuterContainer>
    );
  }
}
