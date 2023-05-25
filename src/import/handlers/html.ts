import lexical from "lexical";
import { HTML } from "mdast";
import { parseFragment, serializeOuter } from "parse5";
import type { Element, TextNode } from 'parse5/dist/tree-adapters/default.js';
import { $createCollapsibleContainerNode } from "../../extensions/collapsible/container/node.js";
import { $createCollapsibleContentNode } from "../../extensions/collapsible/content/node.js";
import { $createCollapsibleTitleNode } from "../../extensions/collapsible/title/node.js";
import { Handler } from "./index.js";
import { fromMarkdown } from 'mdast-util-from-markdown';
import { root } from "./root.js";

export const html: Handler<HTML> = (node, { parent, formatting, rootHandler }) => {
  let lexicalNode: lexical.LexicalNode | undefined;
  const parsedNode = parseFragment(node.value);

  if (parsedNode.childNodes.length === 1) {
    const childNode = parsedNode.childNodes[0];

    if ('tagName' in childNode && childNode.nodeName === "details") {
      const detailsNode = childNode as unknown as Element;

      const openAttr = detailsNode.attrs.find((a) => a.name === 'open');
      const isOpen = !!openAttr && (openAttr.value === 'true' || openAttr.value === '');

      const summaryNode = detailsNode.childNodes.find((n): n is Element => 'tagName' in n && n.tagName === 'summary');
      if (!!summaryNode) {
        const summaryText = summaryNode.childNodes.find((n): n is TextNode => 'value' in n && n.nodeName === '#text')?.value ?? '';
        const titleNode = $createCollapsibleTitleNode();
        titleNode.append(lexical.$createTextNode(summaryText));

        const remainder = detailsNode.childNodes.filter((n) => n.nodeName !== 'summary');
        const text = remainder.reduce((p, c) => p + serializeOuter(c), '');
        const contentTree = fromMarkdown(text.trim());
        const contentNode = $createCollapsibleContentNode();
        const nestedContent = root(contentTree, { parent: undefined, formatting, rootHandler });
        if (nestedContent && Array.isArray(nestedContent)) {
          contentNode.append(...nestedContent);
        }

        lexicalNode = $createCollapsibleContainerNode(isOpen);
        lexicalNode.append(titleNode, contentNode);
      }
    }
  }

  if (!lexicalNode) {
    lexicalNode = lexical.$createTextNode(node.value);
  }
  
  if (parent) {
    parent.append(lexicalNode);
  } else {
    return lexicalNode as lexical.ElementNode;
  }
};