import { Handler } from "./index.js";
import { CodeNode } from '@lexical/code';
import { Code } from 'mdast';
import { $isTextNode, $isLineBreakNode } from 'lexical';

export const code: Handler<CodeNode> = (node) => {
  const remarkNode: Code = {
    type: 'code',
    value: node.getChildren().map((child) => {
      if ($isTextNode(child)) {
        return child.getTextContent();
      } else if ($isLineBreakNode(child)) {
        return '\n';
      } else {
        return '';
      }
    }).join(''),
  };

  return remarkNode;
};