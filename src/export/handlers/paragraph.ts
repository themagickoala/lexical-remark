import lexical, { type ParagraphNode } from 'lexical';
import { Content, Emphasis, InlineCode, Literal, Paragraph, Parent, PhrasingContent, Strong } from 'mdast';

import { Handler } from './index.js';

const textTypes = ['text', 'inlineCode'];
const wrapperTypes = ['emphasis', 'strong'];

function isTextType(node: unknown): node is Text | InlineCode {
  if (typeof node !== 'object' || !node) {
    return false;
  }
  if ('type' in node && typeof node.type === 'string') {
    return textTypes.includes(node.type);
  }
  return false;
}

function isWrapperType(node: unknown): node is Emphasis | Strong {
  if (typeof node !== 'object' || !node) {
    return false;
  }
  if ('type' in node && typeof node.type === 'string') {
    return wrapperTypes.includes(node.type);
  }
  return false;
}

export const paragraph: Handler<ParagraphNode> = (node, { rootHandler }) => {
  const childNodes = node.getChildren();
  const children: Array<Parent | Content> = [];
  for (let i = 0; i < childNodes.length; i++) {
    const child = childNodes[i];
    const newChild = rootHandler(child, { rootHandler });
    if (lexical.$isTextNode(child) && children.length > 0) {
      const lastChild = children[children.length - 1];
      if (isTextType(lastChild) && isTextType(newChild) && lastChild.type === newChild.type) {
        lastChild.value += newChild.value;
        continue;
      } else if (isWrapperType(lastChild) && isWrapperType(newChild) && lastChild.type === newChild.type) {
        let lastChildTextNode = lastChild.children[0];
        let newChildTextNode = newChild.children[0];
        while (
          isWrapperType(lastChildTextNode) &&
          isWrapperType(newChildTextNode) &&
          lastChildTextNode.type === newChildTextNode.type
        ) {
          lastChildTextNode = lastChildTextNode.children[0];
          newChildTextNode = newChildTextNode.children[0];
        }
        (lastChild.children[0] as Literal).value += (newChild.children[0] as Literal).value;
        continue;
      }
    } else if (lexical.$isLineBreakNode(child)) {
      children.push({
        type: 'break',
      });
      continue;
    }

    if (newChild) {
      children.push(newChild as Parent | Content);
    }
  }
  const remarkNode: Paragraph = {
    children: children
      .filter((child): child is PhrasingContent => !!child)
      .reduce<PhrasingContent[]>((acc, child) => {
        const latest = acc[acc.length - 1];
        const latestButOne = acc[acc.length - 2];
        if (latestButOne?.type === 'text' && latest?.type === 'break' && child.type === 'text') {
          latestButOne.value += `\n${child.value}`;
          acc.pop();
          return acc;
        }
        return [...acc, child];
      }, []),
    type: 'paragraph',
  };

  return remarkNode;
};
