/* eslint-disable @typescript-eslint/no-use-before-define */
import lexical, { type LexicalNode } from 'lexical';
import { HTML } from 'mdast';
import { fromMarkdown } from 'mdast-util-from-markdown';

import {
  $createCollapsibleContainerNode,
  $isCollapsibleContainerNode,
} from '../../extensions/collapsible/container/node.js';
import { $createCollapsibleContentNode, $isCollapsibleContentNode } from '../../extensions/collapsible/content/node.js';
import { DummyRootNode } from '../../extensions/collapsible/dummyRoot/node.js';
import { $createCollapsibleTitleNode } from '../../extensions/collapsible/title/node.js';
import { Handler, Parser } from '../parser.js';
import { dummyRoot } from './root.js';

const detailsAloneRegex = /^\s*<details\s*(?:open(?:=['"](?:true|false)['"])?)?>\s*$/s;
const restAloneRegex =
  /^\s*<summary>(?<title>.*?)<\/summary>\s*(?<content>.*?)\n*?(?:(?<closingTag><\/details>)(?<rest>.*)|$)/s;
const detailsRegex =
  /^\s*<details\s*(?:open(?:=['"](?:true|false)['"])?)?>\s*<summary>(?<title>.*?)<\/summary>\s*(?<content>.*?)\n*?(?:(?<closingTag><\/details>)(?<rest>.*)|$)/s;
const closingTagRegex = /^\n*<\/details>(?<rest>.*)/s;

const processDetailsAlone = (parser: Parser, match: RegExpMatchArray): void => {
  const lexicalNode = $createCollapsibleContainerNode(false);
  parser.push(lexicalNode);
};

const processRestAlone = (parser: Parser, match: RegExpMatchArray): void => {
  // istanbul ignore if: This is a TS guard
  if (!match?.groups) {
    return;
  }

  // title can be const, but the other variables need to be let
  // eslint-disable-next-line prefer-const
  let { closingTag, content, rest, title } = match.groups;
  const contentMatch = content.match(detailsRegex);
  const restMatch = rest?.match(closingTagRegex);
  if (contentMatch && !contentMatch?.groups?.closingTag && closingTag) {
    // Nested content has no closing tag, we need to grab the one from the parent content.
    // The parent content is now no longer self closing
    content = content + '\n\n' + closingTag;
    closingTag = '';

    if (restMatch) {
      closingTag = restMatch[0];
      rest = restMatch.groups?.rest ?? '';
    }
  }

  const summaryText = title;

  const titleNode = $createCollapsibleTitleNode();
  titleNode.append(lexical.$createTextNode(summaryText));

  parser.append(titleNode);

  const contentNode = $createCollapsibleContentNode();

  if (closingTag) {
    // Nested content has a closing tag or no details tag at all
    const contentTree = fromMarkdown(content.trim());
    const nestedParser = new Parser();
    const nestedContent = dummyRoot(contentTree, nestedParser).getChildren();
    if (nestedContent && Array.isArray(nestedContent)) {
      contentNode.append(...nestedContent);
    }
    parser.append(contentNode);
    const containerNode = parser.pop();
    parser.append(containerNode as LexicalNode);
    if (rest) {
      html(
        {
          type: 'html',
          value: rest,
        },
        parser,
      );
    }
  } else {
    parser.push(contentNode);
    if (content) {
      const contentTree = fromMarkdown(content.trim());
      const nestedParser = new Parser();
      const nestedRoot = dummyRoot(contentTree, nestedParser);
      const nestedContent = nestedRoot.getChildren();
      if ((nestedRoot as DummyRootNode).getStack()) {
        parser.stack.push(...(nestedRoot as DummyRootNode).getStack());
      }
      if (nestedContent && Array.isArray(nestedContent)) {
        contentNode.append(...nestedContent);
      }
    }
  }
};

const processAll = (parser: Parser, match: RegExpMatchArray): void => {
  processDetailsAlone(parser, match);
  processRestAlone(parser, match);
};

const processClose = (parser: Parser, match: RegExpMatchArray): void => {
  const contentNode = parser.pop($isCollapsibleContentNode) as LexicalNode;
  parser.append(contentNode);
  const detailsNode = parser.pop($isCollapsibleContainerNode) as LexicalNode;
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
};

export const html: Handler<HTML> = (node, parser) => {
  const allMatch = node.value.match(detailsRegex);
  if (allMatch?.groups) {
    processAll(parser, allMatch);
    return;
  }
  const detailsAloneMatch = node.value.match(detailsAloneRegex);
  if (detailsAloneMatch) {
    processDetailsAlone(parser, detailsAloneMatch);
    return;
  }
  const restAloneMatch = node.value.match(restAloneRegex);
  if (restAloneMatch?.groups) {
    processRestAlone(parser, restAloneMatch);
    return;
  }
  const closingTagMatch = node.value.match(closingTagRegex);
  if (closingTagMatch) {
    processClose(parser, closingTagMatch);
    return;
  }

  parser.append(lexical.$createParagraphNode().append(lexical.$createTextNode(node.value)));
};
