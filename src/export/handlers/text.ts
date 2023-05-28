import type { TextNode } from 'lexical';
import { Emphasis, InlineCode, Strong, Text } from 'mdast';

import { Handler } from './index.js';

export const text: Handler<TextNode> = (node) => {
  const remarkNode: Text | InlineCode = {
    type: node.hasFormat('code') ? 'inlineCode' : 'text',
    value: node.getTextContent(),
  };

  let nodeToAppend: Strong | Emphasis | Text | InlineCode = remarkNode;

  if (node.hasFormat('bold')) {
    const boldNode: Strong = {
      children: [nodeToAppend],
      type: 'strong',
    };
    nodeToAppend = boldNode;
  }

  if (node.hasFormat('italic')) {
    const italicNode: Emphasis = {
      children: [nodeToAppend],
      type: 'emphasis',
    };
    nodeToAppend = italicNode;
  }

  return nodeToAppend;
};
