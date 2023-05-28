import type { RootNode } from 'lexical';
import { Content, Root } from 'mdast';

import { Handler } from './index.js';

export const root: Handler<RootNode> = (node, { rootHandler }) => {
  const remarkNode: Root = {
    children: node
      .getChildren()
      .map((child) => rootHandler(child, { rootHandler }))
      .filter((child): child is Content => !!child),
    type: 'root',
  };

  return remarkNode;
};
