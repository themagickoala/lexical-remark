import lexical from 'lexical';
import { Root } from 'mdast';

import { DummyRootNode } from '../../extensions/collapsible/dummyRoot/node.js';
import { Handler } from '../parser.js';

export const root: Handler<Root> = (node, parser) => {
  const lexicalNode = new lexical.RootNode();
  parser.push(lexicalNode);
  node.children.forEach((child) => parser.parse(child));
  parser.pop();
  return lexicalNode;
};

export const dummyRoot: Handler<Root> = (node, parser) => {
  const lexicalNode = new DummyRootNode();
  parser.push(lexicalNode);
  node.children.forEach((child) => parser.parse(child));
  parser.pop();
  return lexicalNode;
};
