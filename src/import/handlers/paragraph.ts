import lexical from 'lexical';
import { Paragraph } from 'mdast';

import { Handler } from '../parser.js';

export const paragraph: Handler<Paragraph> = (node, parser) => {
  const lexicalNode = lexical.$createParagraphNode();
  parser.push(lexicalNode);
  node.children.forEach((child) => parser.parse(child));
  parser.pop(lexicalNode);
  parser.append(lexicalNode);
};
