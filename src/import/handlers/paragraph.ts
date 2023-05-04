import { $createParagraphNode } from 'lexical';
import { Paragraph } from "mdast";
import { Handler } from '.';

export const paragraph: Handler<Paragraph> = (node, { parent, formatting, rootHandler }) => {
  const lexicalNode = $createParagraphNode();
  node.children.forEach((child) => rootHandler(child, { parent: lexicalNode, formatting, rootHandler }));
  
  if (parent) {
    parent.append(lexicalNode);
  } else {
    return lexicalNode;
  }
};