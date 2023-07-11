/* eslint-disable @typescript-eslint/no-use-before-define */
import lexical, { type LexicalNode } from 'lexical';
import { HTML } from 'mdast';
import { fromMarkdown } from 'mdast-util-from-markdown';

import { $createCollapsibleContainerNode } from '../../extensions/collapsible/container/node.js';
import { $createCollapsibleContentNode } from '../../extensions/collapsible/content/node.js';
import { $createCollapsibleTitleNode } from '../../extensions/collapsible/title/node.js';
import { Handler, Parser } from '../parser.js';
import { dummyRoot } from './root.js';

const detailsRegex =
  /^<details\s*(?<openAttr>open(=['"](?<openAttrValue>true|false)['"])?)?><summary>(?<title>.*?)<\/summary>\s*(?<content>.*?)\n*?((?<closingTag><\/details>)(?<rest>.*)|$)/s;
const closingTagRegex = /^\n*<\/details>(?<rest>.*)/s;

const getLexicalNodeFromHtmlRemarkNode: (...args: Parameters<Handler<HTML>>) => boolean = (node, parser) => {
  const match = node.value.match(detailsRegex);

  if (match?.groups) {
    const lexicalNode = $createCollapsibleContainerNode(false);

    const summaryText = match.groups.title;

    const titleNode = $createCollapsibleTitleNode();
    titleNode.append(lexical.$createTextNode(summaryText));

    lexicalNode.append(titleNode);

    parser.stack.push(lexicalNode);

    const contentNode = $createCollapsibleContentNode();

    if (match.groups.closingTag) {
      const contentTree = fromMarkdown(match.groups.content.trim());
      const nestedParser = new Parser();
      const nestedContent = dummyRoot(contentTree, nestedParser).getChildren();
      if (nestedContent && Array.isArray(nestedContent)) {
        contentNode.append(...nestedContent);
      }

      lexicalNode.append(contentNode);
      parser.stack.pop();
      parser.append(lexicalNode);
      if (match.groups.rest) {
        html(
          {
            type: 'html',
            value: match.groups.rest,
          },
          parser,
        );
      }
    } else {
      parser.stack.push(contentNode);
      if (match.groups.content) {
        const contentTree = fromMarkdown(match.groups.content.trim());
        const nestedParser = new Parser();
        const nestedContent = dummyRoot(contentTree, nestedParser).getChildren();
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

  const match = node.value.match(closingTagRegex);

  if (match) {
    const contentNode = parser.stack.pop() as LexicalNode;
    parser.append(contentNode);
    const detailsNode = parser.stack.pop() as LexicalNode;
    parser.append(detailsNode);
    if (match.groups?.rest) {
      html(
        {
          type: 'html',
          value: match.groups.rest,
        },
        parser,
      );
    }
    return;
  }

  parser.append(lexical.$createParagraphNode().append(lexical.$createTextNode(node.value)));
};
