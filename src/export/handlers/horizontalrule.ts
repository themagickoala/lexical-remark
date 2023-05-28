import type { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode.js';
import { ThematicBreak } from 'mdast';

import { Handler } from './index.js';

export const horizontalrule: Handler<HorizontalRuleNode> = () => {
  const remarkNode: ThematicBreak = {
    type: 'thematicBreak',
  };

  return remarkNode;
};
