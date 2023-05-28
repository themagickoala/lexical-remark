import type { ListItemNode } from '@lexical/list';
import { ListItem, PhrasingContent } from 'mdast';

import { Handler } from './index.js';

export const listitem: Handler<ListItemNode> = (node, { rootHandler }) => {
  const remarkNode: ListItem = {
    children: [
      {
        children: node
          .getChildren()
          .map((child) => rootHandler(child, { rootHandler }))
          .filter((child): child is PhrasingContent => !!child),
        type: 'paragraph',
      },
    ],
    type: 'listItem',
  };

  return remarkNode;
};
