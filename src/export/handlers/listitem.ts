import { ListItem, BlockContent } from 'mdast';
import { Handler } from '.';
import { ListItemNode } from '@lexical/list';

export const listitem: Handler<ListItemNode> = (node, { rootHandler }) => {
  const remarkNode: ListItem = {
    type: 'listItem',
    children: node.getChildren()
      .map((child) => rootHandler(child, { rootHandler }))
      .filter((child): child is BlockContent => !!child),
  };

  return remarkNode;
};