import type { LinkNode } from '@lexical/link';
import { Link, StaticPhrasingContent } from 'mdast';

import { Handler } from './index.js';

export const link: Handler<LinkNode> = (node, { rootHandler }) => {
  const remarkNode: Link = {
    children: node
      .getChildren()
      .map((child) => rootHandler(child, { rootHandler }))
      .filter((child): child is StaticPhrasingContent => !!child),
    title: node.getTitle(),
    type: 'link',
    url: node.getURL(),
  };

  return remarkNode;
};
