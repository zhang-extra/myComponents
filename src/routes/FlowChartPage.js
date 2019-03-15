/** @format */

import React, { Component } from 'react';
import styles from './FlowChartPage.css';
import NodeChart from '../components/NodeChart';

const initialChartData = [
  {
    id: '0',
    data: {
      title: 'start',
    },
    parent: [],
    children: [
      {
        id: '1',
      },
    ],
    brother: [],
  },
  {
    id: '1',
    data: {
      title: 'end',
    },
    parent: [
      {
        id: '0',
      },
    ],
    children: [],
    brother: [],
  },
];

class FlowChartPage extends Component {
  onChange = chartData => {
    console.log(chartData);
  };

  onSelect = selectedNode => {
    console.log(selectedNode);
  };

  render() {
    return (
      <div className={styles.App}>
        <NodeChart
          onChange={this.onChange}
          onSelect={this.onSelect}
          initialChartData={initialChartData}
          mode="flowChart"
          nodeSize={50} // 节点大小占容器大小的百分比
          textPos={38} //  文字的距节点顶部的百分比
          nodeShadow={true} //所有节点是否有阴影
          style={{
            // 流程的box
            height: '80%',
            width: '80%',
            margin: 'auto',
            fontSize: '6vw',
            boxShadow: 'none',
          }}
          rowDistance={0.75} // 节点大小的倍数
          colDistance={0.75} // 节点大小的倍数
        />
      </div>
    );
  }
}

export default FlowChartPage;
