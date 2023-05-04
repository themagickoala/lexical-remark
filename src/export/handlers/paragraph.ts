import { Paragraph, PhrasingContent } from 'mdast';
import { Handler } from '.';
import { $isLineBreakNode, $isTextNode, ParagraphNode } from 'lexical';

export const paragraph: Handler<ParagraphNode> = (node, { rootHandler }) => {
  const childNodes = node.getChildren();
  const children = [];
  for (let i = 0; i < childNodes.length; i++) {
    const child = childNodes[i];
    if ($isTextNode(child)) {
      let text = child.getTextContent();
      let next = childNodes[i + 1];
      let nextButOne = childNodes[i + 2];
      while ($isLineBreakNode(next) && $isTextNode(nextButOne)) {
        text += `\n${nextButOne.getTextContent()}`;
        i += 2;
        next = childNodes[i + 1];
        nextButOne = childNodes[i + 2];
      }
      children.push({
        type: 'text',
        value: text,
      });
    } else if ($isLineBreakNode(child)) {
      if ($isLineBreakNode(childNodes[i + 1])) {
        children.push({
          type: 'break',
        });
      }
    } else {
      children.push(rootHandler(child, { rootHandler }));
    }
  }
  const remarkNode: Paragraph = {
    type: 'paragraph',
    children: children.filter((child): child is PhrasingContent => !!child),
  };

  return remarkNode;
};