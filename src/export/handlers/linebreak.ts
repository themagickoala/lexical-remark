import { Break } from 'mdast';
import { Handler } from '.';
import { LineBreakNode } from 'lexical';

export const linebreak: Handler<LineBreakNode> = () => {
  const remarkNode: Break = {
    type: 'break',
  };

  return remarkNode;
};