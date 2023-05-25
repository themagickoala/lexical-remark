import { ListItem, PhrasingContent } from 'mdast';
import { Handler } from "./index.js";
import type { ListItemNode } from '@lexical/list';

export const listitem: Handler<ListItemNode> = (node, { rootHandler }) => {
  const remarkNode: ListItem = {
    type: 'listItem',
    children: [{
      type: 'paragraph',
      children: node.getChildren()
        .map((child) => rootHandler(child, { rootHandler }))
        .filter((child): child is PhrasingContent => !!child),
    }],
  };

  return remarkNode;
};