import lexicalLink from '@lexical/link';
import { Link } from 'mdast';

import { Handler } from '../parser.js';

export const link: Handler<Link> = (node, parser) => {
  const lexicalNode = lexicalLink.$createLinkNode(node.url, { title: node.title });
  parser.stack.push(lexicalNode);
  node.children.forEach((child) => {
    parser.parse(child);
  });
  parser.stack.pop();
  parser.append(lexicalNode);
};
