import { Emphasis, Strong, Text } from 'mdast';
import { Handler } from '.';
import { TextNode } from 'lexical';

export const text: Handler<TextNode> = (node) => {
  const remarkNode: Text = {
    type: 'text',
    value: node.getTextContent(),
  };

  let nodeToAppend: Strong | Emphasis | Text = remarkNode;

  if (node.hasFormat('bold')) {
    const boldNode: Strong = {
      type: 'strong',
      children: [nodeToAppend],
    };
    nodeToAppend = boldNode;
  }

  if (node.hasFormat('italic')) {
    const italicNode: Emphasis = {
      type: 'emphasis',
      children: [nodeToAppend],
    };
    nodeToAppend = italicNode;
  }

  return nodeToAppend;
};