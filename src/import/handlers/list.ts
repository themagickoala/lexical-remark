import lexicalList from '@lexical/list';
import { List } from 'mdast';

import { Handler } from '../parser.js';

export const list: Handler<List> = (node, parser) => {
  const lexicalNode = lexicalList.$createListNode(node.ordered ? 'number' : 'bullet');
  parser.push(lexicalNode);
  node.children.forEach((child) => {
    if (child.type === 'listItem') {
      parser.parse(child);
    }
  });
  parser.pop(lexicalNode);
  parser.append(lexicalNode);
};
