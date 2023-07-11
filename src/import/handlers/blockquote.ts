import lexicalRichText from '@lexical/rich-text';
import { Blockquote } from 'mdast';

import { Handler } from '../parser.js';

export const blockquote: Handler<Blockquote> = (node, parser) => {
  const lexicalNode = lexicalRichText.$createQuoteNode();
  parser.push(lexicalNode);
  node.children.forEach((child) => parser.parse(child));
  parser.pop();
  parser.append(lexicalNode);
};
