import { CollapsibleContentNode } from '../../extensions/collapsible/content/node.js';
import { CollapsibleContainerNode } from '../../extensions/collapsible/container/node.js';
import { Content, HTML } from 'mdast';
import { Handler } from "./index.js";
import { CollapsibleTitleNode } from '../../extensions/collapsible/title/node.js';
import { serializeFromRemark } from '../RemarkExport.js';

export const collapsibleContainer: Handler<CollapsibleContainerNode> = (node, { rootHandler }) => {
  const [titleChild, contentChild] = node.getChildren();
  const titleText = titleChild instanceof CollapsibleTitleNode ? titleChild.getChildren()[0]?.getTextContent() ?? '' : '';
  const contentNodes = contentChild instanceof CollapsibleContentNode ? contentChild.getChildren() : [];
  const remarkNodes = contentNodes.map((n) => rootHandler(n, { rootHandler })).filter((n): n is Content => !!n);
  const contentText = serializeFromRemark({
    type: 'root',
    children: remarkNodes,
  })
  const remarkNode: HTML = {
    type: 'html',
    value: `<details${node.getOpen() ? ' open' : ''}><summary>${titleText}</summary>\n${contentText}\n</details>`
  };

  return remarkNode;
};