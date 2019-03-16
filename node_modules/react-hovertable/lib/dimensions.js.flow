// @flow
import * as React from 'react';
import type {Data} from './hoverTable';
import Radium from 'radium';
import THEME from './styles';

type Props = {
  theme: string
}

type State = {
  show: boolean,
  x: number,
  y: number,
  data: Data
}

@Radium
export default class Dimensions extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    (this: any).setTranslate = this.setTranslate.bind(this);

    this.state = {
      show: false,
      x: 0,
      y: 0,
      data: {
        rowNumber: 0,
        columnNumber: 0
      }
    };
  }

  hideDimensions() {
    this.setState({show: false});
  }

  setTranslate(x: number, y: number, data: Data) {
    this.setState({
      show: true,
      x, y, data
    });
  }

  render() {
    const {
      show,
      x,
      y,
      data
    } = this.state;

    const dimensionStyle = THEME[this.props.theme].dimensions;
    const position = {
      left: x,
      top: y
    };

    return show ? <div style={[dimensionStyle, position]}>
      {data.columnNumber + 1}
      <span style={{padding: '0 3px'}}>x</span>
      {data.rowNumber + 1}
    </div> : null;
  }
}
