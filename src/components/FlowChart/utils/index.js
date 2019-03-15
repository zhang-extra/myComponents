/** @format */
import cloneDeep from 'lodash/cloneDeep';

/**
 * @description 获取chartData中的首节点引用
 * @param {array} chartData - 包含了完整节点信息的一维数组，即通过Props属性传递的chartData
 * @return {object} headNode 返回首节点的引用
 * @throws Will throw an error while none head Node is finded or nodes in chartData not have the property 'previous' of array type.
 * @version 0.0.1 2018-11-8
 * @author SSSensational <sss18201672034@163.com>
 */
const getHeadNode = chartData => {
  let headNode = null;
  try {
    for (let i = 0, length = chartData.length; i < length; i += 1) {
      if (!chartData[i].previous || !Array.isArray(chartData[i].previous)) throw `Error previous property in chartData[${i}]`;
      if (chartData[i].previous.length === 0) {
        headNode = chartData[i];
        break;
      }
    }
    if (headNode === null) throw "Can't find head node in chartData";
  } catch (err) {
    window.alert(err);
  }
  return headNode;
};

/**
 * @description 获取chartData中的尾节点引用
 * @param {array} chartData - 包含了完整节点信息的一维数组，即通过Props属性传递的chartData
 * @return {object} tailNode 返回尾节点的引用
 * @throws Will throw an error while none tail Node is finded or nodes in chartData not have the property 'next' of array type.
 * @version 0.0.1 2018-11-8
 * @author SSSensational <sss18201672034@163.com>
 */
const getTailNode = chartData => {
  let tailNode = null;
  try {
    for (let i = 0, length = chartData.length; i < length; i += 1) {
      if (!chartData[i].next || !Array.isArray(chartData[i].next)) throw `Error next property in chartData[${i}]`;
      if (chartData[i].next.length === 0) {
        tailNode = chartData[i];
        break;
      }
    }
    if (tailNode === null) throw "Can't find head node in chartData";
  } catch (err) {
    window.alert(err);
  }
  return tailNode;
};

/**
 * @description 通过no值获取chartData中返回节点的引用和索引值。
 * @param {array} chartData - 包含了完整节点信息的一维数组，即通过Props属性传递的chartData
 * @return {object} node 返回节点的引用和索引值。
 * @throws Will throw an error if none node's no value match the argument no value.
 * @version 0.0.1 2018-11-8
 * @author SSSensational <sss18201672034@163.com>
 */
const getNode = (chartData, no) => {
  let node = null, index = 0;
  try {
    for (; index < chartData.length; index += 1) {
      if (chartData[index].no === no) {
        node = chartData[index];
        break;
      }
    }
    if (node === null) throw `Can't find node${no} in chartData`;
  } catch (err) {
    window.alert(err);
  }
  return [node, index];
};

/**
 * @description 通过节点no值获取该节点的所有的上级节点
 * @param {array} nodeNo - 节点对象的no值
 * @return {Array[]} preNodes - 返回包含了目标节点所有前驱节点对象索引的数组
 * @throws 当输入节点previous属性结构有误，或者previous属性中包含的节点的no值并不能在chartData中被找到时。
 * @version 0.0.1 2018-11-9
 * @author SSSensational <sss18201672034@163.com>
 */
const getPreviousNodes = (chartData, nodeNo) => {
  let preNodes = [];
  try {
    const [node, _] = getNode(chartData, nodeNo);
    if (!node.previous || !Array.isArray(node.previous)) throw `Error previous property in node-${node.no}`;
    for (let i = 0; i < node.previous.length; i += 1) {
      const [preNode,] = getNode(chartData, node.previous[i]);
      if (preNode === null) throw `Can\'t find node-${node.no}'s parentNode-${node.previous[i]}, check the no of it`
      preNodes.push(preNode);
    }
  } catch (err) {
    window.alert(err);
  }
  return preNodes;
};
/**
 * @description 通过节点no值获取该节点的所有的下级节点
 * @param {array} nodeNo - 节点对象的no值
 * @return {Array[]} preNodes - 返回包含了目标节点所有后继节点对象索引的数组
 * @throws 当输入节点previous属性结构有误，或者previous属性中包含的节点的no值并不能在chartData中被找到时。
 * @version 0.0.1 2018-11-9
 * @author SSSensational <sss18201672034@163.com>
 */

const getNextNodes = (chartData, nodeNo) => {
  let nextNodes = [];
  try {
    const [node, _] = getNode(chartData, nodeNo);
    if (!node.next || !Array.isArray(node.next)) throw `Error previous next in node-${node.no}`;
    for (let i = 0; i < node.next.length; i += 1) {
      const [nextNode,] = getNode(chartData, node.next[i]);
      if (nextNode === null) throw `Can\'t find node-${node.no}'s childNode-${node.next[i]}, check the no of it`
      nextNodes.push(nextNode);
    }
  } catch (err) {
    window.alert(err);
  }
  return nextNodes;
};

/**
 * @description 给chartData增加brother[]属性，记录其兄弟节点的no值.
 * @param {array} chartData - 包含了完整节点信息的一维数组，即通过Props属性传递的chartData.
 * @return {object} chartData 直接对引用进行修改，所以没返回值.
 * @version 0.0.1 2018-11-9
 * @author wz <858421404@163.com>
 */
const buildBrother = chartData => {
  for (let i = 0, length = chartData.length; i < length; i += 1) {
    chartData[i].brother=[];
  }
  for (let i = 0, length = chartData.length; i < length; i += 1){
      const nextNodes = getNextNodes(chartData, chartData[i].no);
    if (nextNodes.length > 1) {
      for(let j = 0; j < nextNodes.length ; j += 1){
        var brothers = [...chartData[i].next];   
        var subscript = brothers.indexOf(nextNodes[j].no) 
        brothers.splice(subscript,1);     
        nextNodes[j].brother.push(...brothers); 
      }
    }
  }
  for (let i = 0, length = chartData.length; i < length; i += 1) {
    if (chartData[i].previous.length === 0) chartData[i].nodeType = 'headNode';
    else if (chartData[i].next.length === 0) chartData[i].nodeType = 'tailNode';
    else if (chartData[i].brother.length === 0) chartData[i].nodeType = 'normalNode';
    else chartData[i].nodeType = 'branchNode';
  }
};

/**
 * @description 在目标节点与下级节点之间新增一个节点
 * @param {array} preChartData - 包含了完整节点信息的一维数组，即通过Props属性传递的chartData.
 * @param {object} preTargetNode - 目标节点.
 * @param {array} newNode - 不包含节点间关系，只包含节点信息的新增节点, 即没有previous,  next属性.
 * @return {array} chartData  新增节点后的新chartData数组.
 * @version 0.0.1 2018-12-10
 * @author SSSensational <sss18201672034@163.com>
 */
const addNode = (preChartData, preTargetNode, newNode) => {
  const chartData = cloneDeep(preChartData);
  const [targetNode, _] = getNode(chartData, preTargetNode.no);
  const nextNodes = getNextNodes(chartData, targetNode.no);
  newNode.previous = [targetNode.no]; // 增加新增节点的前驱后继信息
  newNode.next = targetNode.next.slice();
  for (let i = 0, length = nextNodes.length; i < length; i += 1) { // 从目标节点所有后继节点的前驱中删除目标节点no值， 并加入新节点no值.
    nextNodes[i].previous.push(newNode.no);
    nextNodes[i].previous.splice(nextNodes[i].previous.indexOf(targetNode.no), 1);
  }
  targetNode.next.splice(0, targetNode.next.length); // 清空目标节点后继值.
  targetNode.next.push(newNode.no); // 在目标节点的后继值中加入新增节点no值.
  chartData.push(newNode);
  return chartData;
};

/**
 * @description 在目标节点与下级节点之间新增一个分支
 * @param {array} preChartData - 包含了完整节点信息的一维数组，即通过Props属性传递的chartData.
 * @param {object} preTargetNode - 目标节点.
 * @param {array} newBranch - 新增分支，里面包含了任意数量的分支节点，节点也不包含节点间关系。.
 * @return {array} chartData  新增分支后的新chartData数组.
 * @version 0.0.1 2018-12-10
 * @author SSSensational <sss18201672034@163.com>
 */
const addBranch = (preChartData, preTargetNode, newBranch) => {
  const chartData = cloneDeep(preChartData);
  const [targetNode, _] = getNode(chartData, preTargetNode.no);
  for(let i = 0, length = newBranch.length; i < length; i += 1) { // 增加新增分支内所有节点的前驱后继信息
    newBranch[i].previous = [targetNode.no];
    newBranch[i].next = targetNode.next.slice();
  }
  const nextNodes = getNextNodes(chartData, targetNode.no);
  for (let i = 0, length = nextNodes.length; i < length; i += 1) { // 从目标节点所有后继节点的前驱中删除目标节点no值， 并加入新增分支内每一个节点的no值.
    newBranch.map(node =>  nextNodes[i].previous.push(node.no))
    nextNodes[i].previous.splice(nextNodes[i].previous.indexOf(targetNode.no), 1);
  }
  targetNode.next.splice(0, targetNode.next.length); // 清空目标节点后继值.
  newBranch.map(node => targetNode.next.push(node.no)) // 在目标节点的后继值中加入新增分支内每一个节点的no值.
  newBranch.map(node => chartData.push(node))
  return chartData;
};

/**
 * @description 删除目标节点
 * @param {array} preChartData - 包含了完整节点信息的一维数组，即通过Props属性传递的chartData.
 * @param {object} preTargetNode - 目标节点.
 * @return {array} chartData  删除目标节点后的新chartData数组.
 * @version 0.0.1 2018-12-10
 * @author SSSensational <sss18201672034@163.com>
 */
const deleteNode = (preChartData, preTargetNode) => {
  const chartData = cloneDeep(preChartData);
  const [targetNode, index] = getNode(chartData, preTargetNode.no);
  const nextNodes = getNextNodes(chartData, targetNode.no);
  const preNodes = getPreviousNodes(chartData, targetNode.no);
  for (let i = 0, length = preNodes.length; i < length; i += 1) { // 从目标节点的所有前驱节点的后继中删除目标节点的no值， 加入目标节点的所有后继节点的no值。
    preNodes[i].next.splice(preNodes[i].next.indexOf(targetNode.no), 1);
    for (let j = 0, len = nextNodes.length; j < len; j += 1) preNodes[i].next.push(nextNodes[j].no);
  }
  for (let i = 0, length = nextNodes.length; i < length; i += 1) { // 从目标节点的所有后继节点的前驱中删除目标节点的no值， 加入目标节点的所有前驱节点的no值。
    nextNodes[i].previous.splice(nextNodes[i].previous.indexOf(targetNode.no), 1);
    for (let j = 0, len = preNodes.length; j < len; j += 1) nextNodes[i].previous.push(preNodes[j].no);
  }
  chartData.splice(index, 1)
  return chartData;
};

/**
 * @description 如果目标节点下级是个分支，调用该函数删除分支上的所有节点。
 * @param {array} preChartData - 包含了完整节点信息的一维数组，即通过Props属性传递的chartData.
 * @param {object} preTargetNode - 目标节点.
 * @return {array} chartData  删除下属分支后的新chartData数组.
 * @version 0.0.1 2018-12-10
 * @author SSSensational <sss18201672034@163.com>
 */
const deleteBranch = (preChartData, preTargetNode) => {
  /* 要删除从当前目标节点的下级分支，需要明确其开始节点和结束节点，开始节点即为目标节点本身。
  大致思路是从目标节点开始，第一次遍历其下每一个分支，给各条分支上的每一个节点加上各自分支路径的标记, 将其放入节点对象的属性path[]中。。
  第二次遍历选择其中一条分支(这里选的是最左边一条),找到第一个path[]属性值里汇集了所有分支路径标记的节点，即为结束节点。*/
  const chartData = cloneDeep(preChartData);
  const [targetNode, index] = getNode(chartData, preTargetNode.no);
  let goalNode; // 要寻找的结束节点
  const deleteNodeNo = [], goalNodePath = [];
  const nextNodes = getNextNodes(chartData, targetNode.no);
  const preNodes = getPreviousNodes(chartData, targetNode.no);
  for (let i = 0, length = nextNodes.length; i < length; i += 1) goalNodePath.push(i);
  const traversalToFindGoalNode = (node, path) => {
    if (path !== undefined) {
      if (!node.path) node.path = [];
      if (node.path.indexOf(path) === -1) node.path.push(path);
    }
    for (let i = 0; i < node.next.length; i += 1) {
      traversalToFindGoalNode(getNode(chartData, node.next[i])[0], node.no === targetNode.no ? i : path);
    }
  };
  traversalToFindGoalNode(targetNode);
  const traversalToDeleteNodes = node => {
    if (node) {
      if (node.previous.length > 1 && JSON.stringify(node.path) === JSON.stringify(goalNodePath)) {
        goalNode = node;
      } else {
        for (let i = 0; i < node.next.length; i += 1) {
          traversalToDeleteNodes(getNode(chartData, node.next[i])[0]);
        }
        if (node.no !== targetNode.no) {
          deleteNodeNo.push(node.no);
          chartData.splice(getNode(chartData, node.no)[1], 1);
        }
      }
    }
  };
  traversalToDeleteNodes(targetNode);
  for (let i = 0, length = deleteNodeNo.length; i < length; i += 1) {
    goalNode.previous = goalNode.previous.filter(nodeNo => nodeNo !== deleteNodeNo[i]);
  }
  targetNode.next = [goalNode.no];
  goalNode.previous.push(targetNode.no);
  for (let i = 0, length = chartData.length; i < length; i += 1) {
    delete chartData[i].path;
  }
  return chartData;
};

export default {
  getNode,
  getHeadNode,
  getTailNode,
  getNextNodes,
  getPreviousNodes,
  buildBrother,
  addNode,
  addBranch,
  deleteNode,
  deleteBranch,
};
