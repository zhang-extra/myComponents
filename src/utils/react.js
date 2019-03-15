import * as React from 'react';
import { endsWith } from 'lodash';

const { useEffect, useRef, useState } = React;

export function init(initFunc) {
  const isInit = useRef(false);
  useEffect(()=> {
    if (!isInit.current) {
      if (initFunc) initFunc();
      isInit.current = true;
    }
  });
}

export function convertSize(size) {
  if (typeof size === 'number') return `${size}px`;
  const units = ['px', '%', 'rem', 'em', 'vh', 'vw'];
  if (typeof size === 'string') for (let i = 0, length = units.length; i < length; i += 1) if (endsWith(size, units[i])) return size;
  return 'error';
}