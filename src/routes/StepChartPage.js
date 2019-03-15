/** @format */
import React, { Component } from 'react';
import styles from './StepChartPage.css';
import uniqueId from 'lodash/uniqueId';
import { FlowChart, addNode, deleteNode, addBranch, deleteBranch } from '../components/FlowChart/';

class StepChartPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartData: [
        {
          no: '0',
          name: '开始',
          previous: [],
          next: ['2'],
        },
        {
          no: '1',
          name: '结束',
          previous: ['2'],
          next: [],
        },
        {
          no: '2',
          name: 'b1',
          previous: ['0'],
          next: ['1'],
        },
      ],
    };
    this.no = 3;
    this.selectedNode = null;
  }

  handleAddNode = () => {
    if (!this.selectedNode) return;
    const { chartData } = this.state;
    const newNode = {
      no: this.no++ + '',
      name: uniqueId(),
    };
    const newChartData = addNode(chartData, this.selectedNode, newNode);
    this.setState({ chartData: newChartData });
    this.selectedNode = null;
  }

  handleDeleteNode = () => {
    const { chartData } = this.state;
    const newChartData = deleteNode(chartData, this.selectedNode);
    this.setState({ chartData: newChartData });
    this.selectedNode = null;
  }

  handleDeleteBranch = () => {
    const { chartData } = this.state;
    const newChartData = deleteBranch(chartData, this.selectedNode);
    this.setState({ chartData: newChartData });
    this.selectedNode = null;
  }

  handleAddBranch = () => {
    if (!this.selectedNode) return;
    const { chartData } = this.state;
    const newBranch = [];
    for (let i = 0; i < 2; i += 1) {
      const newNode = {
        no: this.no++ + '',
        name: uniqueId(),
      };
      newBranch.push(newNode);
    }
    const newChartData = addBranch(chartData, this.selectedNode, newBranch);
    this.setState({ chartData: newChartData });
    this.selectedNode = null;
  }

  render() {
    return (
      <FlowChart
        className={styles.chart}
        chartData={this.state.chartData}
        showShadow={false}
        nodeSize={20}
        textPos={40}
        // uniderection 是否是单向的步骤图  单向的步骤图只有滚动条，无缩放和拖放。
        colDistance={1.3}
        rowDistance={1.4}
        onClickAddNode={this.handleAddNode}
        onClickAddBranch={this.handleAddBranch}
        onClickDeleteNode={this.handleDeleteNode}
        onClickDeleteBranch={this.handleDeleteBranch}
        onSelect={selectedNode => this.selectedNode = selectedNode}
      />
    )
  }
}

export default StepChartPage;
