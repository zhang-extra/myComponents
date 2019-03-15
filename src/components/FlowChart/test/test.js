/** @format */
// import { buildBrother } from '../utils/index';
// import cloneDeep from 'lodash/cloneDeep';

const data1Start = [
  {
    no: '0',
    name: '开始',
    previous: [],
    next: ['2', '3', '4'],
  },
  {
    no: '1',
    name: '结束',
    previous: ['2', '3', '4'],
    next: [],
  },
  {
    no: '2',
    name: 'b1',
    previous: ['0'],
    next: ['1'],
  },
  {
    no: '3',
    name: 'b2',
    previous: ['0'],
    next: ['1'],
  },
  {
    no: '4',
    name: 'b3',
    previous: ['0'],
    next: ['1'],
  },
];

const data1End = [
  {
    no: '0',
    name: '开始',
    previous: [],
    next: ['2', '3', '4'],
    brother: [],
  },
  {
    no: '1',
    name: '结束',
    previous: ['2', '3', '4'],
    next: [],
    brother: [],
  },
  {
    no: '2',
    name: 'b1',
    previous: ['0'],
    next: ['1'],
    brother: ['3', '4'],
  },
  {
    no: '3',
    name: 'b2',
    previous: ['0'],
    brother: ['2', '4'],
    next: ['1'],
  },
  {
    no: '4',
    name: 'b3',
    previous: ['0'],
    brother: ['2', '3'],
    next: ['1'],
  },
];

const data2Start = [
  {
    no: '0',
    name: '开始',
    previous: [],
    next: ['2', '3', '4'],
  },
  {
    no: '1',
    name: '结束',
    previous: ['2', '4', '5', '6'],
    next: [],
  },
  {
    no: '2',
    name: 'b1',
    previous: ['0'],
    next: ['1'],
  },
  {
    no: '3',
    name: 'b2',
    previous: ['0'],
    next: ['5', '6'],
  },
  {
    no: '4',
    name: 'b3',
    previous: ['0'],
    next: ['1'],
  },

  {
    no: '5',
    name: 'b4',
    previous: ['3'],
    next: ['1'],
  },
  {
    no: '6',
    name: 'b5',
    previous: ['3'],
    next: ['1'],
  },
];

const data2End = [
  {
    no: '0',
    name: '开始',
    previous: [],
    next: ['2', '3', '4'],
    brother:[],
  },
  {
    no: '1',
    name: '结束',
    previous: ['2', '4', '5', '6'],
    next: [],
    brother:[],
    
  },
  {
    no: '2',
    name: 'b1',
    previous: ['0'],
    next: ['1'],
    brother:['3','4'],
    
  },
  {
    no: '3',
    name: 'b2',
    previous: ['0'],
    brother:['2','4'],
    next: ['5', '6'],
  },
  {
    no: '4',
    name: 'b3',
    previous: ['0'],
    brother:['2','3'],
    next: ['1'],
  },

  {
    no: '5',
    name: 'b4',
    previous: ['3'],
    brother:['6'],
    next: ['1'],
  },
  {
    no: '6',
    name: 'b5',
    previous: ['3'],
    brother:['5'],
    next: ['1'],
  },
];


const data3Start = [
  {
    no: '0',
    name: '开始',
    previous: [],
    next: ['2', '3', '4'],
  },
  {
    no: '1',
    name: '结束',
    previous: ['6','7','8'],
    next: [],
  },
  {
    no: '2',
    name: 'b1',
    previous: ['0'],
    next: ['5'],
  },
  {
    no: '3',
    name: 'b2',
    previous: ['0'],
    next: ['5'],
  },
  {
    no: '4',
    name: 'b3',
    previous: ['0'],
    next: ['5'],
  },

  {
    no: '5',
    name: 'b4',
    previous: ['2','3','4'],
    next: ['6','7','8'],
  },
  {
    no: '6',
    name: 'b5',
    previous: ['5'],
    next: ['1'],
  },
  {
    no: '7',
    name: 'b5',
    previous: ['5'],
    next: ['1'],
  },
  {
    no: '8',
    name: 'b5',
    previous: ['5'],
    next: ['1'],
  },
];
const data3End = [
  {
    no: '0',
    name: '开始',
    previous: [],
    next: ['2', '3', '4'],
    brother:[],
  },
  {
    no: '1',
    name: '结束',
    previous: ['6','7','8'],
    brother:[],
    next: [],
  },
  {
    no: '2',
    name: 'b1',
    previous: ['0'],
    brother:['3','4'],
    next: ['5'],
  },
  {
    no: '3',
    name: 'b2',
    previous: ['0'],
    brother:['2','4'],
    next: ['5'],
  },
  {
    no: '4',
    name: 'b3',
    brother:['2','3'],
    previous: ['0'],
    next: ['5'],
  },

  {
    no: '5',
    name: 'b4',
    brother:[],    
    previous: ['2','3','4'],
    next: ['6','7','8'],
  },
  {
    no: '6',
    name: 'b5',
    brother:['7','8'],
    previous: ['5'],
    next: ['1'],
  },
  {
    no: '7',
    name: 'b5',
    brother:['6','8'],
    previous: ['5'],
    next: ['1'],
  },
  {
    no: '8',
    brother:['6','7'],
    name: 'b5',
    previous: ['5'],
    next: ['1'],
  },
];


const data4Start = [
  {
    no: '0',
    name: '开始',
    previous: [],
    next: ['2', '3', '4'],
  },
  {
    no: '1',
    name: '结束',
    previous: ['5', '3', '4'],
    next: [],
  },
  {
    no: '2',
    name: 'b1',
    previous: ['0'],
    next: ['5'],
  },
  {
    no: '3',
    name: 'b2',
    previous: ['0'],
    next: ['1'],
  },
  {
    no: '4',
    name: 'b3',
    previous: ['0'],
    next: ['1'],
  },
  {
    no: '5',
    name: 'b3',
    previous: ['2'],
    next: ['6','7','8'],
  },
  {
    no: '6',
    name: 'b3',
    previous: ['5'],
    next: ['1'],
  },
  {
    no: '7',
    name: 'b3',
    previous: ['5'],
    next: ['1'],
  },
  {
    no: '8',
    name: 'b3',
    previous: ['5'],
    next: ['1'],
  },
];
const data4End = [
  {
    no: '0',
    name: '开始',
    previous: [],
    next: ['2', '3', '4'],
    brother:[],
  },
  {
    no: '1',
    brother:[],
    name: '结束',
    previous: ['5', '3', '4'],
    next: [],
  },
  {
    no: '2',
    name: 'b1',
    brother:['3','4'],
    previous: ['0'],
    next: ['5'],
  },
  {
    no: '3',
    brother:['2','4'],
    name: 'b2',
    previous: ['0'],
    next: ['1'],
  },
  {
    no: '4',
    brother:['2','3'],
    name: 'b3',
    previous: ['0'],
    next: ['1'],
  },
  {
    no: '5',
    brother:[],
    name: 'b3',
    previous: ['2'],
    next: ['6','7','8'],
  },
  {
    no: '6',
    name: 'b3',
    previous: ['5'],
    brother:['7','8'],
    next: ['1'],
  },
  {
    no: '7',
    name: 'b3',
    brother:['6','8'],
    previous: ['5'],
    next: ['1'],
  },
  {
    brother:['6','7'],
    no: '8',
    name: 'b3',
    previous: ['5'],
    next: ['1'],
  },
];


const {
  getNode,
  getHeadNode,
  getTailNode,
  getNextNodes,
  getPreviousNodes,
  buildBrother,
} = require('../utils/index_test.js')
const isEqual = require('lodash/isEqual');

const cloneDeep = require('lodash/cloneDeep');

const data1Return = buildBrother(cloneDeep(data1Start));
const data2Return = buildBrother(cloneDeep(data2Start));
const data3Return = buildBrother(cloneDeep(data3Start));
const data4Return = buildBrother(cloneDeep(data4Start));
const judge1 = isEqual(data1End, data1Return);
const judge2 = isEqual(data2End, data2Return);
const judge3 = isEqual(data3End, data3Return);
const judge4 = isEqual(data4End, data4Return);
console.log(judge1,judge2,judge3,judge4);
