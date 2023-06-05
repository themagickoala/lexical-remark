import lexicalList from '@lexical/list';
import type { LexicalNode } from 'lexical';
import { ListItem } from 'mdast';

import { Handler } from '../parser.js';

export const listItem: Handler<ListItem> = (node, parser) => {
  if (!lexicalList.$isListNode(parser.stack[parser.stack.length - 1] as LexicalNode)) {
    return;
  }
  const lexicalNode = lexicalList.$createListItemNode();
  parser.stack.push(lexicalNode);
  node.children.forEach((child) => parser.parse(child));
  parser.stack.pop();
  parser.append(lexicalNode);
};
