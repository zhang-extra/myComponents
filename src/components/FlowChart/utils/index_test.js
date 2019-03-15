/** @format */

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
 * @description 通过no值获取chartData中该节点的引用
 * @param {array} chartData - 包含了完整节点信息的一维数组，即通过Props属性传递的chartData
 * @return {object} node 返回该节点的引用
 * @throws Will throw an error if none node's no value match the argument no value.
 * @version 0.0.1 2018-11-8
 * @author SSSensational <sss18201672034@163.com>
 */
const getNode = (chartData, no) => {
  let node = null;
  try {
    for (let i = 0; i < chartData.length; i += 1) {
      if (chartData[i].no === no) {
        node = chartData[i];
        break;
      }
    }
    if (node === null) throw `Can't find node${no} in chartData`;
  } catch (err) {
    window.alert(err);
  }
  return node;
};

/**
 * @description 通过no值获取chartData中该节点的引用
 * @param {array} node - 某节点对象的索引
 * @return {Array[]} preNodes - 返回包含了输入节点所有前驱节点对象索引的数组
 * @throws 当输入节点previous属性结构有误，或者previous属性中包含的节点的no值并不能在chartData中被找到时。
 * @version 0.0.1 2018-11-9
 * @author SSSensational <sss18201672034@163.com>
 */
const getPreviousNodes = (chartData, node) => {
  let preNodes = [];
  try {
    if (!node.previous || !Array.isArray(node.previous)) throw `Error previous property in node-${node.no}`;
    for (let i = 0; i < node.previous.length; i += 1) {
      const preNode = getNode(chartData, node.previous[i]);
      if (preNode === null) throw `Can\'t find node-${node.no}'s parentNode-${node.previous[i]}, check the no of it`
      preNodes.push(preNode);
    }
  } catch (err) {
    window.alert(err);
  }
  return preNodes;
};
/**
 * @description 通过no值获取chartData中该节点的引用
 * @param {array} node - 某节点对象的索引
 * @return {Array[]} preNodes - 返回包含了输入节点所有前驱节点对象索引的数组
 * @throws 当输入节点previous属性结构有误，或者previous属性中包含的节点的no值并不能在chartData中被找到时。
 * @version 0.0.1 2018-11-9
 * @author SSSensational <sss18201672034@163.com>
 */

const getNextNodes = (chartData, node) => {
  let nextNodes = [];
  try {
    if (!node.next || !Array.isArray(node.next)) throw `Error previous next in node-${node.no}`;
    for (let i = 0; i < node.next.length; i += 1) {
      const nextNode = getNode(chartData, node.next[i]);
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
  for(let i = 0, length = chartData.length; i < length; i += 1){
    chartData[i].brother=[];
  }
  for (let i = 0, length = chartData.length; i < length; i += 1){
      const nextNodes = getNextNodes(chartData, chartData[i]);
    if( nextNodes.length > 1 ){
      for(let j = 0; j < nextNodes.length ; j += 1){
        var brothers = [...chartData[i].next];   
        var subscript = brothers.indexOf(nextNodes[j].no) 
        brothers.splice(subscript,1);     
        nextNodes[j].brother.push(...brothers); 
      }
    }

  }
  // console.log(chartData);
  return chartData;
};

const AddNewNode = (chartData, selectedNode, newNode) => {
  const nextNodes = getNextNodes(chartData, selectedNode);
  newNode.previous = [selectedNode.no];
  newNode.next = selectedNode.next.slice();
  for (let i = 0, length = nextNodes.length; i < length; i += 1) {
    nextNodes[i].previous.push(newNode.no);
    nextNodes[i].previous.splice(nextNodes[i].previous.indexOf(selectedNode.no), 1);
  }
  selectedNode.next.splice(0, selectedNode.next.length);
  selectedNode.next.push(newNode.no);
  chartData.push(newNode);
  return [chartData, newNode];
};

const AddNewBranchNode = (chartData, pre, nodes) => {};

const DeleteNode = (chartData, node) => {

  console.log(chartData);
};

const DeleteBranch = (chartData, node) => {};

module.exports = {
  getNode,
  getHeadNode,
  getTailNode,
  getNextNodes,
  getPreviousNodes,
  buildBrother,
  AddNewNode,
  AddNewBranchNode,
  DeleteNode,
  DeleteBranch,
};
