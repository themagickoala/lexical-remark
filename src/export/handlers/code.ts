import type { CodeNode } from '@lexical/code';
import lexical from 'lexical';
import { Code } from 'mdast';

import { Handler } from './index.js';

export const code: Handler<CodeNode> = (node) => {
  const remarkNode: Code = {
    type: 'code',
    value: node
      .getChildren()
      .map((child) => {
        if (lexical.$isTextNode(child)) {
          return child.getTextContent();
        } else if (lexical.$isLineBreakNode(child)) {
          return '\n';
        } else {
          return '';
        }
      })
      .join(''),
  };

  return remarkNode;
};
