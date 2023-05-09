import { Content, Root } from 'mdast';
import { Handler } from "./index.js";
import type { RootNode } from 'lexical';

export const root: Handler<RootNode> = (node, { rootHandler }) => {
  const remarkNode: Root = {
    type: 'root',
    children: node.getChildren()
      .map((child) => rootHandler(child, { rootHandler }))
      .filter((child): child is Content => !!child),
  };

  return remarkNode;
};