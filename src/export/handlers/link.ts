import { Link, StaticPhrasingContent } from 'mdast';
import { Handler } from "./index.js";
import type { LinkNode } from '@lexical/link';

export const link: Handler<LinkNode> = (node, { rootHandler }) => {
  const remarkNode: Link = {
    type: 'link',
    url: node.getURL(),
    title: node.getTitle(),
    children: node.getChildren()
      .map((child) => rootHandler(child, { rootHandler }))
      .filter((child): child is StaticPhrasingContent => !!child),
  };

  return remarkNode;
};