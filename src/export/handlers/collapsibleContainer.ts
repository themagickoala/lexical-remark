import { Content, HTML } from 'mdast';

import { CollapsibleContainerNode } from '../../extensions/collapsible/container/node.js';
import { CollapsibleContentNode } from '../../extensions/collapsible/content/node.js';
import { CollapsibleTitleNode } from '../../extensions/collapsible/title/node.js';
import { serializeFromRemark } from '../RemarkExport.js';
import { Handler } from './index.js';

export const collapsibleContainer: Handler<CollapsibleContainerNode> = (node, { rootHandler }) => {
  const [titleChild, contentChild] = node.getChildren();
  const titleText =
    titleChild instanceof CollapsibleTitleNode ? titleChild.getChildren()[0]?.getTextContent() ?? '' : '';
  const contentNodes = contentChild instanceof CollapsibleContentNode ? contentChild.getChildren() : [];
  const remarkNodes = contentNodes.map((n) => rootHandler(n, { rootHandler })).filter((n): n is Content => !!n);
  const contentText = serializeFromRemark({
    children: remarkNodes,
    type: 'root',
  });
  const remarkNode: HTML = {
    type: 'html',
    value: `<details><summary>${titleText}</summary>\n${contentText}\n</details>`,
  };

  return remarkNode;
};
