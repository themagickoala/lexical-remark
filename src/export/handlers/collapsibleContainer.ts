import { CollapsibleContentNode } from '../../extensions/collapsible/content/node';
import { CollapsibleContainerNode } from '../../extensions/collapsible/container/node.js';
import { HTML } from 'mdast';
import { Handler } from "./index.js";
import { CollapsibleTitleNode } from '../../extensions/collapsible/title/node.js';

export const collapsibleContainer: Handler<CollapsibleContainerNode> = (node, { rootHandler }) => {
  const [titleChild, contentChild] = node.getChildren();
  const titleText = titleChild instanceof CollapsibleTitleNode ? titleChild.getChildren()[0].getTextContent() : '';
  const contentText = contentChild instanceof CollapsibleContentNode ? contentChild.getChildren()[0].getChildren()[0].getTextContent() : '';
  const remarkNode: HTML = {
    type: 'html',
    value: `<details${node.isOpen ? ' open' : ''}><summary>${titleText}</summary>${contentText}</details>`
  };

  return remarkNode;
};