import lexicalRichText from '@lexical/rich-text';
import { Heading } from 'mdast';

import { Handler } from '../parser.js';

export const heading: Handler<Heading> = (node, parser) => {
  const rank = Math.max(Math.min(6, node.depth || 1), 1) as 1 | 2 | 3 | 4 | 5 | 6;
  const lexicalNode = lexicalRichText.$createHeadingNode(`h${rank}`);
  parser.push(lexicalNode);
  node.children.forEach((child) => parser.parse(child));
  parser.pop();
  parser.append(lexicalNode);
};
