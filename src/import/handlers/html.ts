import lexical from 'lexical';
import { HTML } from 'mdast';
import { fromMarkdown } from 'mdast-util-from-markdown';

import { $createCollapsibleContainerNode } from '../../extensions/collapsible/container/node.js';
import { $createCollapsibleContentNode } from '../../extensions/collapsible/content/node.js';
import { $createCollapsibleTitleNode } from '../../extensions/collapsible/title/node.js';
import { Handler, Parser } from '../parser.js';
import { root } from './root.js';

const detailsRegex =
  /^<details\s*(?<openAttr>open(=['"](?<openAttrValue>true|false)['"])?)?><summary>(?<title>.*?)<\/summary>(?<content>.*?)(?<closingTag><\/details>)?$/s;
const closingTagRegex = /^<\/details>$/s;

const getLexicalNodeFromHtmlRemarkNode: (...args: Parameters<Handler<HTML>>) => boolean = (node, parser) => {
  const match = node.value.match(detailsRegex);

  if (match?.groups) {
    const { openAttr, openAttrValue } = match.groups;
    const isOpen = !!match.groups.openAttr && match.groups.openAttrValue !== 'false';
    const lexicalNode = $createCollapsibleContainerNode(isOpen);

    const summaryText = match.groups.title;

    const titleNode = $createCollapsibleTitleNode();
    titleNode.append(lexical.$createTextNode(summaryText));

    lexicalNode.append(titleNode);

    parser.stack.push(lexicalNode);

    const contentNode = $createCollapsibleContentNode();

    if (match.groups.closingTag) {
      const contentTree = fromMarkdown(match.groups.content.trim());
      const nestedParser = new Parser();
      const nestedContent = root(contentTree, nestedParser).getChildren();
      if (nestedContent && Array.isArray(nestedContent)) {
        contentNode.append(...nestedContent);
      }

      lexicalNode.append(contentNode);
      parser.stack.pop();
      parser.append(lexicalNode);
    } else {
      parser.stack.push(contentNode);
      if (match.groups.content) {
        const contentTree = fromMarkdown(match.groups.content.trim());
        const nestedParser = new Parser();
        const nestedContent = root(contentTree, nestedParser).getChildren();
        if (nestedContent && Array.isArray(nestedContent)) {
          contentNode.append(...nestedContent);
        }
      }
    }
    return true;
  }

  return false;
};

export const html: Handler<HTML> = (node, parser) => {
  if (getLexicalNodeFromHtmlRemarkNode(node, parser)) {
    return;
  }

  if (closingTagRegex.test(node.value)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const contentNode = parser.stack.pop()!;
    parser.append(contentNode);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const detailsNode = parser.stack.pop()!;
    parser.append(detailsNode);
    return;
  }

  parser.append(lexical.$createParagraphNode().append(lexical.$createTextNode(node.value)));
};
