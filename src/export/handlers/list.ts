import type { ListNode } from '@lexical/list';
import { List, ListItem } from 'mdast';

import { Handler } from './index.js';

export const list: Handler<ListNode> = (node, { rootHandler }) => {
  const remarkNode: List = {
    children: node
      .getChildren()
      .map((child) => rootHandler(child, { rootHandler }))
      .filter((child): child is ListItem => !!child),
    ordered: node.getListType() === 'number',
    spread: false,
    type: 'list',
  };

  return remarkNode;
};
