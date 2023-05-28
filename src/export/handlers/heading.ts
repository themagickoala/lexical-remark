import type { HeadingNode } from '@lexical/rich-text';
import { Heading, PhrasingContent } from 'mdast';

import { Handler } from './index.js';

export const heading: Handler<HeadingNode> = (node, { rootHandler }) => {
  const remarkNode: Heading = {
    children: node
      .getChildren()
      .map((child) => rootHandler(child, { rootHandler }))
      .filter((child): child is PhrasingContent => !!child),
    depth: +node.getTag()[1] as 1 | 2 | 3 | 4 | 5 | 6,
    type: 'heading',
  };

  return remarkNode;
};
