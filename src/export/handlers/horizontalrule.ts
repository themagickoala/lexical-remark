import { ThematicBreak } from 'mdast';
import { Handler } from "./index.js";
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';

export const horizontalrule: Handler<HorizontalRuleNode> = () => {
  const remarkNode: ThematicBreak = {
    type: 'thematicBreak',
  };

  return remarkNode;
};