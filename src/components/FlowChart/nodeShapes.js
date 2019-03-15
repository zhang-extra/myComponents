/** @format */
import React from 'react';

const Circle = (
  <symbol key="circle" id="circle" overflow="auto">
    <circle cx="50%" cy="50%" r="35.5%" />
  </symbol>
);

const Squareness = (
  <symbol key="squareness" id="squareness">
    <rect x="0.5%" y="0.5%" width="99%" height="99%" />
  </symbol>
);

const Rectangle = (
  <symbol key="rectangle" id="rectangle">
    <rect x="0.5%" y="19.5%" width="99%" height="60%" />
  </symbol>
);

const Ellipse = (
  <symbol key="ellipse" id="ellipse" overflow="auto">
    <ellipse cx="50%" cy="50%" rx="50%" ry="30%" />
  </symbol>
);

const nodeShapes = [Circle, Rectangle, Squareness, Ellipse];

export default nodeShapes;
