import { Heading, PhrasingContent } from 'mdast';
import { HeadingNode } from '@lexical/rich-text';
import { Handler } from "./index.js";

export const heading: Handler<HeadingNode> = (node, { rootHandler }) => {
  const remarkNode: Heading = {
    type: 'heading',
    depth: (+node.getTag()[1]) as 1 | 2 | 3 | 4 | 5 | 6,
    children: node.getChildren()
      .map((child) => rootHandler(child, { rootHandler }))
      .filter((child): child is PhrasingContent => !!child),
  };

  return remarkNode;
};