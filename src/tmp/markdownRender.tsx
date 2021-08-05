import React from 'react';
import { Block } from '../types/block';

const markdownRender = (block: Block) => {
  const string = block.text;

  if (block.styles?.[0] !== undefined) {
    const { startOffset, endOffset } = block.styles[0];
    const stringArray = [];
    stringArray.push(string.substring(0, startOffset));
    const propString = string.substring(startOffset, endOffset);
    stringArray.push(<span>{propString}</span>);
    stringArray.push(string.substring(endOffset, string.length));
  }
};

export default markdownRender;
