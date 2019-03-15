/** @format */

import React, { memo, useRef } from 'react';
import PropTypes from 'prop-types';
import { addNode, addBranch, deleteNode, deleteBranch } from './utils/';
import nodeShapes from './nodeShapes';
import { render } from './render';
import styles from './index.less';

const FlowChart = memo(props => {
  const { className, style, uniderection, extraNodeShapes } = props;
  const chartInfo = { chartWrapper: useRef(null), chartView: useRef(null), selectedNode: null };
  render(props, chartInfo);
  return (
    <div
      ref={chartInfo.chartWrapper}
      className={`${className} ${styles.chartWrapper}`}
      style={{ ...style, overflow: uniderection ? 'auto' : '' }}
    >
      <svg ref={chartInfo.chartView} className={styles.chartView}>
        <defs>
          {
            <filter id="nodeShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feOffset result="offOut" in="SourceGraphic" dx="2" dy="2" />
              {/* <feFlood flood-color="rgba(0,0,0,0.5)"/> */}
              <feColorMatrix
                result="matrixOut"
                in="offOut"
                type="matrix"
                values="0.2 0 0 0 0 0 0.2 0 0 0 0 0 0.2 0 0 0 0 0 1 0"
              />
              <feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="4" />
              <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
            </filter>
          }
          {props.nodeShapes.map(shaple => shaple)}
          {extraNodeShapes && extraNodeShapes.map(shaple => shaple)}
        </defs>
        <g className="group">
          <g className="lineGroup" />
          <g className="nodeGroup" />
        </g>
      </svg>
    </div>
  );
});

FlowChart.defaultProps = {
  nodeShapes,
  colDistance: 1,
  rowDistance: 1,
  showShadow: true,
  response: true,
  textPos: 40,
  nodeSize: 50,
  shapeInfo: {
    line: {
      width: 1,
      color: '#AAB7C4',
    },
    headNode: {
      nodeShape: 'ellipse',
      fillColor: '#fff7e6',
      textColor: 'black',
      strokeColor: '#ffc069',
      popupFillColor: 'white',
      popupTextColor: 'black',
      selectedFillColor: '#ffd591',
      selectedTextColor: 'black',
      selectedStrokeColor: '#fa8c16',
    },
    tailNode: {
      nodeShape: 'ellipse',
      fillColor: '#fff7e6',
      textColor: 'black',
      strokeColor: '#ffc069',
      popupFillColor: 'white',
      popupTextColor: 'black',
      selectedFillColor: '#ffd591',
      selectedTextColor: 'black',
      selectedStrokeColor: '#fa8c16',
    },
    normalNode: {
      nodeShape: 'rectangle',
      fillColor: '#e6f7ff',
      textColor: 'black',
      strokeColor: '#69c0ff',
      popupFillColor: 'white',
      popupTextColor: 'black',
      selectedFillColor: '#91d5ff',
      selectedTextColor: 'black',
      selectedStrokeColor: '#1890ff',
    },
    branchNode: {
      nodeShape: 'rectangle',
      fillColor: '#95de64',
      textColor: 'black',
      strokeColor: '#95de64',
      popupFillColor: 'white',
      popupTextColor: 'black',
      selectedFillColor: '#b7eb8f',
      selectedTextColor: 'black',
      selectedStrokeColor: '#52c41a',
    },
  },
};

FlowChart.propTypes = {
  chartData: PropTypes.array.isRequired,
  uniderection: PropTypes.bool.isRequired,
  nodeSize: PropTypes.number,
  textPos: PropTypes.number,
  colDistance: PropTypes.number,
  rowDistance: PropTypes.number,
  response: PropTypes.bool,
  showShadow: PropTypes.bool,
  extraNodeShapes: PropTypes.array,
  shapeInfo: PropTypes.object,
  onClickAddNode: PropTypes.func,
  onClickAddBranch: PropTypes.func,
  onClickDeleteNode: PropTypes.func,
  onClickDeleteBranch: PropTypes.func,
  onSelect: PropTypes.func,
};

export { FlowChart, addNode, addBranch, deleteNode, deleteBranch };
