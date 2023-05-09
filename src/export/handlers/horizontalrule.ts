import { ThematicBreak } from 'mdast';
import { Handler } from "./index.js";
import type { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode.js';

export const horizontalrule: Handler<HorizontalRuleNode> = () => {
  const remarkNode: ThematicBreak = {
    type: 'thematicBreak',
  };

  return remarkNode;
};