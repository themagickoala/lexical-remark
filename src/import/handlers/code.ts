import lexicalCode from '@lexical/code';
import lexical from 'lexical';
import { Code } from 'mdast';

import { Handler } from '../parser.js';

export const code: Handler<Code> = (node, parser) => {
  const lexicalNode = lexicalCode.$createCodeNode();
  const lines = node.value.split('\n');
  lines.forEach((line, index) => {
    if (index > 0) {
      lexicalNode.append(lexical.$createLineBreakNode());
    }
    lexicalNode.append(lexicalCode.$createCodeHighlightNode(line));
  });
  parser.append(lexicalNode);
};
