/** @format */

import { useEffect } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import * as d3 from 'd3';
import { getHeadNode, getTailNode, getPreviousNodes, getNextNodes, buildBrother, getNode } from './utils';

import deleteNodeIcon from './icon/deleteNode.svg';
import deleteBranchIcon from './icon/deleteBranch.svg';
import addBranchIcon from './icon/addBranch.svg';
import addNodeIcon from './icon/addNode.svg';

const calcNodePos = (props, chartInfo) => {
  const { uniderection } = props;
  const { chartWidth, nodeWidth, chartView, innerChartData, rowDistance, colDistance } = chartInfo;
  const headNode = getHeadNode(innerChartData);
  const tailNode = getTailNode(innerChartData);
  /* 节点的位置为其父节点的位置parentNode.posX + rowDistance * 父节点的偏移量parentNode.offset * 该节点的偏移位置offsetPos。*/
  (function reverseTraversalNodes(node, offset) {
    // 倒序遍历节点求得每个节点的偏移量offset和偏移位置offsetPos
    node.posY = 0;
    let nextNodeOffset;
    if (node.next.length > 1) {
      if (node.offset && node.offset < offset) node.offset = offset;
      if (!node.offset) node.offset = offset === 0 ? 1 : offset;
      nextNodeOffset = node.offset * node.next.length;
    } else {
      node.offset = 0;
      nextNodeOffset = offset;
    }
    if (node.previous.length > 1) nextNodeOffset = 0;
    /* 倒序遍历节点，给出当前节点相对于父节的偏移位置offsetPos。
    如父节点有四个子节点0, 1, 2, 3 子节点的偏移位置offsetPos分别应该为 -2, -1, 1, 2。*/
    if (node.previous.length >= 1) {
      const parentNodes = getPreviousNodes(innerChartData, node.no);
      const indexInParentNode = parentNodes[0].next.indexOf(node.no);
      const childNumber = parentNodes[0].next.length;
      node.offsetPos = indexInParentNode - parseInt(childNumber / 2);
      if (childNumber % 2 === 0 && indexInParentNode >= parseInt(childNumber / 2))
        node.offsetPos += 1;
      if (node.brother.length % 2 === 1) node.offsetPos += node.offsetPos > 0 ? -0.5 : 0.5;
      for (let i = 0, length = parentNodes.length; i < length; i += 1)
        reverseTraversalNodes(parentNodes[i], nextNodeOffset);
    } else {
      // 若为首节点结束遍历
      node.offsetPos = 0;
    }
  })(tailNode, 0);
  (function traversalNodes(node, posY) {
    if (!node.posY || node.posY < posY) node.posY = posY;
    if (node === headNode) {
      node.posX = (chartWidth - nodeWidth) / 2;
    } else {
      let parentNodesX = 0;
      const parentNodes = getPreviousNodes(innerChartData, node.no);
      for (let i = 0, length = parentNodes.length; i < length; i += 1) {
        parentNodesX += parentNodes[i].posX;
      }
      parentNodesX /= parentNodes.length;
      node.posX = parentNodesX;
      if (parentNodes.length === 1) {
        node.posX += parentNodes[0].offset * node.offsetPos * rowDistance;
      }
    }
    if (node.next.length >= 1) {
      const childNodes = getNextNodes(innerChartData, node.no);
      for (let i = 0, length = childNodes.length; i < length; i++)
        traversalNodes(childNodes[i], posY + colDistance);
    }
  })(headNode, 10);
  if (uniderection) chartView.current.style.height = tailNode.posY + colDistance + nodeWidth;
};

const renderNode = (props, chartInfo, renderType) => {
  const { shapeInfo, showShadow, textPos, onClickAddNode, onClickDeleteNode, onClickAddBranch, onClickDeleteBranch } = props;
  const { chartWidth, nodeWidth, chartView, innerChartData, colDistance } = chartInfo;
  d3.select(chartView.current).on('click', () => selectNone(props, chartInfo));
  const nodeGroup = d3.select(chartView.current).select('.nodeGroup');
  const lineGroup = d3.select(chartView.current).select('.lineGroup');
  let lines = lineGroup.selectAll('path').data(innerChartData, d => d.no);
  let nodes = nodeGroup.selectAll('g').data(innerChartData, d => d.no);
  if (renderType === 'append') nodes = nodes.enter().append('g');
  if (renderType === 'append') lines = lines.enter().append('path');
  if (renderType === 'exit') {
    lines.exit().remove();
    nodes = nodes.exit();
    nodes
      .transition()
      .duration(500)
      .remove();
  }
  const nodeShape = renderType === 'append' ? nodes.append('use') : nodes.select('use');
  const nodeText = renderType === 'append' ? nodes.append('foreignObject') : nodes.select('foreignObject');
  const nodeDeleteNodeIcon = renderType === 'append' ? nodes.append('foreignObject') : nodes.select('.deleteNodeIcon');
  const nodeAddNodeIcon = renderType === 'append' ? nodes.append('foreignObject') : nodes.select('.addNodeIcon');
  const nodeAddBranchIcon = renderType === 'append' ? nodes.append('foreignObject') : nodes.select('.addBranchIcon');
  const nodeDeleteBranchIcon = renderType === 'append' ? nodes.append('foreignObject') : nodes.select('.deleteBranchIcon');
  nodes
    .on('click', () => (d3.event.target.nodeName === 'use' || d3.event.target.nodeName === 'foreignObject') && selectNode(props, chartInfo))
    .attr('class', data => `node-${data.no}`)
    .transition('transform')
    .duration(renderType === 'update' ? 500 : 0)
    .attr('transform', data => `translate(${data.posX},${data.posY})`);
  nodeShape
    .attr('xlink:href', data => `#${shapeInfo[data.nodeType].nodeShape}`)
    .attr('fill', data => shapeInfo[data.nodeType].fillColor)
    .attr('stroke', data => shapeInfo[data.nodeType].strokeColor)
    .attr('width', `${nodeWidth}`)
    .attr('height', `${nodeWidth}`)
    .attr('transform', renderType !== 'exit' ? 'scale(0, 0)' : 'scale(1, 1)')
    .transition('transform')
    .duration(renderType === 'update' ? 0 : 500)
    .attr('transform', renderType !== 'exit' ? 'scale(1, 1)' : 'scale(0, 0)');
  showShadow && nodeShape.attr('filter', `url(#nodeShadow)`);
  nodeText
    .text(data => data.name)
    .attr('class', 'nodeText')
    .attr('width', `${(nodeWidth * 3) / 4}`)
    .attr('height', `${nodeWidth * (1 - textPos / 100)}`)
    .attr('x', `${nodeWidth / 8}`)
    .attr('y', `${(nodeWidth * textPos) / 100}`)
    .style('overflow', 'hidden')
    .style('white-space', 'nowrap')
    .style('text-overflow', 'ellipsis')
    .style('text-align', 'center')
    .style('color', data => shapeInfo[data.nodeType].textColor)
    .attr('transform', renderType !== 'exit' ? 'scale(0, 0)' : 'scale(1, 1)')
    .transition('transform')
    .duration(renderType === 'update' ? 0 : 500)
    .attr('transform', renderType !== 'exit' ? 'scale(1, 1)' : 'scale(0, 0)');
  nodeDeleteNodeIcon
    .attr('class', 'deleteNodeIcon')
    .attr('x', `${nodeWidth / 0.939}`)
    .attr('y', `${nodeWidth * 3.5 / 10}`)
    .style('width', `${nodeWidth / 9}`)
    .style('height', `${nodeWidth / 9}`)
    .style('background', `url(${deleteNodeIcon})`)
    .style('background-repeat', 'no-repeat')
    .style('background-size', 'contain')
    .style('cursor', 'pointer')
    .style('fill', 'red') 
    .style('display', 'none');
  nodeDeleteBranchIcon
    .attr('class', 'deleteBranchIcon')
    .attr('x', `${nodeWidth / 0.943}`)
    .attr('y', `${nodeWidth * 6.5 / 10}`)
    .style('width', `${nodeWidth / 8.9}`)
    .style('height', `${nodeWidth / 8.9}`)
    .style('background', `url(${deleteBranchIcon})`)
    .style('background-repeat', 'no-repeat')
    .style('background-size', 'contain')
    .style('cursor', 'pointer')
    .style('fill', 'red') 
    .style('display', 'none');
  nodeAddBranchIcon
    .attr('class', 'addBranchIcon')
    .attr('x', `${nodeWidth / 0.943}`)
    .attr('y', `${nodeWidth * 5 / 10}`)
    .style('width', `${nodeWidth / 8.8}`)
    .style('height', `${nodeWidth / 8.8}`)
    .style('background', `url(${addBranchIcon})`)
    .style('background-repeat', 'no-repeat')
    .style('background-size', 'contain')
    .style('cursor', 'pointer')
    .style('display', 'none');
  nodeAddNodeIcon
  .attr('class', 'addNodeIcon')
  .attr('x', `${nodeWidth / 0.95}`)
  .attr('y', `${nodeWidth * 2 / 10}`)
  .style('width', `${nodeWidth / 7.5}`)
  .style('height', `${nodeWidth / 7.5}`)
  .style('background', `url(${addNodeIcon})`)
  .style('background-repeat', 'no-repeat')
  .style('background-size', 'contain')
  .style('cursor', 'pointer')
  .style('display', 'none');
  if (onClickAddNode) {
    nodeAddNodeIcon.on('click', () => {
      d3.event.stopPropagation();
      onClickAddNode();
      selectNone(props, chartInfo, true);
    });
  }
  if (onClickDeleteNode) { 
    nodeDeleteNodeIcon.on('click', () => { 
      d3.event.stopPropagation();
      onClickDeleteNode();
      selectNone(props, chartInfo, true);
    });
  }
  if (onClickAddBranch) { 
    nodeAddBranchIcon.on('click', () => { 
      d3.event.stopPropagation();
      onClickAddBranch();
      selectNone(props, chartInfo, true);
    });
  }
  if (onClickDeleteBranch) { 
    nodeDeleteBranchIcon.on('click', () => { 
      d3.event.stopPropagation();
      onClickDeleteBranch();
      selectNone(props, chartInfo, true);
    });
  }
  lines
    .style('fill', 'none')
    .style('stroke', shapeInfo.line.color)
    .style('stroke-width', shapeInfo.line.width)
    .style('stroke-dasharray', data => {
      let adjacentNode;
      if (data.previous.length > 0) adjacentNode = getPreviousNodes(innerChartData, data.no)[0];
      else if (data.next.length > 0) adjacentNode = getNextNodes(innerChartData, data.no)[0];
      const maxLength =
        5 * (Math.abs(adjacentNode.posX - data.posX) + Math.abs(adjacentNode.posY - data.posY));
      return maxLength;
    })
    .attr('d', data => {
      const path = d3.path(colDistance);
      if (data.next.length > 0) {
        const nextNodes = getNextNodes(innerChartData, data.no);
        let firstChild = nextNodes[0];
        let lastChild = nextNodes[0];
        for (let i = 0, length = nextNodes.length; i < length; i += 1) {
          if (nextNodes[i].posX < firstChild.posX) firstChild = nextNodes[i];
          if (nextNodes[i].posX > lastChild.posX) lastChild = nextNodes[i];
        }
        path.moveTo(data.posX + nodeWidth / 2, data.posY + nodeWidth / 2);
        path.lineTo(data.posX + nodeWidth / 2, firstChild.posY + nodeWidth / 2 - colDistance / 2);
        path.moveTo(firstChild.posX + nodeWidth / 2, data.posY + nodeWidth / 2 + colDistance / 2);
        path.lineTo(lastChild.posX + nodeWidth / 2, data.posY + nodeWidth / 2 + colDistance / 2);
      }
      if (data.previous.length > 0) {
        const previousNodes = getPreviousNodes(innerChartData, data.no);
        let firstChild = previousNodes[0];
        let lastChild = previousNodes[0];
        for (let i = 0, length = previousNodes.length; i < length; i += 1) {
          if (previousNodes[i].posX < firstChild.posX) firstChild = previousNodes[i];
          if (previousNodes[i].posX > lastChild.posX) lastChild = previousNodes[i];
        }
        path.moveTo(firstChild.posX + nodeWidth / 2, data.posY + nodeWidth / 2 - colDistance / 2);
        path.lineTo(lastChild.posX + nodeWidth / 2, data.posY + nodeWidth / 2 - colDistance / 2);
        path.moveTo(data.posX + nodeWidth / 2, data.posY + nodeWidth / 2 - colDistance / 2);
        path.lineTo(data.posX + nodeWidth / 2, data.posY + nodeWidth / 2);
        path.moveTo(data.posX + nodeWidth / 2, data.posY + nodeWidth / 5);
        path.lineTo(data.posX + nodeWidth / 2 - nodeWidth / 20, data.posY + nodeWidth / 5 - nodeWidth / 20);
        path.moveTo(data.posX + nodeWidth / 2, data.posY + nodeWidth / 5);
        path.lineTo(data.posX + nodeWidth / 2 + nodeWidth / 20, data.posY + nodeWidth / 5 - nodeWidth / 20);
      }
      return path.toString();
    })
    .transition()
    .duration(renderType === 'resize' ? 1 : 3000)
    .styleTween('stroke-dashoffset', data => {
      let adjacentNode;
      if (data.previous.length > 0) adjacentNode = getPreviousNodes(innerChartData, data.no)[0];
      else if (data.next.length > 0) adjacentNode = getNextNodes(innerChartData, data.no)[0];
      const maxLength =
        5 * (Math.abs(adjacentNode.posX - data.posX) + Math.abs(adjacentNode.posY - data.posY));
      return d3.interpolateNumber(maxLength, 0);
    });
};

const selectNode = (props, chartInfo) => {
  const { chartData, onSelect, shapeInfo, uniderection } = props;
  const { chartView, selectedNode, innerChartData } = chartInfo;
  const selection = d3.select(d3.event.target.parentNode);
  const selectNode = getNode(innerChartData, selection.attr('class').slice(5))[0];
  if (selectedNode && selectedNode.no === selectNode.no) return;
  if (selectedNode && selectedNode.no !== selectNode.no) selectNone(props, chartInfo, true);
  chartInfo.selectedNode = selectNode;
  selection.select('use')
    .transition()
    .attr('fill', data => shapeInfo[data.nodeType].selectedFillColor)
    .attr('stroke', data => shapeInfo[data.nodeType].selectedStrokeColor);
  selection.select('foreignObject')
    .transition()
    .style('color', data => shapeInfo[data.nodeType].selectedTextColor);
  selection.select('.addBranchIcon') // 本身不是分支中的节点并且下级节点不是分支的节点才能增加新增分支
    .style('display', data => !uniderection && data.next.length === 1 && data.brother.length === 0 ? 'block' : 'none')
    .transition('opacity')
    .style('opacity', 1);
  selection.select('.addNodeIcon') // 尾节点不能新增节点
    .style('display', data => data.next.length > 0 ? 'block' : 'none')
    .transition('opacity')
    .style('opacity', 1);
  selection.select('.deleteNodeIcon') // 首尾节点和分支节点以及处于两处分支之间的节点不能被删除
    .style('display', data => data.previous.length === 0 || data.next.length === 0 || data.brother.length !== 0 || (getNextNodes(innerChartData, data.no)[0].brother.length > 0 && getPreviousNodes(innerChartData, data.no)[0].brother.length > 0 ) ? 'none' : 'block')
    .transition('opacity')
    .style('opacity', 1);
  selection.select('.deleteBranchIcon') // 下级节点是分支的节点才能删除分支
    .style('display', data => data.next.length > 0 && getNextNodes(innerChartData, data.no)[0].brother.length > 0 ? 'block' : 'none')
    .transition('opacity')
    .style('opacity', 1);
  if (onSelect) onSelect(getNode(chartData, chartInfo.selectedNode.no)[0]);
};

const selectNone = (props, chartInfo, cancelSelect) => {
  const { shapeInfo, onSelect } = props;
  const { chartView, selectedNode } = chartInfo;
  if ((selectedNode && (!d3.event || d3.event.target === chartView.current)) || cancelSelect) {
    const selection = d3.select(chartView.current).select('.nodeGroup').select(`.node-${selectedNode.no}`);
    selection.select('use')
      .transition()
      .attr('fill', data => shapeInfo[data.nodeType].fillColor)
      .attr('stroke', data => shapeInfo[data.nodeType].strokeColor);
    selection
      .select('foreignObject')
      .transition()
      .style('color', data => shapeInfo[data.nodeType].textColor);
  selection.select('.addBranchIcon')
    .transition('opacity')
    .style('opacity', 0)
    .style('display', 'none');
  selection.select('.addNodeIcon')
    .transition('opacity')
    .style('opacity', 0)
    .style('display', 'none');
  selection.select('.deleteNodeIcon')
    .transition('opacity')
    .style('opacity', 0)
    .style('display', 'none');
  selection.select('.deleteBranchIcon')
    .transition('opacity')
    .style('opacity', 0)
    .style('display', 'none');
  chartInfo.selectedNode = null;
  if (onSelect) onSelect(null);
  }
};

const getChartInfo = (props, chartInfo, isResize) => {
  if (!isResize) chartInfo.innerChartData = cloneDeep(props.chartData);
  if (chartInfo.chartWrapper.current !== null) chartInfo.chartWidth = chartInfo.chartWrapper.current.clientWidth;
  chartInfo.nodeWidth = (chartInfo.chartWidth * props.nodeSize) / 100;
  chartInfo.colDistance = props.colDistance * chartInfo.nodeWidth;
  chartInfo.rowDistance = props.rowDistance * chartInfo.nodeWidth;
}

const render = (props, chartInfo) => {

  useEffect(() => {
    getChartInfo(props, chartInfo);
    buildBrother(chartInfo.innerChartData);
    calcNodePos(props, chartInfo);
    renderNode(props, chartInfo, 'update'); // 请勿改动调用顺序
    renderNode(props, chartInfo, 'append');
    renderNode(props, chartInfo, 'exit');
  }, [props]);
  useEffect(() => {
    if (!props.uniderection) {
      const chartView = d3.select(chartInfo.chartView.current);
      const group = chartView.select('.group');
      function zoomed() {
        group.attr('transform', d3.event.transform);
      }
      chartView.call(
        d3
          .zoom()
          .scaleExtent([0.1, 1])
          .on('zoom', zoomed),
      );
    }
    if (props.response) {
      const handleResize = () => {
        getChartInfo(props, chartInfo, true);
        calcNodePos(props, chartInfo);
        renderNode(props, chartInfo, 'update');
      }
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  });
};

export default { render };
