// @flow
import * as React from 'react';
import warning from 'warning';
import styled from 'styled-components';

const Container = styled.div`
  width: ${props => props.width}px;
  min-height: ${props => props.height}px;
  display: table;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  border-collapse: collapse;
`

type Props = {
  outerStyle: {[string]: any},
  style: {[string]: any},
  width: number,
  height: number,
  children: React.Element<*>
};

export default class DivTable extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    (this: any).validRowChildren = this.validRowChildren.bind(this);
  }

  static displayName = 'DivTable';

  static defaultProps = {
    style: {},
    width: 350,
    height: 350
  };

  validRowChildren(children: React.Element<*>) {
    const {
      height,
      width
    } = this.props;
    let rows = [];
    let i = 0;

    if (!children) {
      return;
    }

    let amountChildren = React.Children.toArray(children).length;
    let restHeight = height;

    React.Children.forEach(children, child => {
      const childRowHeight = child.props.rowHeight;
      if (childRowHeight) {
        restHeight -= childRowHeight;
        --amountChildren;
      }
    });

    React.Children.forEach(children, child => {
      const childRowHeight = child.props.rowHeight;
      if (child === null) {
        return;
      }

      let displayName = React.isValidElement(child) ?
        child.type.displayName : '';

      warning(displayName === 'DivRow',
        "Inside DivTable component should only have 'DivRow' component as children"); // eslint-disable-line max-len

      rows.push(React.cloneElement(child, {
        width,
        height,
        key: ++i,
        rowHeight: childRowHeight ? childRowHeight : restHeight / amountChildren
      }));
    });

    return rows;
  }

  render() {
    const {
      outerStyle,
      style,
      width,
      height,
      children,
      ...rest
    } = this.props;

    return (
      <Container style={outerStyle} width={width} height={height} {...rest}>
        <div style={style}>
          {this.validRowChildren(children)}
        </div>
      </Container>
    );
  }
}
