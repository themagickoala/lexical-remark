import { Strong } from 'mdast';

import { Handler } from '../parser.js';

export const strong: Handler<Strong> = (node, parser) => {
  parser.formatting.push('bold');
  node.children.forEach((child) => {
    parser.parse(child);
  });
  parser.formatting.pop();
};
