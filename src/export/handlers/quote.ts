import type { QuoteNode } from '@lexical/rich-text';
import { BlockContent, Blockquote } from 'mdast';

import { Handler } from './index.js';

export const quote: Handler<QuoteNode> = (node, { rootHandler }) => {
  const remarkNode: Blockquote = {
    children: node
      .getChildren()
      .map((child) => rootHandler(child, { rootHandler }))
      .filter((child): child is BlockContent => !!child),
    type: 'blockquote',
  };

  return remarkNode;
};
