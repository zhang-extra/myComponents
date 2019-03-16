// @flow
import * as React from 'react';

import {DivTable, DivRow, DivCell} from 'react-modular-table';
import Dimensions from './dimensions';
import Radium from 'radium';
import THEME from './styles';

export type Data = {
  rowNumber: number,
  columnNumber: number
}

type Props = {
  width: number,
  height: number,
  row: number,
  column: number,
  showDimension: boolean,
  theme: string,
  selectedRow: number,
  selectedColumn: number,
  onMouseOver: (Event, Data) => void,
  onMouseOut: (Event) => void,
  onClick: (Event, Data) => void
}

type State = {
  activeRow: ?number,
  activeCell: ?number
}

@Radium
export default class HoverTable extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    (this: any).onClickColumn = this.onClickColumn.bind(this);
    (this: any).onMouseOverColumn = this.onMouseOverColumn.bind(this);
    (this: any).onMouseOutColumn = this.onMouseOutColumn.bind(this);

    this.state = {
      activeRow: null,
      activeCell: null
    };
  }

  dimensions: ?Dimensions

  static defaultProps = {
    width: 350,
    height: 350,
    row: 12,
    column: 12,
    showDimension: true,
    theme: 'dark',
    onMouseOver: (arg: Event) => arg,
    onMouseOut: (arg: Event) => arg,
    onClick: (arg: Event) => arg
  };

  onClickColumn(e: Event, data: Data) {
    this.props.onClick(e, data);
  }

  onMouseOverColumn(e: Event, data: Data) {
    const {width, height, row, column} = this.props;
    this.props.onMouseOver(e, data);

    if (!e.target) return;

    // $FlowFixMe
    const x = (data.columnNumber + 1) * width / column;
    // $FlowFixMe
    const y = (data.rowNumber + 1) * height / row;

    this.setState({
      activeRow: data.rowNumber,
      activeCell: data.columnNumber
    });
    if (this.props.showDimension && this.dimensions) {
      this.dimensions.setTranslate(x, y, data);
    }
  }

  onMouseOutColumn(e: Event) {
    this.props.onMouseOut(e);

    this.setState({
      activeRow: null,
      activeCell: null
    });
    if (this.props.showDimension && this.dimensions) {
      this.dimensions.hideDimensions();
    }
  }

  render() {
    const {
      width,
      height,
      row,
      theme,
      column,
      selectedRow,
      selectedColumn,
      showDimension
    } = this.props;

    const {
      activeCell,
      activeRow
    } = this.state;

    // theme style
    const containerStyle = THEME[theme].container;
    const tableStyle = THEME[theme].table;
    const rowStyle = THEME[theme].row;
    const cellOuterStyle = THEME[theme].cellOuter;
    const cellStyle = THEME[theme].cell;

    const rowArr = [].constructor.apply(this, new Array(row));
    const columnArr = [].constructor.apply(this, new Array(column));

    return (
      <div style={[containerStyle, {display: 'inline-block'}]}>
        <div style={{position: 'relative'}}>
          {
            showDimension ?
            <Dimensions theme={theme} ref={node => {
              this.dimensions = node;
            }}/> : null
          }
          <DivTable width={width} height={height} outerStyle={tableStyle}>
            {
              rowArr.map((val, rowNumber) =>
                <DivRow key={rowNumber} style={rowStyle}>
                  {
                    columnArr.map((val, columnNumber) => {
                      let newCellStyle = {};
                      let active = false;
                      if (rowNumber === activeRow && columnNumber === activeCell) {
                        newCellStyle = Object.assign({}, cellStyle.default, cellStyle.mouseOver);
                      } else if (rowNumber <= activeRow && columnNumber <= activeCell) {
                        newCellStyle = Object.assign({}, cellStyle.default, cellStyle.active);
                      } else {
                        newCellStyle = Object.assign({}, cellStyle.default);
                      }

                      if (rowNumber <= selectedRow && columnNumber <= selectedColumn) {
                        newCellStyle = Object.assign({}, cellStyle.selected);
                        active = true;
                      }

                      return (
                        <DivCell
                          key={columnNumber}
                          data-active={active}
                          outerStyle={cellOuterStyle}
                          style={newCellStyle}
                          onMouseOut={this.onMouseOutColumn}
                          onMouseOver={e =>
                            this.onMouseOverColumn(e, {rowNumber, columnNumber})}
                          onClick={e =>
                            this.onClickColumn(e, {rowNumber, columnNumber})}
                          />
                      );
                    })
                  }
                </DivRow>
              )
            }
          </DivTable>
        </div>
      </div>
    );
  }
}
